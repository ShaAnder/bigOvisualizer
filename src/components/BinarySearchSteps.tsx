import { useMemo } from "react";

export function BinarySearchSteps({
	arrayCSV,
	target,
}: {
	arrayCSV: string;
	target: string;
}) {
	const { steps, note, pt } = useMemo(() => {
		const nums = arrayCSV
			.split(",")
			.map((s) => s.trim())
			.filter((s) => s.length > 0)
			.map((s) => Number(s))
			.filter((n) => Number.isFinite(n));
		const t = Number(target);
		if (!Number.isFinite(t)) {
			return {
				steps: [],
				note: "Enter a numeric target to simulate steps.",
				pt: null,
			};
		}
		let l = 0;
		let r = nums.length - 1;
		const res: {
			l: number;
			r: number;
			m: number;
			mv: number;
			dir: "left" | "right" | "found";
		}[] = [];
		while (l <= r) {
			const m = (l + r) >> 1;
			const mv = nums[m];
			if (mv === t) {
				res.push({ l, r, m, mv, dir: "found" });
				break;
			}
			if (mv < t) {
				res.push({ l, r, m, mv, dir: "right" });
				l = m + 1;
			} else {
				res.push({ l, r, m, mv, dir: "left" });
				r = m - 1;
			}
			if (res.length > 64) break; // safety
		}
		return {
			steps: res,
			note: nums.length === 0 ? "Array is empty." : "",
			pt: t,
		};
	}, [arrayCSV, target]);

	return (
		<details>
			<summary>How it works: Binary search steps</summary>
			<div className="code" style={{ marginTop: 8 }}>
				<div className="hint" style={{ marginBottom: 8 }}>
					Extra space note: this iterative binary search uses O(1) auxiliary
					space — just a few variables (l, r, m) to track the current range. The
					input array is not counted as extra space. Looking for a single number
					does not allocate more memory.
				</div>
				{note ? <div>{note}</div> : null}
				{steps.length === 0 && !note ? <div>No steps to show.</div> : null}
				{steps.map((s, i) => (
					<div key={i} style={{ marginBottom: 8 }}>
						<div>
							Step {i + 1}: range [l={s.l}, r={s.r}], mid m={s.m}, arr[m]={s.mv}{" "}
							-&gt;
							{s.dir === "found"
								? ` found number (${pt})`
								: s.dir === "left"
								? ` number (${pt}) not found; go left (r = m - 1)`
								: ` number (${pt}) not found; go right (l = m + 1)`}
						</div>
					</div>
				))}
			</div>
		</details>
	);
}
