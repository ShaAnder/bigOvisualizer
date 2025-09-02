import { MAX_ITEMS } from "../config/constants";

// Build a sorted array of random numbers (teaching aid only)
export function makeRandomArray(n: number, maxValue = 100000): number[] {
	const size = Math.max(0, Math.min(MAX_ITEMS, Math.floor(n)));
	const arr = Array.from({ length: size }, () =>
		Math.floor(Math.random() * (maxValue + 1))
	);
	return arr.sort((a, b) => a - b);
}

export function makeRandomArrayRaw(n: number, maxValue = 100000): number[] {
	const size = Math.max(0, Math.min(MAX_ITEMS, Math.floor(n)));
	return Array.from({ length: size }, () =>
		Math.floor(Math.random() * (maxValue + 1))
	);
}

// Deterministic sequential array from 1..n (sorted ascending)
export function makeSequentialArray(n: number): number[] {
	const size = Math.max(0, Math.min(MAX_ITEMS, Math.floor(n)));
	// Use 1..size to avoid zeros for clarity in examples
	return Array.from({ length: size }, (_v, i) => i + 1);
}

// Human-friendly aliases (thin wrappers) used in UI copy or future imports
export const makeNumbersFromOneToN = makeSequentialArray; // clearer for learners
export const makeSortedRandomNumbers = makeRandomArray; // says what it is
