# CLAUDE.md — Project Specification for neurovium.github.io

## Overview

This is a personal academic website for **Nima Dehghani**, a neuroscience researcher at MIT leading the N3HUB research group (NeuroPhysics, NeuroComputation, NeuroDynamics). The site is hosted on GitHub Pages at `neurovium.github.io`.

The site serves two purposes:
1. A professional academic presence (bio, publications, talks)
2. A code companion for published papers — each paper gets a dedicated page with repo links, meant to be cited in "Code Availability" sections of publications

## Technology

- **Jekyll** with GitHub Pages (GitHub builds automatically on push)
- No custom plugins (GitHub Pages only supports a limited set)
- All interactivity (tag filtering, animations) via vanilla JS
- Google Fonts for typography
- No build tools, no npm, no bundlers — keep it simple

## Design Direction

### Aesthetic
Dark, modern, research-lab feel — like a curated exhibition of scientific work. Editorial and gallery-like, not a generic academic CV page. Think: the aesthetic intersection of a physics observatory control room and a high-end design portfolio.

### Design Inspiration
- **davidckrakauer.com** — Large image-heavy cards as the primary UI element, editorial grid layout, clean category separation (Papers, Essays, AV Media). The way each item is a visual card with a large image — this is the feel we want.
- **akandykeller.github.io** — Persistent sidebar navigation, per-publication detail pages with abstract + links + related work. The individual paper pages are the model for ours.
- Both sites feel curated and intentional, not auto-generated.

### Color Palette
Use CSS custom properties throughout. The palette:
- `--bg-primary`: near-black with slight warm undertone, e.g. `#0b0b0f`
- `--bg-secondary`: slightly lighter dark, e.g. `#12121a`
- `--bg-card`: dark with subtle transparency, e.g. `rgba(20, 20, 30, 0.7)`
- `--accent`: a muted amber/gold, e.g. `#c9a84c` — used for links, hover glows, tag pills, highlights
- `--accent-dim`: dimmed version for borders, e.g. `rgba(201, 168, 76, 0.2)`
- `--text-primary`: off-white, e.g. `#e8e6e1`
- `--text-secondary`: muted, e.g. `#8a8a95`
- `--text-dim`: very muted for meta info, e.g. `#5a5a65`
- `--border`: subtle, e.g. `rgba(255, 255, 255, 0.06)`

If amber doesn't feel right during implementation, teal (`#4a9e8e`) is an alternative accent. But try amber first — it gives a warm, scientific-instrument feel against the dark background.

### Typography
Choose distinctive fonts — avoid Inter, Roboto, Arial, system fonts, Space Grotesk. These are overused.

Suggested pairing (import from Google Fonts):
- **Headings/Display**: "Syne" (geometric, modern, scientific character) or "Instrument Serif" (elegant, editorial)
- **Body**: "DM Sans" (clean, modern, slightly rounded) or "Source Sans 3"
- **Monospace** (for code snippets): "JetBrains Mono" or "Fira Code"

Pick one heading + one body font and commit. The heading font should feel distinctive and scientific.

### Cards
Cards are the primary UI element (Krakauer-style):
- Large image that IS the card (image fills the card, title overlaid at bottom with dark gradient)
- Subtle glass-morphism border: `border: 1px solid var(--border)`
- On hover: subtle amber glow (`box-shadow` with accent color), slight scale transform (1.02), image slight zoom
- Tags shown as small pills on the card
- Smooth transitions on all interactive states

### Layout
- **Desktop**: Persistent left sidebar (like Keller's) with name, one-line affiliation, navigation links, and social icons. Main content area to the right.
- **Tablet**: Sidebar collapses to a top bar with hamburger menu
- **Mobile**: Full top bar, hamburger menu, single-column card layout

### Animations & Motion
- Subtle, not flashy. This is science, not a startup landing page.
- Cards: fade-in with slight upward translate on scroll (use IntersectionObserver)
- Tag filter: smooth opacity transition when filtering cards
- Page transitions: none needed (standard navigation is fine)
- Hover states: smooth transitions (0.3s ease)
- A subtle ambient element on the home hero would be nice — perhaps a very faint animated grid or particle field in the background, but keep it extremely subtle. If it distracts from content, remove it.

## Site Structure

```
neurovium.github.io/
├── _config.yml
├── _layouts/
│   ├── default.html          # Base layout with sidebar + header
│   ├── page.html             # Generic page (about, presentations)
│   ├── paper.html            # Per-paper detail page
│   ├── post.html             # Blog post
│   └── papers-index.html     # Papers grid with tag filtering
├── _includes/
│   ├── head.html             # <head> with fonts, meta, CSS
│   ├── sidebar.html          # Persistent sidebar (desktop) / top nav (mobile)
│   ├── social-icons.html     # Social icon links (reused in sidebar + home hero)
│   ├── paper-card.html       # Single paper card component
│   └── footer.html           # Footer
├── _papers/                  # Collection: one .md file per paper
│   └── depth-coarse-graining.md
├── _posts/                   # Blog posts (standard Jekyll)
├── assets/
│   ├── css/
│   │   └── style.css         # All styles in one file
│   ├── js/
│   │   └── main.js           # Tag filtering, animations, mobile menu
│   └── img/
│       ├── profile/          # Profile photo(s)
│       └── papers/           # Teaser images for papers
├── index.html                # Home page
├── about.md                  # About page
├── papers.html               # Papers grid page (uses papers-index layout)
├── presentations.md          # Talks & posters list
├── blog.html                 # Blog index
└── CLAUDE.md                 # This file
```

## Page Specifications

### Home (`index.html`)

**Hero section:**
- Large name: "Nima Dehghani"
- Tagline: "NeuroPhysics · NeuroComputation · NeuroDynamics"
- One-line affiliation: "MIT · N3HUB Research Group"
- Row of social icons: GitHub, Google Scholar, LinkedIn, Twitter/X, Bluesky, Email
- Optional: very subtle animated background element (grid, particles, or similar)
- Link to N3HUB: https://sites.mit.edu/n3hub/
- Link to compneuro: https://compneuro.mit.edu/

**Below hero:**
- "Latest" section: chronological stream of the most recent cards (papers, blog posts — mixed). Krakauer-style large image cards. Show 6-9 items.

### About (`about.md`)

- Profile photo (placeholder for now, use a gray square with initials)
- Bio paragraphs (placeholder text referencing the N3HUB research themes: NeuroPhysics, NeuroComputation, NeuroDynamics)
- Affiliations with links
- Contact info
- CV download link (placeholder)

### Papers (`papers.html`)

This is a KEY page — the filterable publication gallery.

**Tag filter bar:**
- Row of clickable tag pills at the top
- Tags are auto-generated from all papers in the `_papers` collection
- "All" pill is selected by default
- Clicking a tag filters the grid to show only matching papers (with smooth animation)
- Multiple tags can be active (intersection: show papers matching ALL selected tags)
- Active tags get accent color fill; inactive tags are outlined/dim

**Card grid:**
- 2-3 columns on desktop, 1-2 on tablet, 1 on mobile
- Each card shows: teaser image (large), title overlaid, venue + year, tag pills
- Cards link to the per-paper detail page

**Implementation notes:**
- Since GitHub Pages doesn't allow custom plugins, tag filtering must be done in JS
- Each paper card should have `data-tags="tag1,tag2,tag3"` attributes
- JS reads the tags, builds the filter bar dynamically, and toggles card visibility

### Per-Paper Page (`_papers/*.md` using `paper.html` layout)

This is the page linked from "Code Availability" in publications.

**Layout (top to bottom):**

1. **Header**: Paper title (large), authors, venue + year
2. **Teaser figure**: Full-width image
3. **Abstract / Summary**: 2-3 paragraphs, plain language encouraged
4. **Links bar**: Horizontal row of pill-style links:
   - arXiv (with icon)
   - DOI / Published version
   - PDF
   - Blog post (if any)
   - Slides (if any)
   - BibTeX (expandable/copyable)
5. **Code & Data section**:
   - GitHub repo link with badge/icon
   - Quick-start: short code block showing how to clone + install + run
   - Repo structure overview (optional)
   - Links to mirror repos, student forks, or related repos
6. **Key figures** (optional): 2-3 figures from the paper with captions
7. **Tags**: clickable, link back to papers page pre-filtered
8. **Related publications**: 2-3 cards at the bottom

**Front matter for a paper** (example):
```yaml
---
layout: paper
title: "Depth as Successive Coarse-Graining in Plain MLPs"
subtitle: "An Information-Theoretic Treatment"
authors: "Nima Dehghani"
date: 2025-06-01
venue: "Preprint"
year: 2025
image: /assets/img/papers/depth-cg-teaser.png
tags: [renormalization-group, deep-learning, information-theory, coarse-graining]
arxiv: "https://arxiv.org/abs/XXXX.XXXXX"
doi: ""
pdf: ""
repo: "https://github.com/neurovium/depth-coarse-graining"
mirrors:
  - name: "Student fork (extended experiments)"
    url: "https://github.com/example/fork"
bibtex: |
  @article{dehghani2025depth,
    title={Depth as Successive Coarse-Graining in Plain MLPs},
    author={Dehghani, Nima},
    year={2025}
  }
description: "A mathematical framework showing that deep neural networks implement successive coarse-graining, where each layer preserves task-relevant information while discarding irrelevant nuisance information — analogous to renormalization group flow in physics."
---

Full markdown content of the paper page goes here.
You can use images, math (MathJax), code blocks, etc.
```

### Presentations (`presentations.md`)

Simple, no sub-pages. A clean table or styled list:
- Year | Title | Venue | Type (Talk/Poster) | [Slides link if available]
- Sorted reverse chronologically
- Can be grouped by year with subtle dividers

### Blog (`blog.html`)

- Standard Jekyll blog using `_posts/`
- Index page shows cards (smaller than papers — maybe text-focused cards with date and title, no large image needed)
- Each post gets its own page using `post.html` layout
- Can be empty for now with a "Coming soon" message

## Sidebar (`_includes/sidebar.html`)

Persistent left sidebar on desktop:
- Your name (links to home)
- One-line: "Neuroscience Researcher @ MIT"
- Navigation links:
  - Home
  - About
  - Papers
  - Presentations
  - Blog
- Social icons row (small): GitHub, Scholar, LinkedIn, Twitter, Bluesky, Email
- Small N3HUB logo/link at bottom

On mobile: collapses to a top bar with hamburger icon that opens a slide-out or dropdown menu.

## Social Links

Use these placeholders (Nima should fill in real URLs):
- GitHub: https://github.com/neurovium
- Google Scholar: https://scholar.google.com/citations?user=XXXXXX
- LinkedIn: https://linkedin.com/in/XXXXXX
- Twitter/X: https://twitter.com/XXXXXX
- Bluesky: https://bsky.app/profile/XXXXXX
- Email: nima_d@mit.edu

## Icons

Use inline SVGs for social icons (not Font Awesome — too heavy). Simple, clean line icons. Can use Lucide icons or simple custom SVGs.

## MathJax

Include MathJax v3 for rendering LaTeX in paper pages and blog posts. Load it conditionally (only on pages that need it, via a `math: true` front matter flag).

```html
{% if page.math %}
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
{% endif %}
```

## Example Paper Content

For the example paper page (`_papers/depth-coarse-graining.md`), use this content as the basis:

**Title**: "Depth as Successive Coarse-Graining in Plain MLPs: An Information-Theoretic Treatment"

**Summary**: This work provides a mathematical framework for understanding deep neural networks through the lens of renormalization group (RG) theory from physics. The central insight is that depth in neural networks implements successive coarse-graining: each layer preserves task-relevant information while systematically discarding irrelevant "nuisance" information. This is formally analogous to RG flow in statistical physics, where successive transformations integrate out short-distance degrees of freedom.

The theory establishes that depth provides a qualitatively different computational strategy — not just additional parameters, but a structured information-processing pipeline that naturally separates signal from noise across scales.

**Tags**: renormalization-group, deep-learning, information-theory, coarse-graining, neural-networks, statistical-physics

**Quick-start code block**:
```bash
git clone https://github.com/neurovium/depth-coarse-graining.git
cd depth-coarse-graining
pip install -r requirements.txt
python run_experiments.py --config configs/default.yaml
```

## How to Add a New Paper

1. Create a new file in `_papers/`, e.g. `_papers/my-new-paper.md`
2. Copy the front matter template from the example paper above
3. Fill in title, authors, venue, tags, links
4. Add a teaser image to `assets/img/papers/`
5. Write the page content in markdown below the front matter
6. Commit and push — GitHub Pages rebuilds automatically
7. The paper automatically appears on the Papers page and Home feed

## How to Add a Blog Post

1. Create a file in `_posts/` with the naming convention `YYYY-MM-DD-slug.md`
2. Add front matter: `layout: post`, `title`, `date`, `tags`
3. Write content in markdown
4. Commit and push

## Important Implementation Notes

- **No custom Jekyll plugins**: GitHub Pages only supports a limited set. Tag filtering must be client-side JS, not plugin-based.
- **Collections**: `_papers` is a Jekyll collection (configured in `_config.yml`). Papers are NOT posts — they live in their own collection with their own layout.
- **Image placeholders**: Use colored placeholder divs (dark with subtle pattern) for paper teaser images until real images are added. Don't leave broken image tags.
- **Responsive**: Everything must work on mobile. The sidebar is the trickiest part — it must collapse cleanly.
- **Performance**: Keep it lean. One CSS file, one JS file, Google Fonts, MathJax (conditional). No jQuery, no Bootstrap, no framework bloat.
- **Accessibility**: Proper heading hierarchy, alt text on images, keyboard-navigable tag filters, sufficient color contrast (check accent on dark bg).
