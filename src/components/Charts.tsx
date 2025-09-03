import { useCallback, useMemo } from "react";

export interface Point { x: number; y: number }
export interface Series { id: string; color: string; points: Point[] }

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

export function LineChart({
  title,
  series,
  width = 560,
  height = 260,
  yFormat,
  xLabel = "n",
}: {
  title: string;
  series: Series[];
  width?: number;
  height?: number;
  yFormat?: (v: number) => string;
  xLabel?: string;
}) {
  // Paddings to avoid clipping tick labels
  const padLeft = 56, padRight = 24, padTop = 16, padBottom = 44;
  const allPoints = series.flatMap(s => s.points);
  const minX = allPoints.length ? Math.min(...allPoints.map(p => p.x)) : 0;
  const maxX = allPoints.length ? Math.max(...allPoints.map(p => p.x)) : 1;
  const minY = allPoints.length ? Math.min(...allPoints.map(p => p.y)) : 0;
  const maxY = allPoints.length ? Math.max(...allPoints.map(p => p.y)) : 1;
  // Start axes at 0 for clearer comparison when first point > 0
  const xTicks = niceScale(Math.min(0, minX), maxX, 7);
  const yTicks = niceScale(Math.min(0, minY), maxY, 7);
  const rx = (width - padLeft - padRight) / Math.max(1e-9, (xTicks.niceMax - xTicks.niceMin));
  const ry = (height - padTop - padBottom) / Math.max(1e-9, (yTicks.niceMax - yTicks.niceMin));
  const sx = useCallback((x: number) => padLeft + (x - xTicks.niceMin) * rx, [padLeft, xTicks.niceMin, rx]);
  const sy = useCallback((y: number) => height - padBottom - (y - yTicks.niceMin) * ry, [height, padBottom, yTicks.niceMin, ry]);

  type SPoint = { x: number; y: number; v: number };
  const scaled = useMemo(
    () => series.map(s => ({ ...s, points: s.points.map(p => ({ x: sx(p.x), y: sy(p.y), v: p.y })) })),
    // sx, sy change when ticks/size change; include them
    [series, sx, sy]
  );

  return (
  <div style={{ minWidth: width }}>
      <h3 style={{ color: '#e5e7eb', margin: '4px 0 8px 0', fontSize: 16 }}>{title}</h3>
      <svg width={width} height={height} style={{ background: '#0b1220', borderRadius: 8 }}>
        {/* No axis baselines; only labels remain */}

        {/* X ticks */}
  {xTicks.values.map((v, i) => (
      <g key={`xt-${i}`}>
    <text x={sx(v)} y={height - padBottom + 18} fill="#94a3b8" fontSize={10} textAnchor="middle">{Math.round(v)}</text>
      </g>
    ))}
    <text x={(width) / 2} y={height - 6} fill="#94a3b8" fontSize={10} textAnchor="middle">{xLabel}</text>

        {/* Y ticks */}
  {yTicks.values.map((v, i) => (
      <g key={`yt-${i}`}>
    <text x={padLeft - 8} y={sy(v) + 3} fill="#94a3b8" fontSize={10} textAnchor="end">{yFormat ? yFormat(v) : v.toFixed(2)}</text>
      </g>
    ))}

        {/* Series lines and points */}
        {scaled.map(s => (
          <g key={s.id}>
            <polyline fill="none" stroke={s.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" points={(s.points as SPoint[]).map((p) => `${p.x},${p.y}`).join(' ')} />
            {(s.points as SPoint[]).map((p, idx: number) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r={2.5} fill={s.color} />
              </g>
            ))}
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 12, marginTop: 6, color: '#cbd5e1', fontSize: 12, flexWrap: 'wrap' }}>
        {series.map(s => (
          <div key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, background: s.color, display: 'inline-block', borderRadius: 2 }} />
            <span>{s.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
