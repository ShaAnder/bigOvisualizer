import { useMemo, useState } from "react";
import { Tabs } from "./components/Tabs";
import { TABS } from "./data/bigO";
import { TabPanel } from "./components/TabPanel";
import { LineChart, type Series } from "./components/Charts";
import { SingleBarChart } from "./components/SingleBarChart";
import type { ControlsState } from "./types/controls";
import type { Notation } from "./types/bigo";
import { defaultControls } from "./state/defaults";

// App: wraps the two-column layout (left: info/inputs, right: visuals)
export default function App() {
	const [active, setActive] = useState<Notation>(TABS[0].id as Notation);
	// Per-notation accumulated samples for time (seconds)
	const [timeSeries, setTimeSeries] = useState<Record<Notation, Series>>(
		{} as Record<Notation, Series>
	);
	// Persist per-tab controls state so switching tabs keeps the last values until refresh
	const [tabStates, setTabStates] = useState<Record<Notation, ControlsState>>(
		() => {
			const init = {} as Record<Notation, ControlsState>;
			for (const t of TABS) init[t.id as Notation] = { ...defaultControls };
			return init;
		}
	);

	// One color per Big-O line (kept simple and readable)
	const colors: Record<Notation, string> = useMemo(
		() => ({
			"O(1)": "#22c55e",
			"O(log n)": "#3b82f6",
			"O(n)": "#f59e0b",
			"O(n log n)": "#a855f7",
			"O(n^2)": "#ef4444",
		}),
		[]
	);

	// Commit a time sample to the chart when the user presses Enter
	function onSample(notation: Notation, n: number, seconds?: number) {
		if (typeof seconds === "number") {
			setTimeSeries((prev) => {
				const s = prev[notation] ?? {
					id: notation,
					color: colors[notation] ?? "#fff",
					points: [],
				};
				const next = [...s.points];
				// Always start at the origin so the line grows from (0,0)
				if (next.length === 0) next.push({ x: 0, y: 0 });
				if (!(n === 0 && seconds === 0)) next.push({ x: n, y: seconds });
				return { ...prev, [notation]: { ...s, points: next } } as Record<
					Notation,
					Series
				>;
			});
		}
		// Space is shown as a simple bar (we don't line-chart it).
	}
	return (
		<div className="page">
			<header className="header">
				<h1>Big O Notation</h1>
			</header>
			<div className="subtle" style={{ marginBottom: 12 }}>
				Big O describes how an algorithm's time or space grows with input size
				n. It focuses on the trend, not exact times. Use the tabs to explore
				common classes and plot samples.
			</div>
			{/* Disclaimer under the description removed per request */}
			{/* Tabs moved into the left section container; chart header moved to right section */}
			{/* Two-column layout: left = tab info; right = time chart + space bar */}
			<div className="content-row">
				<div className="content-left">
					{/* Tabs sit in the left section container, outside the info panel box */}
					<div style={{ marginBottom: 8 }}>
						<Tabs
							tabs={TABS.map((t) => ({ id: t.id, label: t.id }))}
							active={active}
							onChange={(id) => setActive(id)}
						/>
					</div>
					<div className="panel">
						{TABS.filter((t) => t.id === active).map((spec) => (
							<TabPanel
								key={spec.id}
								spec={spec}
								state={tabStates[spec.id]}
								onChange={(patch) =>
									setTabStates((prev) => ({
										...prev,
										[spec.id]: { ...prev[spec.id], ...patch },
									}))
								}
								onSample={onSample}
							/>
						))}
					</div>
				</div>
				<div className="content-right">
					<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
						<h3 className="chart-header">Time (seconds) vs n</h3>
						<LineChart
							title="Time (seconds) vs n"
							headerless
							series={Object.values(timeSeries)}
							yFormat={(v) => {
								if (v < 1e-6) return `${(v * 1e9).toFixed(0)} ns`;
								if (v < 1e-3) return `${(v * 1e6).toFixed(0)} us`;
								if (v < 1) return `${(v * 1e3).toFixed(1)} ms`;
								if (v < 60) return `${v.toFixed(v < 10 ? 2 : 1)} s`;
								const m = v / 60;
								if (m < 60) return `${m.toFixed(m < 10 ? 2 : 1)} min`;
								const h = m / 60;
								if (h < 24) return `${h.toFixed(h < 10 ? 2 : 1)} h`;
								const d = h / 24;
								return `${d.toFixed(d < 10 ? 2 : 1)} d`;
							}}
						/>
						{/* Estimated Space Taken bar (a friendly static “meter”) */}
						<SingleBarChart
							notation={active}
							metric="space"
							n={tabStates[active].n}
							bytesPerItem={tabStates[active].bytesPerItem}
							overrideBytes={undefined}
							overrideSeconds={undefined}
						/>
						{/* Clamp notice and byte tooltip below the bar */}
						<div className="footer" style={{ marginTop: -8 }}>
							Clamp: 1 us-20 s; Space scaled up to ~1 GB for display
						</div>
						<div className="hint info">
							<span className="tooltip">
								<button
									type="button"
									className="icon"
									aria-label="What is a byte?"
								>
									i
								</button>
								<span className="tooltip-content">
									A byte is a small unit of memory. On many systems, a typical
									number uses about 8 bytes.
								</span>
							</span>
							<span>What is a byte?</span>
						</div>
					</div>
				</div>
			</div>
			<footer className="footer"></footer>
		</div>
	);
}
