/** Clamp a ratio to 0..1, treating NaN/Infinity as 0. */
export function clampProgress(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value >= 1 ? 1 : value;
}

/** Safe ratio of done/total for progress UI. */
export function ratio(done: number, total: number): number {
  if (!Number.isFinite(done) || !Number.isFinite(total) || total <= 0) return 0;
  return clampProgress(done / total);
}

export function percent(value: number): number {
  return Math.round(clampProgress(value) * 100);
}
