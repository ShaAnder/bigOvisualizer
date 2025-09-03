// Types for the controls state and related units

export type PerOpUnit = "ns" | "us" | "ms" | "s";

export interface ControlsState {
	n: number; // problem size (or array length)
	bytesPerItem: number; // number of bytes per array item (space metric)
	arrayCSV: string; // CSV for the O(log n) tab
	target: string; // target value for O(log n)
}
