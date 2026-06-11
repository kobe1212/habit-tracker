/**
 * Generate up to 5 evenly-spaced integer y-axis ticks for a chart whose
 * values peak at `max`. Small ranges (<=4) get one tick per unit.
 */
export function makeTicks(max: number): number[] {
  const m = Math.max(1, Math.ceil(max));
  if (m <= 4) return Array.from({ length: m + 1 }, (_, i) => i);
  const step = Math.ceil(m / 4);
  return [0, step, step * 2, step * 3, step * 4];
}
