// Central types for Big-O live in src/types/bigo.ts
import type { Metric, Notation } from "../types/bigo";
import { toSeconds } from "./format";

// Estimate how many operations an algorithm performs for a given Big-O class.
// Note: For O(log n), we derive from n directly (not the input array contents).
export function computeOps(notation: Notation, n: number) {
	if (notation === "O(1)") return 1;
	if (notation === "O(log n)")
		return Math.ceil(Math.log2(Math.max(1, Math.floor(n)) + 1));
	if (notation === "O(n)") return Math.max(0, n);
	if (notation === "O(n log n)")
		return Math.max(0, n) * Math.max(1, Math.ceil(Math.log2(Math.max(1, n))));
	const nn = Math.max(0, n);
	return nn * nn; // O(n^2)
}

export function computeTotalSeconds(
	ops: number,
	perOp: number,
	perOpUnit: "ns" | "us" | "ms" | "s"
) {
	return toSeconds(perOp, perOpUnit) * ops;
}

// Estimate extra (auxiliary) space used by the algorithm.
// We count only additional memory the algorithm allocates while running, not the input itself.
export function computeTotalBytes(
	metric: Metric,
	notation: Notation,
	n: number,
	bytesPerItem: number
) {
	if (metric === "time") return 0; // space is irrelevant when showing time
	if (notation === "O(1)") return bytesPerItem; // constant-sized scratch space
	if (notation === "O(log n)") return bytesPerItem; // iterative binary search uses constant aux space
	if (notation === "O(n)" || notation === "O(n log n)")
		return Math.max(0, n) * bytesPerItem; // e.g., filter/merge buffers
	return Math.max(0, n) * Math.max(0, n) * bytesPerItem; // O(n^2)
}

// Human-friendly alias names (thin wrappers)
export const estimateOperations = computeOps;
export const estimateSecondsFromOps = computeTotalSeconds;
export const estimateBytes = computeTotalBytes;
