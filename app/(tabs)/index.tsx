import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Avatar } from '@/components/ui/Avatar';
import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { FormMessage } from '@/components/ui/FormMessage';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import {
  CardRow,
  FeatureTile,
  HeroCard,
  QuickAction,
  SoonBanner,
  StatCard,
  TodayWorkoutCard,
  WeeklyProgressCard,
} from '@/features/home/HomeCards';
import { loadHomeData } from '@/features/home/homeData';
import { WaterSheet } from '@/features/tracking/components/WaterSheet';
import { WeightSheet, type WeightSheetMode } from '@/features/tracking/components/WeightSheet';
import { formatWater } from '@/features/tracking/trackingValidation';
import { useStartWorkout } from '@/features/workouts/useStartWorkout';
import { useWorkoutLocation } from '@/features/workouts/useWorkoutLocation';
import { completedToday, pickTodaysPlan, weeklyWorkoutMinutes } from '@/features/workouts/workoutLogic';
import { useFocusLoader } from '@/hooks/useFocusLoader';
import { weekdayIndexMonday } from '@/utils/dates';
import { getGreeting } from '@/utils/greeting';
import { ratio } from '@/utils/progress';
import { firstName } from '@/utils/text';

export default function HomeScreen() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const load = useCallback(() => loadHomeData(userId, new Date()), [userId]);
  const { data, loading, error, reload } = useFocusLoader(load);
  const location = useWorkoutLocation();
  const { start, startingPlanId, error: startError } = useStartWorkout();
  const [waterOpen, setWaterOpen] = useState(false);
  const [weightMode, setWeightMode] = useState<WeightSheetMode | null>(null);

  const now = new Date();
  const todays = useMemo(() => (data ? pickTodaysPlan(data.plans, new Date(), location) : null), [data, location]);
  const weekMinutes = useMemo(() => weeklyWorkoutMinutes(data?.weekSessions ?? [], new Date()), [data]);

  const waterGoal = data?.profile?.water_goal_ml ?? 3000;
  const waterMl = data?.waterTodayMl ?? 0;
  const workoutDone = data ? completedToday(data.weekSessions, now) : false;
  // Goals tracked today: water and one workout. Diet/steps join when built.
  const goalProgress = (ratio(waterMl, waterGoal) + (workoutDone ? 1 : 0)) / 2;

  const active = data?.active ?? null;
  const activeDone = active ? active.exercises.filter((e) => e.completed_at).length : 0;

  function onTodayWorkout() {
    if (active) {
      router.push({ pathname: '/workouts/session/[id]', params: { id: active.id } });
    } else if (todays) {
      void start(todays.id);
    } else {
      router.push('/workout');
    }
  }

  return (
    <Screen edges={['top', 'left', 'right']}>
      <AppHeader right={<Avatar name={data?.profile?.display_name} onPress={() => router.push('/profile')} />} />

      <ErrorRetry message={data ? null : error} onRetry={reload} />
      {data && error ? <FormMessage tone="error" message={`Refresh nahi hua: ${error}`} /> : null}
      <FormMessage tone="error" message={startError} />

      {loading && !data ? (
        <View style={styles.gap}>
          <Skeleton height={180} />
          <Skeleton height={150} />
          <Skeleton height={150} />
        </View>
      ) : data ? (
        <>
          <HeroCard
            greeting={getGreeting(now)}
            name={firstName(data.profile?.display_name)}
            goalProgress={goalProgress}
          />

          <TodayWorkoutCard
            title={active ? 'Current Workout' : workoutDone ? "Today's workout ✓ ho gaya" : "Today's Workout"}
            name={active ? active.plan_name : todays?.name ?? 'Workout chunein'}
            minutes={active ? null : todays?.estimated_minutes ?? null}
            buttonLabel={active ? `Continue (${activeDone}/${active.exercises.length})` : todays ? 'Start Workout' : 'Workouts dekhein'}
            loading={!!todays && startingPlanId === todays.id}
            onStart={onTodayWorkout}
          />

          <CardRow>
            <StatCard
              icon="water"
              title="Water"
              color={colors.water}
              soft={colors.waterSoft}
              value={formatWater(waterMl)}
              goal={formatWater(waterGoal)}
              progress={ratio(waterMl, waterGoal)}
              onPress={() => setWaterOpen(true)}
              accessibilityHint="Paani add karne ke liye tap karein"
            />
            <StatCard icon="fire" title="Calories" color={colors.calories} soft={colors.caloriesSoft} comingSoon />
            <StatCard icon="shoe-print" title="Steps" color={colors.steps} soft={colors.accentSoft} comingSoon />
          </CardRow>

          <WeeklyProgressCard
            minutesByDay={weekMinutes}
            todayIndex={weekdayIndexMonday(now)}
            currentWeight={data.latestWeight ? `${data.latestWeight.weight_kg} kg` : null}
            goalWeight={data.profile?.goal_weight_kg != null ? `${data.profile.goal_weight_kg} kg` : null}
            onLogWeight={() => setWeightMode('log')}
            onSetGoal={() => setWeightMode('goal')}
          />

          <SoonBanner
            icon="food-apple"
            title="Nutrition Today"
            body="Meals, calories aur protein/carbs/fat tracking agle update mein aa rahi hai."
          />

          <CardRow>
            <FeatureTile
              icon="dumbbell"
              title="Workouts"
              subtitle="Explore & train"
              color={colors.accent}
              soft={colors.accentSoft}
              onPress={() => router.push('/workout')}
            />
            <FeatureTile
              icon="history"
              title="History"
              subtitle="Past workouts"
              color={colors.purple}
              soft={colors.purpleSoft}
              onPress={() => router.push('/workouts/history')}
            />
            <FeatureTile icon="silverware-fork-knife" title="Nutrition" subtitle="Track your meals" color={colors.calories} soft={colors.caloriesSoft} />
            <FeatureTile icon="robot-happy-outline" title="AI Assistant" subtitle="Ask anything" color={colors.water} soft={colors.waterSoft} />
          </CardRow>

          <SectionHeader title="Quick Actions" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
            <QuickAction icon="dumbbell" label="Log Workout" color={colors.accent} soft={colors.accentSoft} onPress={() => router.push('/workout')} />
            <QuickAction icon="water" label="Log Water" color={colors.water} soft={colors.waterSoft} onPress={() => setWaterOpen(true)} />
            <QuickAction icon="scale-bathroom" label="Add Weight" color={colors.purple} soft={colors.purpleSoft} onPress={() => setWeightMode('log')} />
            <QuickAction icon="book-open-variant" label="Exercises" color={colors.calories} soft={colors.caloriesSoft} onPress={() => router.push('/workouts/exercises')} />
            <QuickAction icon="cog-outline" label="Settings" color={colors.textMuted} soft={colors.surfaceRaised} onPress={() => router.push('/profile')} />
          </ScrollView>
        </>
      ) : null}

      {userId ? (
        <>
          <WaterSheet visible={waterOpen} userId={userId} onClose={() => setWaterOpen(false)} onSaved={reload} />
          <WeightSheet
            mode={weightMode}
            userId={userId}
            initialValue={weightMode === 'goal' ? data?.profile?.goal_weight_kg : data?.latestWeight?.weight_kg}
            onClose={() => setWeightMode(null)}
            onSaved={reload}
          />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  quickRow: { gap: spacing.sm, paddingBottom: spacing.lg },
});
