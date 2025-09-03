// A tiny SVG line chart tailored for our Big-O samples.
// Focus: crisp axes, light grid, and simple animation when new points arrive.
import { useCallback, useMemo, useEffect, useRef, useState } from "react";

export interface Point {
	x: number;
	y: number;
}
export interface Series {
	id: string;
	color: string;
	points: Point[];
}

// "Nice" numbers for axis labels (keeps ticks human-friendly)
function niceNum(range: number, round: boolean) {
	const exp = Math.floor(Math.log10(range));
	const f = range / Math.pow(10, exp);
	let nf;
	if (round) {
		if (f < 1.5) nf = 1;
		else if (f < 3) nf = 2;
		else if (f < 7) nf = 5;
		else nf = 10;
	} else {
		if (f <= 1) nf = 1;
		else if (f <= 2) nf = 2;
		else if (f <= 5) nf = 5;
		else nf = 10;
	}
	return nf * Math.pow(10, exp);
}

function niceScale(min: number, max: number, ticks = 5) {
	if (!isFinite(min) || !isFinite(max) || min === max) {
		return { niceMin: 0, niceMax: 1, step: 1, values: [0, 1] };
	}
	const range = niceNum(max - min, false);
	const step = niceNum(range / (ticks - 1), true);
	const niceMin = Math.floor(min / step) * step;
	const niceMax = Math.ceil(max / step) * step;
	const values: number[] = [];
	for (let v = niceMin; v <= niceMax + 1e-12; v += step) values.push(v);
	return { niceMin, niceMax, step, values };
}

// Thin polyline that animates from nothing to full length on update
function SeriesLine({
	points,
	color,
}: {
	points: { x: number; y: number }[];
	color: string;
}) {
	const ref = useRef<SVGPolylineElement | null>(null);
	useEffect(() => {
		const el = ref.current as SVGPolylineElement | null;
		if (!el) return;
		try {
			const geom = el as unknown as SVGGeometryElement;
			const total =
				typeof geom.getTotalLength === "function" ? geom.getTotalLength() : 0;
			// Prepare dash to fully hide, then animate to 0
			el.style.transition = "none";
			el.style.strokeDasharray = String(total);
			el.style.strokeDashoffset = String(total);
			// Force style flush
			void el.getBoundingClientRect();
			el.style.transition = "stroke-dashoffset 450ms ease-out";
			el.style.strokeDashoffset = "0";
		} catch {
			// ignore if not supported
		}
	}, [points.length]);
	return (
		<polyline
			ref={ref}
			fill="none"
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			points={points.map((p) => `${p.x},${p.y}`).join(" ")}
		/>
	);
}

export function LineChart({
	title,
	series,
	width = 420,
	height = 420,
	yFormat,
	xLabel = "n",
	headerless = false,
}: {
	title: string;
	series: Series[];
	width?: number;
	height?: number;
	yFormat?: (v: number) => string;
	xLabel?: string;
	headerless?: boolean;
}) {
	// Paddings to avoid clipping tick labels (extra breathing room)
	const padLeft = 64,
		padRight = 32,
		padTop = 24,
		padBottom = 52;
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [cw, setCw] = useState<number>(width);
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const w = entry.contentRect.width;
				if (w && Math.abs(w - cw) > 0.5) setCw(w);
			}
		});
		ro.observe(el);
		return () => ro.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const W = Math.max(280, cw);
	const innerW = W - padLeft - padRight;
	const innerH = height - padTop - padBottom;
	const allPoints = series.flatMap((s) => s.points);
	const maxX = allPoints.length ? Math.max(...allPoints.map((p) => p.x)) : 1;
	const maxY = allPoints.length ? Math.max(...allPoints.map((p) => p.y)) : 1;
	const hasData = allPoints.length > 0;
	// Start axes at 0; exactly 5 ticks per axis for readability
	const xTicks = niceScale(0, Math.max(1, maxX), 5);
	const yTicks = niceScale(0, Math.max(1e-12, maxY), 5);
	const rx = innerW / Math.max(1e-9, xTicks.niceMax - xTicks.niceMin);
	const ry = innerH / Math.max(1e-9, yTicks.niceMax - yTicks.niceMin);
	const sx = useCallback(
		(x: number) => padLeft + (x - xTicks.niceMin) * rx,
		[padLeft, xTicks.niceMin, rx]
	);
	const sy = useCallback(
		(y: number) => height - padBottom - (y - yTicks.niceMin) * ry,
		[height, padBottom, yTicks.niceMin, ry]
	);

	type SPoint = { x: number; y: number; v: number };
	const scaled = useMemo(
		() =>
			series.map((s) => ({
				...s,
				points: s.points.map((p) => ({ x: sx(p.x), y: sy(p.y), v: p.y })),
			})),
		// sx, sy change when ticks/size change; include them
		[series, sx, sy]
	);

	return (
		<div ref={containerRef} style={{ width: "100%", minWidth: width }}>
			{headerless ? null : (
				<h3 style={{ color: "#e5e7eb", margin: "4px 0 8px 0", fontSize: 16 }}>
					{title}
				</h3>
			)}
			<svg
				width={W}
				height={height}
				style={{
					background: "#0b1220",
					border: "1px solid #1f2937",
					borderRadius: 8,
				}}
			>
				{/* Subtle 10-section gridlines */}
				{Array.from({ length: 11 }).map((_, i) => {
					const x = padLeft + (innerW * i) / 10;
					return (
						<line
							key={`vg-${i}`}
							x1={x}
							y1={padTop}
							x2={x}
							y2={height - padBottom}
							stroke="#1f2937"
							strokeWidth={0.5}
						/>
					);
				})}
				{Array.from({ length: 11 }).map((_, i) => {
					const y = padTop + (innerH * i) / 10;
					return (
						<line
							key={`hg-${i}`}
							x1={padLeft}
							y1={y}
							x2={W - padRight}
							y2={y}
							stroke="#1f2937"
							strokeWidth={0.5}
						/>
					);
				})}
				{/* Axes baselines */}
				<line
					x1={padLeft}
					y1={height - padBottom}
					x2={W - padRight}
					y2={height - padBottom}
					stroke="#475569"
					strokeWidth={0.75}
				/>
				<line
					x1={padLeft}
					y1={padTop}
					x2={padLeft}
					y2={height - padBottom}
					stroke="#475569"
					strokeWidth={0.75}
				/>

				{/* X ticks */}
				{xTicks.values.map((v, i) => (
					<g key={`xt-${i}`}>
						<line
							x1={sx(v)}
							y1={height - padBottom}
							x2={sx(v)}
							y2={height - padBottom + 6}
							stroke="#334155"
							strokeWidth={0.5}
						/>
						{hasData ? (
							<text
								x={sx(v)}
								y={height - padBottom + 18}
								fill="#94a3b8"
								fontSize={10}
								textAnchor="middle"
							>
								{Math.round(v)}
							</text>
						) : null}
					</g>
				))}
				<text
					x={W / 2}
					y={height - 6}
					fill="#94a3b8"
					fontSize={10}
					textAnchor="middle"
				>
					{xLabel}
				</text>

				{/* Y ticks */}
				{yTicks.values.map((v, i) => (
					<g key={`yt-${i}`}>
						<line
							x1={padLeft - 6}
							y1={sy(v)}
							x2={padLeft}
							y2={sy(v)}
							stroke="#334155"
							strokeWidth={0.5}
						/>
						{hasData ? (
							<text
								x={padLeft - 8}
								y={sy(v) + 3}
								fill="#94a3b8"
								fontSize={10}
								textAnchor="end"
							>
								{yFormat ? yFormat(v) : v.toFixed(2)}
							</text>
						) : null}
					</g>
				))}

				{/* Series lines and points */}
				{scaled.map((s) => (
					<g key={s.id}>
						<SeriesLine
							color={s.color}
							points={(s.points as SPoint[]).map((p) => ({ x: p.x, y: p.y }))}
						/>
						{(s.points as SPoint[]).map((p, idx: number) => (
							<g key={idx}>
								<circle cx={p.x} cy={p.y} r={2.5} fill={s.color} />
							</g>
						))}
					</g>
				))}
			</svg>
			<div
				style={{
					display: "flex",
					gap: 12,
					marginTop: 6,
					color: "#cbd5e1",
					fontSize: 12,
					flexWrap: "wrap",
				}}
			>
				{series.map((s) => (
					<div
						key={s.id}
						style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
					>
						<span
							style={{
								width: 12,
								height: 12,
								background: s.color,
								display: "inline-block",
								borderRadius: 2,
							}}
						/>
						<span>{s.id}</span>
					</div>
				))}
			</div>
		</div>
	);
}
