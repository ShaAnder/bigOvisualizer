// SingleBarChart renders a single horizontal bar that represents either time or space.
// It shows a static, easy-to-read estimate without any realtime animation.
import { useMemo } from "react";
import type { Metric, Notation } from "../types/bigo";
import {
	formatBytes,
	formatDuration,
	toSeconds,
	widthFromBytes,
	widthFromSeconds,
} from "../utils/format";
import { BASELINE_NS_PER_OP } from "../config/constants";

// A single horizontal meter: time or space, whichever we ask for.
export function SingleBarChart({
	notation,
	metric,
	n,
	bytesPerItem,
	overrideSeconds,
	overrideBytes,
}: {
	notation: Notation; // Big-O class for this tab
	metric: Metric; // 'time' or 'space'
	n: number; // problem size (or array length)
	bytesPerItem: number; // bytes per item for space estimates
	overrideSeconds?: number; // optional exact time from example code
	overrideBytes?: number; // optional exact space from example code
}) {
	// Rough count of operations by notation; good enough to compare growth
	const ops = useMemo(() => {
		if (notation === "O(1)") return 1;
		if (notation === "O(log n)") {
			const nn = Math.max(1, Math.floor(n));
			return Math.ceil(Math.log2(nn + 1));
		}
		if (notation === "O(n)") return Math.max(0, n);
		if (notation === "O(n log n)")
			return Math.max(0, n) * Math.max(1, Math.ceil(Math.log2(Math.max(1, n))));
		// O(n^2)
		const nn = Math.max(0, n);
		return nn * nn;
	}, [notation, n]);

	// If time metric is selected, compute a static seconds value.
	const totalSeconds = useMemo(() => {
		if (typeof overrideSeconds === "number" && overrideSeconds >= 0)
			return overrideSeconds;
		const per = toSeconds(BASELINE_NS_PER_OP, "ns");
		return per * ops;
	}, [ops, overrideSeconds]);

	// If space metric is selected, compute a static bytes value.
	const totalBytes = useMemo(() => {
		if (typeof overrideBytes === "number" && overrideBytes >= 0)
			return overrideBytes;
		if (metric === "time") return 0;
		if (notation === "O(1)") return bytesPerItem; // simple constant
		if (notation === "O(log n)") {
			// binary search uses O(1) extra; do not count input
			return bytesPerItem;
		}
		if (notation === "O(n)") return Math.max(0, n) * bytesPerItem;
		if (notation === "O(n log n)") return Math.max(0, n) * bytesPerItem; // e.g., mergesort temp arrays
		return Math.max(0, n) * Math.max(0, n) * bytesPerItem;
	}, [metric, notation, n, bytesPerItem, overrideBytes]);

	// Map absolute values to a width percentage - static (no animation)
	const width =
		metric === "time"
			? widthFromSeconds(totalSeconds)
			: widthFromBytes(totalBytes);
	const displaySeconds = totalSeconds;
	const displayBytes = totalBytes;

	// Friendly details to help beginners see how iterations relate to operations
	const iterations = useMemo(() => {
		const nn = Math.max(0, Math.floor(n));
		if (notation === "O(1)") return 1;
		if (notation === "O(log n)")
			return Math.max(1, Math.ceil(Math.log2(Math.max(1, nn) + 1)));
		if (notation === "O(n)") return nn;
		if (notation === "O(n log n)")
			return nn * Math.max(1, Math.ceil(Math.log2(Math.max(1, nn))));
		// O(n^2): number of pairs is n(n+1)/2
		return (nn * (nn + 1)) / 2;
	}, [notation, n]);

	const detailHint = useMemo(() => {
		const nn = Math.max(0, Math.floor(n));
		if (metric !== "time") return null;
		if (notation === "O(1)") return "Iterations: 1; constant-time work.";
		if (notation === "O(log n)")
			return `Decisions: ceil(log2(n + 1)) = ${iterations.toLocaleString()}`;
		if (notation === "O(n)")
			return `Iterations: n = ${nn.toLocaleString()}; approx ops ≈ c x n (checks + i++ + body).`;
		if (notation === "O(n log n)") {
			const lg = Math.max(1, Math.ceil(Math.log2(Math.max(1, nn))));
			return `Iterations ≈ n x ceil(log2 n) = ${nn.toLocaleString()} x ${lg} = ${iterations.toLocaleString()}.`;
		}
		// O(n^2)
		return `Pairs processed ≈ n(n + 1)/2 = ${iterations.toLocaleString()}; approx ops ≈ c x pairs.`;
	}, [metric, notation, n, iterations]);

	const walkthrough =
		metric === "time"
			? typeof overrideSeconds === "number" && overrideSeconds >= 0
				? `Example time: ${formatDuration(overrideSeconds)}`
				: `Time (normalized): ~${ops.toLocaleString()} operations -> mapped to 1us-20s`
			: notation === "O(log n)"
			? `Extra space: constant auxiliary memory (iterative), shown as a small fixed budget`
			: notation === "O(n)"
			? `Extra space: about ceil(n/2) items x ${bytesPerItem} B/item`
			: notation === "O(n log n)"
			? `Extra space: mergesort temporary arrays ~ n items x ${bytesPerItem} B/item`
			: `Extra space: matrix of n x n items x ${bytesPerItem} B/item`;

	return (
		<div className="chart">
			<div className="metrics">
				{metric === "time" ? (
					<>
						<div>{`~${ops.toLocaleString()} operations -> ${formatDuration(
							displaySeconds
						)} (seconds)`}</div>
						<div>clamped to 1us-20s</div>
					</>
				) : (
					<>
						<div>{`${formatBytes(displayBytes)} (space)`}</div>
						<div>scaled to ~1GB</div>
					</>
				)}
			</div>
			<div className="bar-rail">
				<div className="bar" style={{ width: `${width}%` }} />
			</div>
			{detailHint ? (
				<div className="hint" style={{ marginTop: 6 }}>
					{detailHint}
				</div>
			) : null}
			<div className="walkthrough">{walkthrough}</div>
		</div>
	);
}
