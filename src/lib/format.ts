import type { Frequency } from "../types";
import { dateUtils } from "./dateUtils";

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "Jun 10, 2026" from a YYYY-MM-DD string. */
export function formatLongDate(dateStr: string): string {
  const d = dateUtils.parseDate(dateStr);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "Mon, Jun 8" from a YYYY-MM-DD string (used in chart tooltips). */
export function formatDayLabel(dateStr: string): string {
  const d = dateUtils.parseDate(dateStr);
  return `${dateUtils.getShortDayName(d.getDay())}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/** Human-readable schedule, e.g. "Every day" or "Mon, Wed, Fri". */
export function frequencyLabel(frequency: Frequency): string {
  if (frequency === "daily") return "Every day";
  return frequency.map((d) => dateUtils.getShortDayName(d)).join(", ");
}
