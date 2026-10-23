import { mapAuthError } from '@/features/auth/authErrors';
import { supabase } from '@/services/supabase';
import type { Tables } from '@/types/database';

export type Profile = Pick<
  Tables<'profiles'>,
  'id' | 'display_name' | 'onboarding_completed' | 'water_goal_ml' | 'goal_weight_kg'
>;

export async function fetchMyProfile(
  userId: string,
): Promise<{ data: Profile | null; error: string | null }> {
  try {
    // RLS guarantees only the signed-in user's own row is returned.
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, onboarding_completed, water_goal_ml, goal_weight_kg')
      .eq('id', userId)
      .maybeSingle();
    if (error) return { data: null, error: mapAuthError(error) };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: mapAuthError(e) };
  }
}
