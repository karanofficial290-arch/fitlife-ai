import { summarizeMeals, type DaySummary } from '@/features/nutrition/nutritionLogic';
import { fetchMealsForDay } from '@/features/nutrition/nutritionService';
import { fetchMyProfile, type Profile } from '@/features/profile/profileService';
import { fetchLatestWeight, fetchWaterForDay, type LatestWeight } from '@/features/tracking/trackingService';
import type { SessionSummary, WorkoutPlan } from '@/features/workouts/types';
import {
  fetchActiveSession,
  fetchPlans,
  fetchSessionsSince,
  type SessionDetail,
} from '@/features/workouts/workoutService';
import { startOfWeekMonday } from '@/utils/dates';

export type HomeData = {
  profile: Profile | null;
  plans: WorkoutPlan[];
  active: SessionDetail | null;
  weekSessions: SessionSummary[];
  waterTodayMl: number;
  latestWeight: LatestWeight | null;
  nutrition: DaySummary;
};

/** Everything the Home dashboard needs, fetched in parallel. */
export async function loadHomeData(userId: string, now: Date): Promise<{ data: HomeData | null; error: string | null }> {
  const [profile, plans, active, week, water, weight, meals] = await Promise.all([
    fetchMyProfile(userId),
    fetchPlans(),
    fetchActiveSession(),
    fetchSessionsSince(startOfWeekMonday(now)),
    fetchWaterForDay(now),
    fetchLatestWeight(),
    fetchMealsForDay(now),
  ]);
  const error = profile.error ?? plans.error ?? active.error ?? week.error ?? water.error ?? weight.error ?? meals.error;
  if (error) return { data: null, error };
  return {
    data: {
      profile: profile.data,
      plans: plans.data ?? [],
      active: active.data ?? null,
      weekSessions: week.data ?? [],
      waterTodayMl: water.data ?? 0,
      latestWeight: weight.data ?? null,
      nutrition: summarizeMeals(meals.data ?? []),
    },
    error: null,
  };
}
