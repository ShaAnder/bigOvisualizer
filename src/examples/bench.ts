// Benchmark helpers for each Big-O notation. Returns measured seconds and estimated aux items.
export interface BenchResult {
  seconds: number;
  auxItems: number;
}

function now(): number {
  // Use global performance in browser; Date.now fallback
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

function measure(fn: () => void, minMs = 10, maxIters = 1_000): number {
  // Run once to estimate
  let t0 = now();
  fn();
  let t1 = now();
  const dur = Math.max(0, t1 - t0);
  if (dur >= minMs) return dur / 1000;
  const reps = Math.min(maxIters, Math.max(1, Math.ceil(minMs / Math.max(0.25, dur))));
  t0 = now();
  for (let i = 0; i < reps; i++) fn();
  t1 = now();
  return (t1 - t0) / 1000 / reps;
}

export function runO1(): BenchResult {
  const arr = [1, 2, 3, 4, 5];
  const seconds = measure(() => {
    // constant amount of work
    const x = arr[0] + arr[1];
    void x;
  });
  return { seconds, auxItems: 1 };
}

export function runOlogn(n: number): BenchResult {
  const size = Math.max(1, Math.floor(n));
  const arr = Array.from({ length: size }, (_v, i) => i + 1);
  const target = size + 1; // miss to force full search path
  const seconds = measure(() => {
    let l = 0, r = arr.length - 1;
    while (l <= r) {
      const m = (l + r) >> 1;
      const mv = arr[m];
      if (mv === target) break;
      if (mv < target) l = m + 1; else r = m - 1;
    }
  });
  return { seconds, auxItems: 1 };
}

export function runOn(n: number): BenchResult {
  const size = Math.max(0, Math.floor(n));
  const arr = Array.from({ length: size }, (_v, i) => i);
  const seconds = measure(() => {
    const out = new Array(Math.ceil(arr.length / 2));
    let w = 0;
    for (let i = 0; i < arr.length; i++) if ((i & 1) === 0) out[w++] = arr[i];
  });
  const auxItems = Math.ceil(size / 2);
  return { seconds, auxItems };
}

function merge(a: number[], b: number[]): number[] {
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}
function mergesort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  return merge(mergesort(arr.slice(0, mid)), mergesort(arr.slice(mid)));
}
export function runOnlogn(n: number): BenchResult {
  const size = Math.max(0, Math.floor(n));
  const arr = Array.from({ length: size }, (_v, i) => (size - i)); // worst-ish
  const seconds = measure(() => {
    void mergesort(arr);
  });
  const auxItems = size; // mergesort temp buffers ~ n
  return { seconds, auxItems };
}

export function runOn2(n: number): BenchResult {
  const size = Math.max(0, Math.floor(n));
  const arr = Array.from({ length: size }, (_v, i) => i);
  const seconds = measure(() => {
    const out = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      let subtotal = 0;
      for (let j = 0; j <= i; j++) subtotal += arr[j];
      out[i] = subtotal;
    }
  });
  const auxItems = size; // output array length n
  return { seconds, auxItems };
}

export function runBench(notation: string, n: number): BenchResult {
  switch (notation) {
    case "O(1)": return runO1();
    case "O(log n)": return runOlogn(n);
    case "O(n)": return runOn(n);
    case "O(n log n)": return runOnlogn(n);
    case "O(n^2)": return runOn2(n);
    default: return { seconds: 0, auxItems: 0 };
  }
}
