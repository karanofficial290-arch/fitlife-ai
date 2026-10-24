import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { FormMessage } from '@/components/ui/FormMessage';
import { IconBadge } from '@/components/ui/IconBadge';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { coachTips } from '@/features/coach/coachLogic';
import { loadHomeData } from '@/features/home/homeData';
import { useStartWorkout } from '@/features/workouts/useStartWorkout';
import { useWorkoutLocation } from '@/features/workouts/useWorkoutLocation';
import { completedToday, pickTodaysPlan } from '@/features/workouts/workoutLogic';
import { useFocusLoader } from '@/hooks/useFocusLoader';

export default function CoachScreen() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const load = useCallback(() => loadHomeData(userId, new Date()), [userId]);
  const { data, loading, error, reload } = useFocusLoader(load);
  const location = useWorkoutLocation();
  const { start, startingPlanId, error: startError } = useStartWorkout();

  const plan = useMemo(() => (data ? pickTodaysPlan(data.plans, new Date(), location) : null), [data, location]);
  const tips = useMemo(() => {
    if (!data) return [];
    const now = new Date();
    return coachTips({
      hour: now.getHours(),
      waterMl: data.waterTodayMl,
      waterGoalMl: data.profile?.water_goal_ml ?? 3000,
      calories: data.nutrition.calories,
      calorieGoal: data.profile?.calorie_goal ?? 2200,
      proteinG: data.nutrition.protein_g,
      workoutDoneToday: completedToday(data.weekSessions, now),
      workoutsThisWeek: data.weekSessions.filter((s) => s.status === 'completed').length,
      hasActiveWorkout: !!data.active,
    });
  }, [data]);

  return (
    <Screen>
      <ScreenHeader title="FITMXO Coach" />
      <ErrorRetry message={data ? null : error} onRetry={reload} />
      <FormMessage tone="error" message={startError} />

      {loading && !data ? (
        <View style={styles.gap}>
          <Skeleton height={90} />
          <Skeleton height={90} />
          <Skeleton height={90} />
        </View>
      ) : data ? (
        <>
          {tips.map((t) => (
            <Card key={t.id}>
              <View style={styles.row}>
                <IconBadge name={t.icon} color={colors.accent} background={colors.accentSoft} size={44} />
                <View style={styles.flex}>
                  <Text style={styles.title}>{t.title}</Text>
                  <Text style={styles.body}>{t.body}</Text>
                </View>
              </View>
            </Card>
          ))}

          {data.active ? (
            <Button
              title="Continue Workout"
              icon="play"
              chevron
              onPress={() => router.push({ pathname: '/workouts/session/[id]', params: { id: data.active!.id } })}
            />
          ) : plan ? (
            <Card title="Aaj ke liye suggested">
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.body}>
                {plan.exercise_count} exercises • {plan.estimated_minutes} min • {plan.location === 'home' ? 'Home' : 'Gym'}
              </Text>
              <Button title="Start Workout" icon="play" chevron onPress={() => start(plan.id)} loading={startingPlanId === plan.id} />
            </Card>
          ) : null}

          <View style={styles.note}>
            <MaterialCommunityIcons name="information-outline" size={20} color={colors.textMuted} />
            <Text style={[styles.caption, styles.flex]}>
              Ye salah aapke logged data par based general fitness tips hain, medical advice nahi. Dard, chakkar ya koi
              health problem ho toh doctor se milein.
            </Text>
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  title: { ...typography.subheading, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
  planName: { ...typography.heading, color: colors.text },
  caption: { ...typography.caption, color: colors.textMuted },
  note: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', paddingBottom: spacing.lg },
});
