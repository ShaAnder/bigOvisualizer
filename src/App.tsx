import { useMemo, useState } from "react";
import { Tabs } from "./components/Tabs";
import { TABS } from "./data/bigO";
import { TabPanel } from "./components/TabPanel";
import { LineChart, type Series } from "./components/Charts";

export default function App() {
	const [active, setActive] = useState(TABS[0].id);
	// Per-notation accumulated samples for time (seconds) and space (bytes)
	const [timeSeries, setTimeSeries] = useState<Record<string, Series>>({});
	const [spaceSeries, setSpaceSeries] = useState<Record<string, Series>>({});

	const colors: Record<string, string> = useMemo(() => ({
		"O(1)": "#22c55e",
		"O(log n)": "#3b82f6",
		"O(n)": "#f59e0b",
		"O(n log n)": "#a855f7",
		"O(n^2)": "#ef4444",
	}), []);

	function onSample(notation: string, n: number, seconds: number, bytes: number) {
		setTimeSeries((prev) => {
			const s = prev[notation] ?? { id: notation, color: colors[notation] ?? "#fff", points: [] };
			return { ...prev, [notation]: { ...s, points: [...s.points, { x: n, y: seconds }] } };
		});
		setSpaceSeries((prev) => {
			const s = prev[notation] ?? { id: notation, color: colors[notation] ?? "#fff", points: [] };
			return { ...prev, [notation]: { ...s, points: [...s.points, { x: n, y: bytes }] } };
		});
	}
	return (
		<div className="page">
			<header className="header">
				<h1>Big O Notation</h1>
			</header>
			<div className="subtle" style={{ marginBottom: 12 }}>
				Big O describes how an algorithm's time or space grows with input size
				n. It focuses on the trend, not exact times. Use the tabs to explore
				common classes with a single animated bar.
			</div>
			<div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 12 }}>
				<LineChart title="Time (seconds) vs n" series={Object.values(timeSeries)} yFormat={(v)=> v < 1e-3 ? `${(v*1e6).toFixed(0)} us` : v < 1 ? `${(v*1e3).toFixed(1)} ms` : `${v.toFixed(2)} s`} />
				<LineChart title="Space (bytes) vs n" series={Object.values(spaceSeries)} yFormat={(v)=>{
					const units=["B","KB","MB","GB"]; let i=0; let x=v; while(x>=1024 && i<units.length-1){x/=1024;i++;}
					return `${x.toFixed(x>=100?0:x>=10?1:2)} ${units[i]}`;
				}} />
			</div>
			<Tabs
				tabs={TABS.map((t) => ({ id: t.id, label: t.id }))}
				active={active}
				onChange={(id) => setActive(id)}
			/>
			<div className="panel" style={{ marginTop: 8 }}>
				{TABS.filter((t) => t.id === active).map((spec) => (
					<TabPanel key={spec.id} spec={spec} onSample={onSample} />
				))}
			</div>
			<footer className="footer">
				Clamp: 1 us-20 s; Space scaled up to ~1 GB for display
			</footer>
		</div>
	);
}
