import { mapError } from '@/features/auth/authErrors';
import { supabase } from '@/services/supabase';
import { addDays, startOfLocalDay, toLocalDateString } from '@/utils/dates';

type Result<T> = { data: T | null; error: string | null };

async function safe<T>(fn: () => Promise<Result<T>>): Promise<Result<T>> {
  try {
    return await fn();
  } catch (e) {
    return { data: null, error: mapError(e) };
  }
}

/** Total water (ml) logged during the local day containing `now`. */
export function fetchWaterForDay(now: Date): Promise<Result<number>> {
  return safe(async () => {
    const start = startOfLocalDay(now);
    const { data, error } = await supabase
      .from('water_logs')
      .select('amount_ml')
      .gte('logged_at', start.toISOString())
      .lt('logged_at', addDays(start, 1).toISOString())
      .limit(500);
    if (error) return { data: null, error: mapError(error) };
    return { data: (data ?? []).reduce((sum, row) => sum + row.amount_ml, 0), error: null };
  });
}

export function logWater(userId: string, amountMl: number): Promise<Result<true>> {
  return safe(async () => {
    const { error } = await supabase.from('water_logs').insert({ user_id: userId, amount_ml: amountMl });
    if (error) return { data: null, error: mapError(error) };
    return { data: true, error: null };
  });
}

export type LatestWeight = { weight_kg: number; logged_on: string };

export function fetchLatestWeight(): Promise<Result<LatestWeight | null>> {
  return safe(async () => {
    const { data, error } = await supabase
      .from('weight_logs')
      .select('weight_kg, logged_on')
      .order('logged_on', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return { data: null, error: mapError(error) };
    return { data, error: null };
  });
}

/** One weight per local day; logging again the same day replaces it. */
export function logWeight(userId: string, weightKg: number, now: Date): Promise<Result<true>> {
  return safe(async () => {
    const { error } = await supabase
      .from('weight_logs')
      .upsert(
        { user_id: userId, weight_kg: weightKg, logged_on: toLocalDateString(now) },
        { onConflict: 'user_id,logged_on' },
      );
    if (error) return { data: null, error: mapError(error) };
    return { data: true, error: null };
  });
}

export function saveGoalWeight(userId: string, weightKg: number): Promise<Result<true>> {
  return safe(async () => {
    const { error } = await supabase.from('profiles').update({ goal_weight_kg: weightKg }).eq('id', userId);
    if (error) return { data: null, error: mapError(error) };
    return { data: true, error: null };
  });
}
