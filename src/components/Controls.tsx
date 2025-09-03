// Controls: user inputs for each tab. Only O(log n) shows array/target fields.
import type { Notation } from "../types/bigo";
import type { ControlsState } from "../types/controls";
// import { makeSequentialArray } from "../utils/arrays";
import { useEffect } from "react";

// Simple inputs per tab; O(log n) gets a helper to auto-fill a 1..n array.
export function Controls({
	notation,
	state,
	onChange,
	onCommit,
}: {
	notation: Notation; // which tab is active
	state: ControlsState; // current input values
	onChange: (patch: Partial<ControlsState>) => void; // setter for parent state
	onCommit?: () => void; // called when user commits (Enter)
}) {
	const isLog = notation === "O(log n)";
	// Keep the CSV in sync with 1..n for the O(log n) tab.
	useEffect(() => {
		if (!isLog) return;
		const size = Math.max(0, Math.floor(state.n));
		if (size === 0) {
			if (state.arrayCSV !== "" || state.target !== "")
				onChange({ arrayCSV: "", target: "" });
			return;
		}
		// Build 1..n without any artificial max cap for display purposes
		const arr = Array.from({ length: size }, (_v, i) => i + 1);
		const csv = arr.join(",");
		if (state.arrayCSV !== csv) {
			// Only pick a new random target when the array changes
			const randomTarget = String(arr[Math.floor(Math.random() * arr.length)]);
			onChange({ arrayCSV: csv, target: randomTarget });
		}
	}, [isLog, state.n, state.arrayCSV, state.target, onChange]);
	return (
		<div className="controls">
			{isLog ? (
				<>
					<div className="row">
						<label>Array length (n)</label>
						<input
							type="number"
							min={0}
							step={1}
							value={state.n}
							onChange={(e) => onChange({ n: Number(e.target.value) || 0 })}
							onKeyDown={(e) => {
								if (e.key === "Enter") onCommit?.();
							}}
						/>
						<button
							type="button"
							className="tab"
							onClick={() => {
								const size = Math.max(0, Math.floor(state.n));
								const arr = Array.from({ length: size }, (_v, i) => i + 1);
								const csv = arr.join(",");
								const randomTarget =
									size > 0
										? String(arr[Math.floor(Math.random() * arr.length)])
										: "";
								onChange({ arrayCSV: csv, target: randomTarget });
							}}
						>
							Generate 1..n array
						</button>
						<span className="hint">
							Array auto-fills 1..n and picks a random target
						</span>
					</div>
					{/* Target field removed: target is chosen automatically from the array */}
				</>
			) : (
				<div className="row">
					<label>n (size)</label>
					<input
						type="number"
						min={0}
						step={1}
						value={state.n}
						onChange={(e) => onChange({ n: Number(e.target.value) || 0 })}
						onKeyDown={(e) => {
							if (e.key === "Enter") onCommit?.();
						}}
					/>
				</div>
			)}
		</div>
	);
}
