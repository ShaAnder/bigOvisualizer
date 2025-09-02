// TabPanel renders the detailed content for a given Big-O tab.
import { useMemo, useState } from 'react';
import type { TabSpec } from '../types/bigo';
import { Controls } from './Controls';
import type { ControlsState } from '../types/controls';
import { defaultControls } from '../state/defaults';
import { SingleBarChart } from './SingleBarChart';
import { BinarySearchSteps } from './BinarySearchSteps';

export function TabPanel({ spec }: { spec: TabSpec }) {
  const [state, setState] = useState<ControlsState>(defaultControls);
  const code = useMemo(() => spec.example[state.metric], [spec, state.metric]);

  // Example-driven overrides per example.md
  const overrides = useMemo(() => {
    const n = Math.max(0, Math.floor(state.n));
    const bytesPerItem = Math.max(0, state.bytesPerItem);
    if (state.metric === 'time') {
      switch (spec.id) {
        case 'O(1)': {
          // logAtMost10: up to 10 ops regardless of n
          const ops = Math.min(n, 10);
          const perOpNs = 100; // 100 ns/op baseline
          return { seconds: (ops * perOpNs) / 1e9, bytes: undefined };
        }
        case 'O(log n)': {
          // binary search: ~ceil(log2(n+1)) comparisons
          const ops = Math.max(1, Math.ceil(Math.log2(Math.max(1, n) + 1)));
          const perOpNs = 100;
          return { seconds: (ops * perOpNs) / 1e9, bytes: undefined };
        }
        case 'O(n)': {
          // onlyElementsAtEvenIndex: scans n, writes ~n/2
          const ops = n; // dominant loop over n
          const perOpNs = 100;
          return { seconds: (ops * perOpNs) / 1e9, bytes: undefined };
        }
        case 'O(n log n)': {
          // Linearithmic baseline (e.g., mergesort comparisons)
          const ops = n * Math.max(1, Math.ceil(Math.log2(Math.max(1, n))));
          const perOpNs = 100;
          return { seconds: (ops * perOpNs) / 1e9, bytes: undefined };
        }
        case 'O(n^2)': {
          // subtotals: ~n(n+1)/2 additions
          const ops = (n * (n + 1)) / 2;
          const perOpNs = 100;
          return { seconds: (ops * perOpNs) / 1e9, bytes: undefined };
        }
      }
    } else {
      // space
      switch (spec.id) {
        case 'O(1)': {
          // logUpTo: constant extra space
          const bytes = 1 * bytesPerItem; // simple constant bucket
          return { seconds: undefined, bytes };
        }
        case 'O(log n)': {
          // iterative binary search: constant extra
          const bytes = 1 * bytesPerItem;
          return { seconds: undefined, bytes };
        }
        case 'O(n)': {
          // onlyElementsAtEvenIndex: ceil(n/2) items allocated
          const items = Math.ceil(n / 2);
          const bytes = items * bytesPerItem;
          return { seconds: undefined, bytes };
        }
        case 'O(n log n)': {
          // mergesort space ~ n items
          const bytes = n * bytesPerItem;
          return { seconds: undefined, bytes };
        }
        case 'O(n^2)': {
          // matrix n x n
          const bytes = n * n * bytesPerItem;
          return { seconds: undefined, bytes };
        }
      }
    }
    return { seconds: undefined, bytes: undefined };
  }, [spec.id, state.metric, state.n, state.bytesPerItem]);
  return (
    <div className="grid">
      <div className="section">
        <h3>{spec.title}</h3>
        <div className="subtle">{spec.detail}</div>
  <div className="code"><pre><code>{code}</code></pre></div>
  <div className="hint">Space means the extra memory the algorithm needs while it runs. We do not count the input you give it. Think of each number as taking the same amount of room (for example, about 8 bytes), no matter how many digits it has.</div>
  <div className="hint info">
    <span className="tooltip">
      <button type="button" className="icon" aria-label="What is a byte?">i</button>
      <span className="tooltip-content">A byte is a small unit of memory. On many systems, a typical number uses about 8 bytes.</span>
    </span>
    <span>What is a byte?</span>
  </div>
        <Controls
          notation={spec.id}
          state={state}
          onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
        />
        <SingleBarChart
          notation={spec.id}
          metric={state.metric}
          n={state.n}
          bytesPerItem={state.bytesPerItem}
          overrideSeconds={overrides.seconds}
          overrideBytes={overrides.bytes}
        />
  <div className="subtle"><strong>Expected resource drain:</strong> {spec.expected}</div>
  <div className="subtle"><strong>How it works:</strong> {spec.how}</div>
  <div className="hint">Time here is an estimate to help compare growth. We turn the number of steps into seconds on a simple scale (from about 1 microsecond up to about 20 seconds). Only the O(log n) tab shows each decision step; the others show totals so you can see the trend.</div>
        {spec.id === 'O(log n)' ? (
          <BinarySearchSteps arrayCSV={state.arrayCSV} target={state.target} />
        ) : null}
        <div className="subtle"><strong>Real-world:</strong> {spec.realWorld}</div>
        <div className="code"><pre><code>{spec.realWorldCode}</code></pre></div>
      </div>
    </div>
  );
}
