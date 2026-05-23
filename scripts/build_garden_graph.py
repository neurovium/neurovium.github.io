#!/usr/bin/env python3
"""Build the Idea Garden knowledge graph.

Reads every paper in `_papers/`, the curated `_data/concepts.yml`, normalizes
the tag vocabulary, and emits `assets/data/garden-graph.json` containing
paper nodes, concept nodes, and three classes of edges:

  - paper-concept (explicit): from a paper's `tags:` array, or from the
    curated `concepts.yml` `papers:` list. Weight 1.0.
  - paper-concept (mined): TF-IDF over (title + description + abstract) using
    the concept vocabulary as the term list, top-K per paper. Weight 0.6.
    Falls back to substring matching if scikit-learn is not available.
  - concept-concept (cooccurrence): Jaccard similarity when two concepts share
    >= 2 papers. Weight = Jaccard, edges below 0.15 dropped.

Run from the repo root:

    python scripts/build_garden_graph.py

Output is sorted and deterministic so the committed JSON shows no diff when
nothing has changed.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.stderr.write("pyyaml is required: pip install pyyaml\n")
    sys.exit(1)

try:
    from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore
    HAVE_SKLEARN = True
except ImportError:
    HAVE_SKLEARN = False


REPO_ROOT = Path(__file__).resolve().parent.parent
PAPERS_DIR = REPO_ROOT / "_papers"
CONCEPTS_FILE = REPO_ROOT / "_data" / "concepts.yml"
OUTPUT_FILE = REPO_ROOT / "assets" / "data" / "garden-graph.json"

WASH_POOL = [
    "--wash-slate", "--wash-plum", "--wash-teal",
    "--wash-oxblood", "--wash-dust", "--wash-amber", "--wash-rust",
]

# Canonical tag aliases — left side maps to canonical name on the right.
# Keys are lower-cased; values are display-cased.
ALIAS_MAP = {
    "local field potential": "LFP",
    "local field potentials": "LFP",
    "lfp": "LFP",
    "statistical-physics": "Statistical Physics",
    "statistical physics": "Statistical Physics",
    "information-theory": "Information Theory",
    "information theory": "Information Theory",
    "inhibiton": "Inhibition",
    "inhibition": "Inhibition",
    "inhibitory": "Inhibition",
    "deep-learning": "Deep Learning",
    "deep learning": "Deep Learning",
    "neural-networks": "Neural Networks",
    "neural networks": "Neural Networks",
    "coarse-graining": "Coarse-Graining",
    "renormalization-group": "Renormalization Group",
    "renormalization group": "Renormalization Group",
}


FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?\n)---\s*\n(.*)$", re.DOTALL)
ABSTRACT_HEAD_RE = re.compile(r"^\s*\*?Abstract\*?\s*\n", re.IGNORECASE)
HTML_TAG_RE = re.compile(r"<[^>]+>")


def parse_paper(path: Path):
    """Return (front_matter_dict, body_text) or None on parse failure."""
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    try:
        fm = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        sys.stderr.write(f"  ! skip {path.name}: malformed YAML ({e.__class__.__name__})\n")
        return None
    body = m.group(2)
    # Strip leading `*Abstract*` marker if present.
    body = ABSTRACT_HEAD_RE.sub("", body, count=1)
    body = HTML_TAG_RE.sub(" ", body)
    return fm, body


def canonicalize_tag(raw: str) -> str:
    if not raw:
        return ""
    key = raw.strip().lower()
    if key in ALIAS_MAP:
        return ALIAS_MAP[key]
    return raw.strip()


def stable_wash(name: str) -> str:
    """Deterministically pick a wash token for an uncurated concept."""
    h = int(hashlib.sha1(name.encode("utf-8")).hexdigest(), 16)
    return WASH_POOL[h % len(WASH_POOL)]


def main() -> int:
    if not PAPERS_DIR.is_dir():
        sys.stderr.write(f"papers dir not found: {PAPERS_DIR}\n")
        return 1

    # --- Load curated concepts -------------------------------------------------
    curated = {}
    if CONCEPTS_FILE.is_file():
        try:
            curated_raw = yaml.safe_load(CONCEPTS_FILE.read_text(encoding="utf-8")) or {}
            for name, data in curated_raw.items():
                curated[name.strip()] = {
                    "wash": (data or {}).get("wash") or "--wash-slate",
                    "blurb": (data or {}).get("blurb") or "",
                    "papers": list((data or {}).get("papers") or []),
                }
        except yaml.YAMLError as e:
            sys.stderr.write(f"  ! concepts.yml malformed, ignoring ({e})\n")

    # --- Load papers -----------------------------------------------------------
    papers = []  # list of dicts: { id, slug, title, year, url, wash, tags, text }
    for path in sorted(PAPERS_DIR.glob("*.md")):
        parsed = parse_paper(path)
        if parsed is None:
            continue
        fm, body = parsed
        slug = path.stem  # Jekyll permalink uses /papers/:path/ — the file stem.
        pid = fm.get("id") or slug
        title = (fm.get("title") or "").strip()
        if not title:
            sys.stderr.write(f"  ! skip {path.name}: no title\n")
            continue
        raw_tags = fm.get("tags") or []
        tags = []
        seen = set()
        for t in raw_tags:
            ct = canonicalize_tag(str(t))
            if not ct:
                continue
            k = ct.lower()
            if k in seen:
                continue
            seen.add(k)
            tags.append(ct)
        text_parts = [title, str(fm.get("subtitle") or ""), str(fm.get("description") or ""), body]
        text = "\n".join(p for p in text_parts if p)
        papers.append({
            "id": str(pid),
            "slug": slug,
            "title": title,
            "year": fm.get("year"),
            "url": f"/papers/{slug}/",
            "wash": fm.get("wash") or "--wash-slate",
            "tags": tags,
            "text": text,
        })

    if not papers:
        sys.stderr.write("no papers parsed; aborting\n")
        return 1

    # --- Build concept vocabulary ---------------------------------------------
    # Start from curated names (preserve their casing); add tag canon names.
    concept_meta = {}  # name -> { wash, blurb, curated, papers: set[id] }
    for name, info in curated.items():
        concept_meta[name] = {
            "wash": info["wash"],
            "blurb": info["blurb"],
            "curated": True,
            "papers": set(info["papers"]),
        }
    for p in papers:
        for t in p["tags"]:
            if t not in concept_meta:
                concept_meta[t] = {
                    "wash": stable_wash(t),
                    "blurb": "",
                    "curated": False,
                    "papers": set(),
                }
            concept_meta[t]["papers"].add(p["id"])

    # --- Explicit paper -> concept edges from tags ----------------------------
    edges = []  # each: { source, target, weight, kind, source_kind }
    edge_keys = set()

    def add_edge(src, tgt, weight, kind):
        key = (src, tgt, kind)
        if key in edge_keys:
            return
        edge_keys.add(key)
        edges.append({"source": src, "target": tgt, "weight": round(weight, 4), "kind": kind})

    paper_id_set = {p["id"] for p in papers}
    name_to_paper = {p["id"]: p for p in papers}

    for p in papers:
        for t in p["tags"]:
            add_edge(p["id"], t, 1.0, "explicit")

    # --- Curated concepts.yml papers list also adds explicit edges ------------
    for cname, meta in concept_meta.items():
        if not meta["curated"]:
            continue
        for pid in list(meta["papers"]):
            if pid in paper_id_set:
                add_edge(pid, cname, 1.0, "explicit")
            else:
                # Curated points to a paper id that doesn't exist as a paper file.
                # Remove the orphan so weights stay correct.
                meta["papers"].discard(pid)

    # Re-derive concept->paper set from edges so curated set merges with tag-derived.
    concept_papers = {name: set() for name in concept_meta}
    for e in edges:
        # source is paper id, target is concept name (for explicit edges).
        if e["kind"] == "explicit":
            concept_papers[e["target"]].add(e["source"])

    # --- Mined paper -> concept edges via TF-IDF ------------------------------
    K_PER_PAPER = 3
    MIN_TFIDF = 0.06
    concept_names = list(concept_meta.keys())
    if HAVE_SKLEARN and concept_names:
        # Build a vocab where each concept maps to a fixed token (lower-snake).
        vocab_map = {}
        tokenized_corpus = []
        for cname in concept_names:
            key = re.sub(r"[^a-z0-9]+", "_", cname.lower()).strip("_")
            if key:
                vocab_map[cname] = key
        # Replace concept phrase occurrences in paper text with their tokens
        # (case-insensitive) so multi-word phrases survive the vectorizer.
        sorted_concepts = sorted(vocab_map.keys(), key=len, reverse=True)
        token_to_concept = {tok: name for name, tok in vocab_map.items()}
        docs = []
        for p in papers:
            doc = p["text"]
            doc_lower = doc.lower()
            for cname in sorted_concepts:
                tok = vocab_map[cname]
                pattern = re.compile(r"\b" + re.escape(cname.lower()) + r"\b", re.IGNORECASE)
                doc = pattern.sub(" " + tok + " ", doc)
                _ = doc_lower  # not used directly; kept for clarity
            docs.append(doc)
        vectorizer = TfidfVectorizer(
            vocabulary=sorted(token_to_concept.keys()),
            lowercase=True,
            token_pattern=r"(?u)\b\w+\b",
        )
        try:
            tfidf = vectorizer.fit_transform(docs)
            feature_names = vectorizer.get_feature_names_out()
            for i, p in enumerate(papers):
                row = tfidf[i].toarray().ravel()
                if row.max() == 0:
                    continue
                # Top-K concepts not already explicitly linked.
                explicit_targets = {t for t in p["tags"]}
                # Also exclude any curated link already in place.
                explicit_targets |= {e["target"] for e in edges
                                      if e["kind"] == "explicit" and e["source"] == p["id"]}
                scored = []
                for idx, score in enumerate(row):
                    if score < MIN_TFIDF:
                        continue
                    cname = token_to_concept.get(feature_names[idx])
                    if not cname or cname in explicit_targets:
                        continue
                    scored.append((cname, float(score)))
                scored.sort(key=lambda x: x[1], reverse=True)
                for cname, score in scored[:K_PER_PAPER]:
                    add_edge(p["id"], cname, 0.6, "mined")
                    concept_papers.setdefault(cname, set()).add(p["id"])
        except ValueError:
            # Empty vocab; skip.
            pass
    else:
        # Stdlib fallback: simple case-insensitive substring presence.
        for p in papers:
            explicit_targets = {t for t in p["tags"]}
            doc_lower = p["text"].lower()
            hits = []
            for cname in concept_names:
                if cname in explicit_targets:
                    continue
                if re.search(r"\b" + re.escape(cname.lower()) + r"\b", doc_lower):
                    hits.append(cname)
            for cname in hits[:K_PER_PAPER]:
                add_edge(p["id"], cname, 0.6, "mined")
                concept_papers.setdefault(cname, set()).add(p["id"])

    # --- Concept-concept cooccurrence edges (Jaccard) -------------------------
    MIN_JACCARD = 0.15
    MIN_SHARED = 2
    cnames = sorted(concept_papers.keys())
    for i in range(len(cnames)):
        a = cnames[i]
        pa = concept_papers[a]
        if not pa:
            continue
        for j in range(i + 1, len(cnames)):
            b = cnames[j]
            pb = concept_papers[b]
            if not pb:
                continue
            inter = pa & pb
            if len(inter) < MIN_SHARED:
                continue
            union = pa | pb
            if not union:
                continue
            jac = len(inter) / len(union)
            if jac < MIN_JACCARD:
                continue
            add_edge(a, b, round(jac, 4), "cooccur")

    # --- Final concept weight (post-mining) -----------------------------------
    for name in concept_meta:
        concept_meta[name]["papers"] = concept_papers.get(name, set())

    # --- Drop orphan concepts (no edges at all) -------------------------------
    used_names = set()
    for e in edges:
        if e["kind"] == "explicit" or e["kind"] == "mined":
            used_names.add(e["target"])
            # source is a paper id, not a concept
        elif e["kind"] == "cooccur":
            used_names.add(e["source"])
            used_names.add(e["target"])
    concept_meta = {n: m for n, m in concept_meta.items() if n in used_names}

    # --- Assemble node list ----------------------------------------------------
    nodes = []
    for p in sorted(papers, key=lambda x: x["id"]):
        nodes.append({
            "id": p["id"],
            "kind": "paper",
            "title": p["title"],
            "year": p["year"],
            "url": p["url"],
            "wash": p["wash"],
            "tags": p["tags"],
        })
    for name in sorted(concept_meta.keys(), key=str.lower):
        meta = concept_meta[name]
        nodes.append({
            "id": name,
            "kind": "concept",
            "name": name,
            "wash": meta["wash"],
            "blurb": meta["blurb"],
            "curated": meta["curated"],
            "weight": len(meta["papers"]),
        })

    # Sort edges deterministically.
    edges.sort(key=lambda e: (e["kind"], e["source"], e["target"]))

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "meta": {
            "paper_count": len(papers),
            "concept_count": len(concept_meta),
            "edge_count": len(edges),
            "tfidf": HAVE_SKLEARN,
        },
        "nodes": nodes,
        "links": edges,
    }
    OUTPUT_FILE.write_text(json.dumps(payload, indent=2, sort_keys=False, ensure_ascii=False) + "\n",
                           encoding="utf-8")
    sys.stdout.write(
        f"wrote {OUTPUT_FILE.relative_to(REPO_ROOT)}: "
        f"{len(papers)} papers, {len(concept_meta)} concepts, {len(edges)} edges "
        f"({'TF-IDF' if HAVE_SKLEARN else 'substring'} mode)\n"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
