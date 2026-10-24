import { mapError } from '@/features/auth/authErrors';
import { supabase } from '@/services/supabase';
import { toLocalDateString } from '@/utils/dates';

import type { MealInsert } from './mealValidation';

type Result<T> = { data: T | null; error: string | null };

export type MealLog = {
  id: string;
  meal_type: string;
  name: string;
  portion: string | null;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

/** All meals the user logged on the local day containing `day` (bounded). */
export async function fetchMealsForDay(day: Date): Promise<Result<MealLog[]>> {
  try {
    const { data, error } = await supabase
      .from('meal_logs')
      .select('id, meal_type, name, portion, calories, protein_g, carbs_g, fat_g')
      .eq('logged_on', toLocalDateString(day))
      .order('created_at')
      .limit(200);
    if (error) return { data: null, error: mapError(error) };
    return { data: data ?? [], error: null };
  } catch (e) {
    return { data: null, error: mapError(e) };
  }
}

export async function logMeal(userId: string, meal: MealInsert, day: Date): Promise<Result<true>> {
  try {
    const { error } = await supabase
      .from('meal_logs')
      .insert({ ...meal, user_id: userId, logged_on: toLocalDateString(day) });
    if (error) return { data: null, error: mapError(error) };
    return { data: true, error: null };
  } catch (e) {
    return { data: null, error: mapError(e) };
  }
}
