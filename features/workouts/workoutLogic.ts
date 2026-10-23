// Pure workout logic (no Supabase/React imports) so it can be unit tested.

import { dayOfYear, isSameLocalDay, startOfWeekMonday, weekdayIndexMonday } from '../../utils/dates';

import type { PlanFilters, PlanLocation, SessionSummary, WorkoutPlan } from './types';

export function filterPlans(plans: readonly WorkoutPlan[], filters: PlanFilters): WorkoutPlan[] {
  return plans.filter(
    (p) =>
      p.location === filters.location &&
      (filters.muscle === 'all' || p.muscle_group === filters.muscle) &&
      (filters.level === 'all' || p.level === filters.level),
  );
}

/**
 * Picks a stable "today's workout": rotates through plans for the chosen
 * location by day of year, so it changes daily but is the same all day.
 */
export function pickTodaysPlan(
  plans: readonly WorkoutPlan[],
  date: Date,
  location: PlanLocation,
): WorkoutPlan | null {
  const pool = plans
    .filter((p) => p.location === location)
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug));
  if (pool.length === 0) return null;
  return pool[dayOfYear(date) % pool.length] ?? null;
}

/** Minutes of completed workouts per weekday (Mon..Sun) for the week containing `now`. */
export function weeklyWorkoutMinutes(sessions: readonly SessionSummary[], now: Date): number[] {
  const weekStart = startOfWeekMonday(now).getTime();
  const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;
  const minutes = [0, 0, 0, 0, 0, 0, 0];
  for (const s of sessions) {
    if (s.status !== 'completed' || !s.ended_at) continue;
    const started = new Date(s.started_at);
    const t = started.getTime();
    if (t < weekStart || t >= weekEnd) continue;
    const mins = Math.max(0, Math.round((new Date(s.ended_at).getTime() - t) / 60000));
    const idx = weekdayIndexMonday(started);
    minutes[idx] = (minutes[idx] ?? 0) + mins;
  }
  return minutes;
}

export function completedToday(sessions: readonly SessionSummary[], now: Date): boolean {
  return sessions.some(
    (s) => s.status === 'completed' && !!s.ended_at && isSameLocalDay(new Date(s.ended_at), now),
  );
}

/** Index of the first exercise not yet completed, or -1 when all are done. */
export function nextExerciseIndex(exercises: readonly { completed_at: string | null }[]): number {
  return exercises.findIndex((e) => !e.completed_at);
}

/** "3 × 12 reps" or "3 × 30 sec" */
export function formatPrescription(sets: number, reps: number | null, durationSeconds: number | null): string {
  if (reps != null) return `${sets} × ${reps} reps`;
  if (durationSeconds != null) return `${sets} × ${durationSeconds} sec`;
  return `${sets} sets`;
}
