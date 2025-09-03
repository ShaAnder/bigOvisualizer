// TabPanel renders the detailed content for a given Big-O tab.
import { useMemo } from "react";
import type { Notation, TabSpec } from "../types/bigo";
import { Controls } from "./Controls";
import type { ControlsState } from "../types/controls";
import { BinarySearchSteps } from "./BinarySearchSteps";

// One tab’s content: quick intro, code snippet, inputs, and extra notes.
export function TabPanel({
	spec,
	onSample,
	state,
	onChange,
}: {
	spec: TabSpec;
	onSample?: (
		notation: Notation,
		n: number,
		seconds?: number,
		bytes?: number
	) => void;
	state: ControlsState;
	onChange: (patch: Partial<ControlsState>) => void;
}) {
	const code = useMemo(() => spec.example.time, [spec]);

	// Example-driven rough estimates for both metrics
	const overrides = useMemo(() => {
		const n = Math.max(0, Math.floor(state.n));
		const bytesPerItem = Math.max(0, state.bytesPerItem);
		if (n === 0) return { seconds: 0, bytes: 0 };
		// time (seconds) using a tiny per-op baseline
		let seconds = 0;
		switch (spec.id) {
			case "O(1)": {
				const ops = Math.min(n, 10);
				const perOpNs = 100;
				seconds = (ops * perOpNs) / 1e9;
				break;
			}
			case "O(log n)": {
				const ops = Math.max(1, Math.ceil(Math.log2(Math.max(1, n) + 1)));
				const perOpNs = 100;
				seconds = (ops * perOpNs) / 1e9;
				break;
			}
			case "O(n)": {
				const ops = n;
				const perOpNs = 100;
				seconds = (ops * perOpNs) / 1e9;
				break;
			}
			case "O(n log n)": {
				const ops = n * Math.max(1, Math.ceil(Math.log2(Math.max(1, n))));
				const perOpNs = 100;
				seconds = (ops * perOpNs) / 1e9;
				break;
			}
			case "O(n^2)": {
				const ops = (n * (n + 1)) / 2;
				const perOpNs = 100;
				seconds = (ops * perOpNs) / 1e9;
				break;
			}
		}
		// space (bytes) estimates
		let bytes = 0;
		switch (spec.id) {
			case "O(1)":
			case "O(log n)": {
				bytes = 1 * bytesPerItem;
				break;
			}
			case "O(n)": {
				bytes = Math.ceil(n / 2) * bytesPerItem;
				break;
			}
			case "O(n log n)": {
				bytes = n * bytesPerItem;
				break;
			}
			case "O(n^2)": {
				bytes = n * n * bytesPerItem;
				break;
			}
		}
		return { seconds, bytes };
	}, [spec.id, state.n, state.bytesPerItem]);

	// Only emit a new sample when user commits (Enter). No auto-emission on change.
	const commitSample = () => {
		const n = Math.max(0, Math.floor(state.n));
		onSample?.(spec.id, n, overrides.seconds ?? 0, overrides.bytes ?? 0);
	};
	return (
		<div className="grid">
			<div className="section">
				<h3>{spec.title}</h3>
				<div className="subtle">{spec.detail}</div>
				<div className="code">
					<pre>
						<code>{code}</code>
					</pre>
				</div>
				{/* Removed obsolete space explanation and tooltip (moved below space bar) */}
				<Controls
					notation={spec.id}
					state={state}
					onChange={onChange}
					onCommit={commitSample}
				/>
				<div className="subtle">
					<strong>Expected resource drain:</strong> {spec.expected}
				</div>
				<div className="subtle">
					<strong>How it works:</strong> {spec.how}
				</div>
				<div className="hint">
					Time here is an estimate to help compare growth. We turn the number of
					steps into seconds on a simple scale (from about 1 microsecond up to
					about 20 seconds). Only the O(log n) tab shows each decision step; the
					others show totals so you can see the trend.
				</div>
				{spec.id === "O(log n)" ? (
					<BinarySearchSteps arrayCSV={state.arrayCSV} target={state.target} />
				) : null}
				<div className="subtle">
					<strong>Real-world:</strong> {spec.realWorld}
				</div>
				<div className="code">
					<pre>
						<code>{spec.realWorldCode}</code>
					</pre>
				</div>
				{/* Disclaimer and warning under the information card */}
				<div className="footer" style={{ marginTop: 8 }}>
					<div>
						<strong>Disclaimer:</strong> all numbers are rough estimates, not
						actual computed figures.
					</div>
					<div>
						<strong>Warning:</strong> submitting incredibly large numbers can
						and will break the tab
					</div>
				</div>
			</div>
		</div>
	);
}
