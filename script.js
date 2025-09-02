// Big O Notation - quick, practical notes
//
// What it measures
// - Time complexity: how the number of steps grows as input size (n) grows.
// - Space complexity: how much extra memory an algorithm needs as n grows.
//
// Rules of thumb
// - Drop constants / lower-order terms (keep dominant term): O(2n + 100) → O(n).
// - Prefer worst-case unless stated otherwise.
// - Different inputs can be analyzed separately (e.g., O(n + m)).
//
// Common complexities (fast -> slow)
// O(1): constant
// O(log n): logarithmic (halve the work each step)
// O(n): linear
// O(n log n): “linearithmic”
// O(n^2): quadratic
// O(2^n), O(n!): exponential / factorial (explode quickly)

// ------------------------------------
// O(1) — constant time
// ------------------------------------
function getFirst(arr) {
	// Accessing by index doesn’t depend on array length
	return arr[0];
}

function logAtMost10(n) {
	// Caps at 10 iterations → constant
	for (var i = 1; i <= Math.min(n, 10); i++) {
		console.log(i);
	}
}

// ------------------------------------
// O(log n) — logarithmic time
// Halves the remaining work each step (typical in binary search / divide-and-conquer)
// ------------------------------------
function countHalves(n) {
	// How many times can we halve n until we reach 1?
	// Steps ≈ log2(n)
	let steps = 0;
	while (n > 1) {
		n = Math.floor(n / 2);
		steps++;
	}
	return steps; // O(log n)
}

function binarySearch(sortedArr, target) {
	// Returns index of target or -1 if not found
	let lo = 0;
	let hi = sortedArr.length - 1;
	while (lo <= hi) {
		const mid = Math.floor((lo + hi) / 2);
		const value = sortedArr[mid];
		if (value === target) return mid; // found
		if (value < target) lo = mid + 1; // search right half
		else hi = mid - 1; // search left half
	}
	return -1; // O(log n)
}

// ------------------------------------
// O(n) — linear time
// ------------------------------------
function logUpTo(n) {
	for (var i = 1; i <= n; i++) {
		console.log(i);
	}
}

function logAtLeast10(n) {
	// Starts constant up to 10, then grows with n → O(n)
	for (var i = 1; i <= Math.max(n, 10); i++) {
		console.log(i);
	}
}

function sumArray(arr) {
	let total = 0;
	for (const x of arr) total += x;
	return total; // O(n)
}

// ------------------------------------
// O(n log n) — linearithmic time
// ------------------------------------
function sortNumbers(arr) {
	// Most comparison sorts (like JS engines’ built-in sort) are O(n log n) average-case
	// Use a copy so we don’t mutate the input
	return arr.slice().sort((a, b) => a - b);
}

// ------------------------------------
// O(n^2) — quadratic time
// ------------------------------------
function subtotals(array) {
	var subtotalArray = Array(array.length);
	for (var i = 0; i < array.length; i++) {
		var subtotal = 0;
		for (var j = 0; j <= i; j++) {
			subtotal += array[j];
		}
		subtotalArray[i] = subtotal;
	}
	return subtotalArray; // O(n^2) due to the nested loop
}

function hasDuplicatePair(arr) {
	// Naive duplicate check: compare every pair
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[i] === arr[j]) return true;
		}
	}
	return false; // O(n^2)
}

// ------------------------------------
// Very slow growth classes (for completeness)
// ------------------------------------
function fibExponential(n) {
	// Naive recursion → O(2^n)
	if (n <= 1) return n;
	return fibExponential(n - 1) + fibExponential(n - 2);
}

// ------------------------------------
// Space complexity quick note
// ------------------------------------
function buildArray(n) {
	// Allocates an array of length n → O(n) space
	const out = [];
	for (let i = 0; i < n; i++) out.push(i);
	return out;
}

function addTwoNumbers(a, b) {
	// Uses a constant amount of extra memory → O(1) space
	return a + b;
}

// ------------------------------------
// Mini “cheat rules” to simplify Big O
// ------------------------------------
// - Drop constants: O(3n + 10) → O(n)
// - Drop lower-order terms: O(n^2 + n) → O(n^2)
// - Sequential steps add: O(a) then O(b) → O(a + b)
// - Nested steps multiply: loop in loop → O(a * b)

// (Demos removed by request; this file now only contains reference examples.)
