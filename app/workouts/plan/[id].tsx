import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { FormMessage } from '@/components/ui/FormMessage';
import { levelTone, Pill } from '@/components/ui/Pill';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, spacing, typography } from '@/constants/theme';
import { isLevel, isMuscleGroup, LEVEL_LABELS, MUSCLE_LABELS } from '@/features/workouts/types';
import { useStartWorkout } from '@/features/workouts/useStartWorkout';
import { formatPrescription } from '@/features/workouts/workoutLogic';
import { fetchPlanDetail, type PlanExercise } from '@/features/workouts/workoutService';
import { useFocusLoader } from '@/hooks/useFocusLoader';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const load = useCallback(() => fetchPlanDetail(String(id)), [id]);
  const { data: plan, loading, error, reload } = useFocusLoader(load);
  const { start, startingPlanId, error: startError } = useStartWorkout();

  return (
    <Screen>
      <ScreenHeader title={plan?.name ?? 'Workout'} />
      <ErrorRetry message={plan ? null : error} onRetry={reload} />

      {loading && !plan ? (
        <View style={styles.gap}>
          <Skeleton height={28} width="70%" />
          <Skeleton height={60} />
          <Skeleton height={120} />
        </View>
      ) : plan ? (
        <>
          <View style={styles.pills}>
            <Pill label={isLevel(plan.level) ? LEVEL_LABELS[plan.level] : plan.level} tone={levelTone(plan.level)} />
            <Pill label={plan.location === 'home' ? 'Home' : 'Gym'} tone="grey" />
            <Pill label={isMuscleGroup(plan.muscle_group) ? MUSCLE_LABELS[plan.muscle_group] : plan.muscle_group} tone="grey" />
          </View>
          <Text style={styles.desc}>{plan.description}</Text>
          <Text style={styles.meta}>
            {plan.exercises.length} exercises • lagbhag {plan.estimated_minutes} min
          </Text>

          <Card title="Exercises">
            {plan.exercises.map((item) => (
              <ExerciseRow key={item.id} item={item} />
            ))}
          </Card>

          <Text style={styles.safety}>
            Dard ya chakkar mehsoos ho toh turant ruk jaayein. Koi injury ya medical condition ho toh pehle doctor se salah lein.
          </Text>

          <FormMessage tone="error" message={startError} />
          <Button title="Start Workout" onPress={() => start(plan.id)} loading={startingPlanId === plan.id} />
        </>
      ) : null}
    </Screen>
  );
}

function ExerciseRow({ item }: { item: PlanExercise }) {
  const [open, setOpen] = useState(false);
  const name = item.exercise?.name ?? 'Exercise';
  return (
    <Pressable
      onPress={() => setOpen((v) => !v)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityLabel={`${item.position}. ${name}, ${formatPrescription(item.sets, item.reps, item.duration_seconds)}, rest ${item.rest_seconds} seconds`}
      accessibilityHint="Tarika dekhne ke liye tap karein"
      style={styles.row}
    >
      <View style={styles.rowTop}>
        <View style={styles.num}>
          <Text style={styles.numText}>{item.position}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>
            {formatPrescription(item.sets, item.reps, item.duration_seconds)} • rest {item.rest_seconds}s
          </Text>
        </View>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={22} color={colors.textMuted} />
      </View>
      {open && item.exercise ? <Text style={styles.instructions}>{item.exercise.instructions}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.md },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  desc: { ...typography.body, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
  row: { paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 },
  num: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: { ...typography.label, color: colors.accentText },
  name: { ...typography.label, color: colors.text, fontSize: 16 },
  instructions: { ...typography.body, color: colors.textMuted, paddingLeft: 44 },
  safety: { ...typography.caption, color: colors.textMuted },
});
