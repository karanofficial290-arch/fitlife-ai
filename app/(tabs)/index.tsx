import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Avatar } from '@/components/ui/Avatar';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { FormMessage } from '@/components/ui/FormMessage';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { photos } from '@/constants/photos';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import {
  HeroBanner,
  NutritionCard,
  QuickAction,
  RingStat,
  ShortcutTile,
  TodayWorkoutCard,
  WeeklyProgressCard,
} from '@/features/home/HomeCards';
import { loadHomeData } from '@/features/home/homeData';
import { MealSheet } from '@/features/nutrition/components/MealSheet';
import { formatNumber } from '@/features/nutrition/nutritionLogic';
import { WaterSheet } from '@/features/tracking/components/WaterSheet';
import { WeightSheet, type WeightSheetMode } from '@/features/tracking/components/WeightSheet';
import { useStartWorkout } from '@/features/workouts/useStartWorkout';
import { useWorkoutLocation } from '@/features/workouts/useWorkoutLocation';
import { completedToday, pickTodaysPlan, weeklyWorkoutMinutes } from '@/features/workouts/workoutLogic';
import { useFocusLoader } from '@/hooks/useFocusLoader';
import { weekdayIndexMonday } from '@/utils/dates';
import { getGreeting } from '@/utils/greeting';
import { ratio } from '@/utils/progress';
import { firstName } from '@/utils/text';

type Sheet = 'water' | 'meal' | 'steps' | null;

function formatLitres(ml: number): string {
  return `${Math.round((ml / 1000) * 10) / 10} L`;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const load = useCallback(() => loadHomeData(userId, new Date()), [userId]);
  const { data, loading, error, reload } = useFocusLoader(load);
  const location = useWorkoutLocation();
  const { start, startingPlanId, error: startError } = useStartWorkout();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [weightMode, setWeightMode] = useState<WeightSheetMode | null>(null);

  const now = new Date();
  const todays = useMemo(() => (data ? pickTodaysPlan(data.plans, new Date(), location) : null), [data, location]);
  const weekMinutes = useMemo(() => weeklyWorkoutMinutes(data?.weekSessions ?? [], new Date()), [data]);

  const waterGoal = data?.profile?.water_goal_ml ?? 3000;
  const calorieGoal = data?.profile?.calorie_goal ?? 2200;
  const stepGoal = data?.profile?.step_goal ?? 10000;
  const waterMl = data?.waterTodayMl ?? 0;
  const calories = data?.nutrition.calories ?? 0;
  const workoutDone = data ? completedToday(data.weekSessions, now) : false;
  // Daily goals tracked today: water, calories logged, one workout.
  const goalProgress = (ratio(waterMl, waterGoal) + ratio(calories, calorieGoal) + (workoutDone ? 1 : 0)) / 3;

  const active = data?.active ?? null;
  const activeDone = active ? active.exercises.filter((e) => e.completed_at).length : 0;

  function onTodayWorkout() {
    if (active) router.push({ pathname: '/workouts/session/[id]', params: { id: active.id } });
    else if (todays) void start(todays.id);
    else router.push('/workout');
  }

  return (
    <Screen edges={['top', 'left', 'right']}>
      <AppHeader right={<Avatar name={data?.profile?.display_name} onPress={() => router.push('/profile')} />} />

      <ErrorRetry message={data ? null : error} onRetry={reload} />
      {data && error ? <FormMessage tone="error" message={`Refresh nahi hua: ${error}`} /> : null}
      <FormMessage tone="error" message={startError} />

      {loading && !data ? (
        <View style={styles.gap}>
          <Skeleton height={210} />
          <Skeleton height={150} />
          <Skeleton height={150} />
        </View>
      ) : data ? (
        <>
          <HeroBanner greeting={getGreeting(now)} name={firstName(data.profile?.display_name)} goalProgress={goalProgress} photo={photos.homeHero} />

          <TodayWorkoutCard
            title={active ? 'Current Workout' : workoutDone ? "Today's Workout ✓" : "Today's Workout"}
            name={active ? active.plan_name : todays?.name ?? 'Workout chunein'}
            minutes={active ? null : todays?.estimated_minutes ?? null}
            buttonLabel={active ? `Continue ${activeDone}/${active.exercises.length}` : todays ? 'Start Workout' : 'Workouts dekhein'}
            loading={!!todays && startingPlanId === todays.id}
            onStart={onTodayWorkout}
          />

          <View style={styles.statRow}>
            <RingStat
              icon="fire"
              title="Calories"
              color="#F59E0B"
              soft={colors.caloriesSoft}
              value={formatNumber(calories)}
              goal={formatNumber(calorieGoal)}
              progress={ratio(calories, calorieGoal)}
              onPress={() => setSheet('meal')}
              accessibilityHint="Meal log karne ke liye tap karein"
            />
            <RingStat
              icon="water"
              title="Water"
              color="#1E88E5"
              soft={colors.waterSoft}
              value={formatLitres(waterMl)}
              goal={formatLitres(waterGoal)}
              progress={ratio(waterMl, waterGoal)}
              onPress={() => setSheet('water')}
              accessibilityHint="Paani add karne ke liye tap karein"
            />
            <RingStat
              icon="shoe-print"
              title="Steps"
              color={colors.accent}
              soft={colors.accentSoft}
              value="—"
              goal={formatNumber(stepGoal)}
              progress={0}
              onPress={() => setSheet('steps')}
              accessibilityHint="Steps tracking ke baare mein jaanein"
            />
          </View>

          <NutritionCard summary={data.nutrition} calorieGoal={calorieGoal} onDetails={() => router.push('/diet')} onLog={() => setSheet('meal')} />

          <WeeklyProgressCard
            minutesByDay={weekMinutes}
            todayIndex={weekdayIndexMonday(now)}
            currentWeight={data.latestWeight ? `${data.latestWeight.weight_kg} kg` : null}
            goalWeight={data.profile?.goal_weight_kg != null ? `${data.profile.goal_weight_kg} kg` : null}
            onViewAll={() => router.push('/progress')}
            onLogWeight={() => setWeightMode('log')}
            onSetGoal={() => setWeightMode('goal')}
          />

          <View style={styles.grid}>
            <ShortcutTile icon="dumbbell" title="Workouts" subtitle="Explore & train" color={colors.accent} soft={colors.accentSoft} photo={photos.shortcutWorkout} onPress={() => router.push('/workout')} />
            <ShortcutTile icon="silverware-fork-knife" title="Diet" subtitle="Track your meals" color="#F59E0B" soft={colors.caloriesSoft} photo={photos.shortcutDiet} onPress={() => router.push('/diet')} />
            <ShortcutTile icon="chart-line" title="Progress" subtitle="View charts" color="#1E88E5" soft={colors.waterSoft} photo={photos.shortcutProgress} onPress={() => router.push('/progress')} />
            <ShortcutTile icon="robot-happy-outline" title="AI Coach" subtitle="Daily guidance" color={colors.purple} soft={colors.purpleSoft} photo={photos.shortcutCoach} onPress={() => router.push('/coach')} />
          </View>

          <SectionHeader title="Quick Actions" />
          <View style={styles.quickRow}>
            <QuickAction icon="dumbbell" label="Log Workout" color={colors.accent} soft={colors.accentSoft} onPress={() => router.push('/workout')} />
            <QuickAction icon="silverware-fork-knife" label="Log Meal" color="#F59E0B" soft={colors.caloriesSoft} onPress={() => setSheet('meal')} />
            <QuickAction icon="water" label="Log Water" color="#1E88E5" soft={colors.waterSoft} onPress={() => setSheet('water')} />
            <QuickAction icon="scale-bathroom" label="Add Weight" color={colors.purple} soft={colors.purpleSoft} onPress={() => setWeightMode('log')} />
          </View>
        </>
      ) : null}

      {userId ? (
        <>
          <WaterSheet visible={sheet === 'water'} userId={userId} onClose={() => setSheet(null)} onSaved={reload} />
          <MealSheet visible={sheet === 'meal'} userId={userId} onClose={() => setSheet(null)} onSaved={reload} />
          <WeightSheet
            mode={weightMode}
            userId={userId}
            initialValue={weightMode === 'goal' ? data?.profile?.goal_weight_kg : data?.latestWeight?.weight_kg}
            onClose={() => setWeightMode(null)}
            onSaved={reload}
          />
          <BottomSheet visible={sheet === 'steps'} title="Steps tracking" onClose={() => setSheet(null)}>
            <View style={styles.stepsInfo}>
              <MaterialCommunityIcons name="shoe-print" size={40} color={colors.accent} />
              <Text style={styles.body}>
                Android par poore din ke steps phone ki Health Connect app se aate hain. FITMXO ko Health Connect se
                jodne ka kaam Progress screen ke saath ho raha hai. Tab tak yahan steps nahi gine ja rahe — isliye koi
                number nahi dikhaya.
              </Text>
            </View>
            <Button title="Theek hai" onPress={() => setSheet(null)} />
          </BottomSheet>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickRow: { flexDirection: 'row', gap: spacing.sm, paddingBottom: spacing.xl },
  stepsInfo: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  body: { ...typography.body, color: colors.text, flex: 1 },
});
