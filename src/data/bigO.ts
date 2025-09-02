// Central Big-O UI spec types are defined in src/types/bigo.ts
import type { TabSpec } from "../types/bigo";

// Tabs definition drives the content shown for each complexity class.
export const TABS: TabSpec[] = [
	{
		id: "O(1)",
		title: "O(1) - Constant",
		description: "A fixed number of steps no matter n.",
		detail:
			"Constant time means the number of steps does not change with n. A lookup by index or a hash map get are classic O(1) operations.",
		expected:
			"Time stays flat as n grows; extra space remains constant (input storage is not counted).",
		how: "The work does not grow with n. You do a fixed amount of work no matter how large the input is (like reading a single index in an array).",
		realWorld:
			"Accessing an array element by index or checking a Set for membership.",
		realWorldCode: `const third = arr[2];`,
		example: {
			time: `function logAtMost10(n) {
  for (var i = 1; i <= Math.min(n, 10); i++) { console.log(i); }
}`,
			space: `function logUpTo(n) {
  for (var i = 1; i <= n; i++) { console.log(i); }
}`,
		},
	},
	{
		id: "O(log n)",
		title: "O(log n) - Logarithmic",
		description:
			"Each step cuts the problem down (divide-and-conquer). Doubling n adds ~one step.",
		detail:
			"Logarithmic time arises when the input is halved (or reduced by a constant factor) repeatedly; doubling n adds ~one step.",
		expected:
			"Time grows slowly with n; space is often constant aside from the data.",
		how: "Look at the middle item. If it is too small, keep the right half; if it is too big, keep the left half. Repeat until you find the item or run out of items.",
		realWorld:
			"Binary searching a sorted phone book or looking up in a balanced BST.",
		realWorldCode: `const idx = binarySearch(phoneBook, 'Alice');`,
		example: {
			time: `// Iterative binary search over a sorted array
function binarySearch(arr, target) {
  let l=0, r=arr.length-1;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (arr[m] === target) return m;
    arr[m] < target ? (l = m + 1) : (r = m - 1);
  }
  return -1;
}`,
			space: `// Binary search uses constant extra memory
function binarySearch(arr, target) { /* O(1) extra space */ }`,
		},
	},
	{
		id: "O(n)",
		title: "O(n) - Linear",
		description: "Work scales in direct proportion to input size.",
		detail:
			"Linear time algorithms touch each item a constant number of times; work scales directly with n.",
		expected:
			"Time doubles as n doubles; space depends on what you store (often O(1) or O(n)).",
		how: "Visit each item once and do a small, fixed piece of work for each one (like adding them up or copying some of them).",
		realWorld: "Scanning a list for a value, streaming through a log file.",
		realWorldCode: `const found = list.includes(target);`,
		example: {
			time: `function onlyElementsAtEvenIndex(array) {
  var newArray = Array(Math.ceil(array.length / 2));
  for (var i = 0; i < array.length; i++) {
    if (i % 2 === 0) { newArray[i / 2] = array[i]; }
  }
  return newArray;
}`,
			space: `function onlyElementsAtEvenIndex(array) {
  var newArray = Array(Math.ceil(array.length / 2));
  for (var i = 0; i < array.length; i++) {
    if (i % 2 === 0) { newArray[i / 2] = array[i]; }
  }
  return newArray;
}`,
		},
	},
	{
		id: "O(n log n)",
		title: "O(n log n) - Linearithmic",
		description:
			"Do O(log n) work for each of the n items (e.g., balanced splits).",
		detail:
			"Divide-and-conquer that does near-linear work across log n levels of recursion; often seen in efficient sorts.",
		expected:
			"Time grows faster than linear but much slower than quadratic; space varies (e.g., mergesort uses O(n)).",
		how: "Split the input into halves, sort each half, and then merge them together. You do near-linear work across a small number of levels (about log n).",
		realWorld: "Efficient comparison sorts like mergesort and heapsort.",
		realWorldCode: `arr.sort((a,b)=>a-b);`,
		example: {
			time: `function merge(a, b) {
  var out = []; var i=0, j=0;
  while (i < a.length && j < b.length) { out.push(a[i] <= b[j] ? a[i++] : b[j++]); }
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}
function mergesort(arr) {
  if (arr.length < 2) return arr.slice();
  var mid = arr.length >> 1;
  return merge(mergesort(arr.slice(0, mid)), mergesort(arr.slice(mid)));
}`,
			space: `// Mergesort uses O(n) extra space for temporary arrays`,
		},
	},
	{
		id: "O(n^2)",
		title: "O(n^2) - Quadratic",
		description: "Nested loops over the same data multiply the work.",
		detail:
			"For each item, you loop over all items again, leading to n x n operations; avoid when n grows large.",
		expected:
			"Time grows quickly; space may be O(1) unless building n x n structures.",
		how: "Use one loop inside another over the same data (like comparing every pair). The number of operations grows as n times n.",
		realWorld: "Comparing every pair of items, naive substring search.",
		realWorldCode: `for (let i=0;i<n;i++){ for (let j=i+1;j<n;j++){ /* ... */ } }`,
		example: {
			time: `function subtotals(array) {
  var subtotalArray = Array(array.length);
  for (var i = 0; i < array.length; i++) {
    var subtotal = 0;
    for (var j = 0; j <= i; j++) { subtotal += array[j]; }
    subtotalArray[i] = subtotal;
  }
  return subtotalArray;
}`,
			space: `function makeMatrix(n) {
  return Array.from({length:n}, () => Array(n).fill(0));
}`,
		},
	},
];
