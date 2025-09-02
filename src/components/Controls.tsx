// Controls: user inputs for each tab. Only O(log n) shows array/target fields.
import type { Notation } from "../types/bigo";
import type { ControlsState } from "../types/controls";
import { makeSequentialArray } from "../utils/arrays";
import { useEffect } from "react";

export function Controls({
	notation,
	state,
	onChange,
}: {
	notation: Notation; // which tab is active
	state: ControlsState; // current input values
	onChange: (patch: Partial<ControlsState>) => void; // setter for parent state
}) {
	const isLog = notation === "O(log n)";
	// Keep the CSV in sync with 1..n for the O(log n) tab.
	useEffect(() => {
		if (!isLog) return;
		const desired = makeSequentialArray(state.n).join(",");
		if (state.arrayCSV !== desired) onChange({ arrayCSV: desired });
	}, [isLog, state.n, state.arrayCSV, onChange]);
	return (
		<div className="controls">
			<div className="row">
				<label>Metric</label>
				<label className="radio-group">
					<input
						type="radio"
						name={`metric-${notation}`}
						checked={state.metric === "time"}
						onChange={() => onChange({ metric: "time" })}
					/>
					Time
				</label>
				<label className="radio-group">
					<input
						type="radio"
						name={`metric-${notation}`}
						checked={state.metric === "space"}
						onChange={() => onChange({ metric: "space" })}
					/>
					Space
				</label>
			</div>

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
						/>
						<button
							className="tab"
							onClick={() => {
								const arr = makeSequentialArray(state.n);
								onChange({ arrayCSV: arr.join(",") });
							}}
						>
							Generate 1..n array
						</button>
						<span className="hint">Max 10,000 items</span>
					</div>
					<div className="row">
						<label>Target value</label>
						<input
							type="text"
							value={state.target}
							onChange={(e) => onChange({ target: e.target.value })}
						/>
					</div>
				</>
			) : null}

			{!isLog ? (
				<div className="row">
					<label>n (size)</label>
					<input
						type="number"
						min={0}
						step={1}
						value={state.n}
						onChange={(e) => onChange({ n: Number(e.target.value) || 0 })}
					/>
				</div>
			) : null}

			{state.metric === "time" || (isLog && state.metric === "space") ? null : (
				<div className="row">
					<label>Bytes per array item</label>
					<input
						type="number"
						min={0}
						step={1}
						value={state.bytesPerItem}
						onChange={(e) =>
							onChange({ bytesPerItem: Number(e.target.value) || 0 })
						}
					/>
				</div>
			)}
		</div>
	);
}
