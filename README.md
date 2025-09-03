## Big O Notation Visualizer (React + TypeScript)

[Live Link](https://shaander.github.io/bigOvisualizer)

A simple, beginner‑friendly visualizer for time and space complexity. Switch
between Big‑O classes (O(1), O(log n), O(n), O(n log n), O(n^2), …), adjust
inputs, and see a single bar summarize estimated operations, total time
(clamped), and extra space.

Highlights

- Clear, plain‑English explanations per tab
- O(log n) uses an iterative binary search with step‑by‑step trace on a
  deterministic array 1..n
- Static bar (no glitchy animation) with clamped time: 1 us to 20 s, and space
  scaled up to ~1 GB for display
- Space = auxiliary memory only (excluding input)

Run locally

- Install: npm install
- Dev server: npm run dev
- Lint: npm run lint
- Build: npm run build
- Preview build: npm run preview

Deploy (optional, GitHub Pages)

1. Build: npm run build
2. Serve the dist/ folder on any static host, or push it to a gh-pages branch.
   If your repo uses GitHub Pages from the gh-pages branch, you can publish the
   contents of dist/ there.

Notes

- Units are ASCII‑only: microseconds shown as "us"
- Binary search extra space is O(1)
- Examples in `src/data/bigO.ts` map to the visualized ops/time/space numbers
