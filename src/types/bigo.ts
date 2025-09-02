// Central Big-O related types used across the app

export type Notation = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n^2)';
export type Metric = 'time' | 'space';

// Tab specification that powers the UI content and examples
export interface TabSpec {
  id: Notation;
  title: string;
  description: string; // short label under tabs
  detail: string;      // long description inside tab panel
  expected: string;    // what to expect as n grows
  how: string;         // friendly walkthrough of the idea
  realWorld: string;   // short real-world mapping
  realWorldCode: string; // code sample for the real-world mapping
  example: { time: string; space: string }; // code examples per metric
}
