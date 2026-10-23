// Local-time date helpers. "Today" always means the device's local day.

const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

/** Monday 00:00 local time of the week containing `date`. */
export function startOfWeekMonday(date: Date): Date {
  const start = startOfLocalDay(date);
  return addDays(start, -weekdayIndexMonday(start));
}

/** 0 = Monday … 6 = Sunday */
export function weekdayIndexMonday(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** YYYY-MM-DD in local time (for `date` columns). */
export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 1-based day of year in local time. */
export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.round((startOfLocalDay(date).getTime() - start.getTime()) / DAY_MS) + 1;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** "mm:ss", or "h:mm:ss" from one hour. Negative input shows 00:00. */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export const WEEKDAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** e.g. "23 Oct, 6:05 pm" */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const h = date.getHours();
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()} ${months[date.getMonth()]}, ${hour12}:${min} ${h < 12 ? 'am' : 'pm'}`;
}
