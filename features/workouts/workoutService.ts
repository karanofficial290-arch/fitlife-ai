import { mapError } from '@/features/auth/authErrors';
import { supabase } from '@/services/supabase';

import type { SessionSummary, WorkoutPlan } from './types';

export type Result<T> = { data: T | null; error: string | null };

const PLAN_COLUMNS = 'id, slug, name, description, muscle_group, level, location, estimated_minutes';
const SESSION_COLUMNS = 'id, plan_id, plan_name, status, started_at, ended_at';
export const PAGE_SIZE = 20;

async function safe<T>(fn: () => Promise<Result<T>>): Promise<Result<T>> {
  try {
    return await fn();
  } catch (e) {
    return { data: null, error: mapError(e) };
  }
}

/** Whole plan catalog (small, bounded) with exercise counts. */
export function fetchPlans(): Promise<Result<WorkoutPlan[]>> {
  return safe(async () => {
    const { data, error } = await supabase
      .from('workout_plans')
      .select(`${PLAN_COLUMNS}, workout_plan_exercises(count)`)
      .order('name')
      .limit(200);
    if (error) return { data: null, error: mapError(error) };
    const plans: WorkoutPlan[] = (data ?? []).map(({ workout_plan_exercises, ...plan }) => ({
      ...plan,
      exercise_count: workout_plan_exercises?.[0]?.count ?? 0,
    }));
    return { data: plans, error: null };
  });
}

export type PlanExercise = {
  id: string;
  position: number;
  sets: number;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number;
  exercise: { id: string; name: string; equipment: string; instructions: string } | null;
};

export type PlanDetail = Omit<WorkoutPlan, 'exercise_count'> & { exercises: PlanExercise[] };

export function fetchPlanDetail(planId: string): Promise<Result<PlanDetail>> {
  return safe(async () => {
    const { data, error } = await supabase
      .from('workout_plans')
      .select(
        `${PLAN_COLUMNS}, workout_plan_exercises(id, position, sets, reps, duration_seconds, rest_seconds, exercise:exercises(id, name, equipment, instructions))`,
      )
      .eq('id', planId)
      .order('position', { referencedTable: 'workout_plan_exercises' })
      .maybeSingle();
    if (error) return { data: null, error: mapError(error) };
    if (!data) return { data: null, error: 'Ye workout nahi mila.' };
    const { workout_plan_exercises, ...plan } = data;
    return { data: { ...plan, exercises: workout_plan_exercises ?? [] }, error: null };
  });
}

export type LibraryExercise = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  location: string;
  level: string;
  instructions: string;
};

export function fetchExercises(muscle: string | 'all', page: number): Promise<Result<LibraryExercise[]>> {
  return safe(async () => {
    let query = supabase
      .from('exercises')
      .select('id, name, muscle_group, equipment, location, level, instructions')
      .order('muscle_group')
      .order('name')
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    if (muscle !== 'all') query = query.eq('muscle_group', muscle);
    const { data, error } = await query;
    if (error) return { data: null, error: mapError(error) };
    return { data: data ?? [], error: null };
  });
}

/** Starts (or resumes) a workout on the server; returns the session id. */
export function startWorkout(planId: string): Promise<Result<string>> {
  return safe(async () => {
    const { data, error } = await supabase.rpc('start_workout_session', { p_plan_id: planId });
    if (error) return { data: null, error: mapError(error) };
    return { data, error: null };
  });
}

export type SessionExercise = {
  id: string;
  position: number;
  sets: number;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number;
  completed_at: string | null;
  exercise: { id: string; name: string; instructions: string } | null;
};

export type SessionDetail = SessionSummary & { exercises: SessionExercise[] };

const SESSION_DETAIL_SELECT = `${SESSION_COLUMNS}, workout_session_exercises(id, position, sets, reps, duration_seconds, rest_seconds, completed_at, exercise:exercises(id, name, instructions))`;

function toDetail(row: SessionSummary & { workout_session_exercises: SessionExercise[] | null }): SessionDetail {
  const { workout_session_exercises, ...session } = row;
  return { ...session, exercises: workout_session_exercises ?? [] };
}

export function fetchSession(sessionId: string): Promise<Result<SessionDetail>> {
  return safe(async () => {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(SESSION_DETAIL_SELECT)
      .eq('id', sessionId)
      .order('position', { referencedTable: 'workout_session_exercises' })
      .maybeSingle();
    if (error) return { data: null, error: mapError(error) };
    if (!data) return { data: null, error: 'Ye workout session nahi mila.' };
    return { data: toDetail(data), error: null };
  });
}

/** The signed-in user's running workout, if any (RLS limits rows to the user). */
export function fetchActiveSession(): Promise<Result<SessionDetail | null>> {
  return safe(async () => {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(SESSION_DETAIL_SELECT)
      .eq('status', 'in_progress')
      .order('position', { referencedTable: 'workout_session_exercises' })
      .limit(1)
      .maybeSingle();
    if (error) return { data: null, error: mapError(error) };
    return { data: data ? toDetail(data) : null, error: null };
  });
}

export function completeSessionExercise(sessionExerciseId: string): Promise<Result<true>> {
  return safe(async () => {
    const { error } = await supabase
      .from('workout_session_exercises')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', sessionExerciseId);
    if (error) return { data: null, error: mapError(error) };
    return { data: true, error: null };
  });
}

export function endSession(sessionId: string, status: 'completed' | 'abandoned'): Promise<Result<true>> {
  return safe(async () => {
    const { error } = await supabase
      .from('workout_sessions')
      .update({ status, ended_at: new Date().toISOString() })
      .eq('id', sessionId)
      .eq('status', 'in_progress');
    if (error) return { data: null, error: mapError(error) };
    return { data: true, error: null };
  });
}

/** Sessions started at or after `since` (bounded, for weekly charts). */
export function fetchSessionsSince(since: Date): Promise<Result<SessionSummary[]>> {
  return safe(async () => {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(SESSION_COLUMNS)
      .gte('started_at', since.toISOString())
      .order('started_at', { ascending: false })
      .limit(100);
    if (error) return { data: null, error: mapError(error) };
    return { data: data ?? [], error: null };
  });
}

/** Finished workouts, newest first, one page at a time. */
export function fetchHistory(page: number): Promise<Result<SessionSummary[]>> {
  return safe(async () => {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(SESSION_COLUMNS)
      .neq('status', 'in_progress')
      .order('started_at', { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    if (error) return { data: null, error: mapError(error) };
    return { data: data ?? [], error: null };
  });
}
