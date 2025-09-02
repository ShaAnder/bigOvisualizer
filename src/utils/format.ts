export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return 'N/A';
  const s = seconds;
  if (s < 1e-6) return `${(s * 1e9).toFixed(0)} ns`;
  if (s < 1e-3) return `${(s * 1e6).toFixed(0)} us`;
  if (s < 1) return `${(s * 1e3).toFixed(1)} ms`;
  if (s < 60) return `${s.toFixed(2)} s`;
  const m = Math.floor(s / 60);
  const rs = s - m * 60;
  return `${m}m ${rs.toFixed(0)}s`;
}

export function formatBytes(bytes: number): string {
  if (!isFinite(bytes) || bytes < 0) return 'N/A';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2)} ${units[i]}`;
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function toSeconds(value: number, unit: 'ns'|'us'|'ms'|'s') {
  switch (unit) {
    case 'ns': return value / 1e9;
  case 'us': return value / 1e6;
    case 'ms': return value / 1e3;
    default: return value;
  }
}

export function widthFromSeconds(seconds: number) {
  // Map 1us..20s to 1%..100% logarithmically-ish
  const min = 1e-6; const max = 20; // clamp around 20 seconds
  const s = clamp(seconds, min, max);
  const t = (Math.log10(s) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
  return clamp(t * 100, 1, 100);
}

export function widthFromBytes(bytes: number) {
  const min = 1; // 1 B
  const max = 1024 ** 3; // 1 GB
  const b = clamp(bytes, min, max);
  const t = (Math.log10(b) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
  return clamp(t * 100, 1, 100);
}
