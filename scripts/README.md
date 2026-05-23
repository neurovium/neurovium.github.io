# scripts

Local-only tooling. Nothing here runs on GitHub Pages.

## `build_garden_graph.py`

Generates `assets/data/garden-graph.json`, the knowledge graph powering the
interactive Idea Garden at `/garden/`.

### When to run

Re-run whenever any of the following change:

- a paper in `_papers/` (added, deleted, or its `title`, `tags`,
  `description`, or abstract body edited)
- `_data/concepts.yml`

The output JSON is checked in. Forgetting to re-run is harmless — the Garden
will simply not reflect the new paper until the JSON is regenerated and
committed.

### How to run

From the repository root:

```bash
python scripts/build_garden_graph.py
```

Output, on success:

```
wrote assets/data/garden-graph.json: 24 papers, 71 concepts, 312 edges (TF-IDF mode)
```

The script is deterministic — running it twice with no source changes
produces a byte-identical JSON.

### Dependencies

- Python 3.9+
- `pyyaml` (required)
- `scikit-learn` (optional; enables TF-IDF mining of paper abstracts).
  Without it, the script falls back to plain substring matching, which still
  works but produces fewer mined edges.

```bash
pip install pyyaml scikit-learn
```

### What it does

1. Parses every `_papers/*.md` front matter and body. Files with malformed
   YAML are skipped with a warning, not a hard fail.
2. Reads `_data/concepts.yml` (the curated layer).
3. Builds a bipartite graph:
   - **paper nodes** (one per paper) and **concept nodes** (curated concepts
     + every distinct `tags:` value, canonicalized via a small alias map).
   - **edges**: explicit paper↔concept from `tags:` and curated `papers:`
     lists (weight 1.0); mined paper↔concept from TF-IDF over title +
     description + abstract (weight 0.6); concept↔concept Jaccard
     cooccurrence when two concepts share ≥ 2 papers (weight = Jaccard).
4. Writes `assets/data/garden-graph.json` with sorted, stable output.
