import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { cardShadow, colors, radius, spacing, typography } from '@/constants/theme';
import { ratio } from '@/utils/progress';

import { nextExerciseIndex } from '../workoutLogic';
import type { SessionDetail } from '../workoutService';

const MAX_LISTED = 4;

export function CurrentWorkoutCard({ session }: { session: SessionDetail }) {
  const total = session.exercises.length;
  const done = session.exercises.filter((e) => e.completed_at).length;
  const nextIdx = nextExerciseIndex(session.exercises);
  // Show a window of exercises around the current one.
  const startIdx = Math.max(0, Math.min((nextIdx === -1 ? total : nextIdx) - 1, total - MAX_LISTED));
  const listed = session.exercises.slice(startIdx, startIdx + MAX_LISTED);

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="dumbbell" size={20} color={colors.accent} />
        <Text style={styles.kicker} accessibilityRole="header">
          Current Workout
        </Text>
      </View>

      <View style={styles.main}>
        <ProgressRing
          progress={ratio(done, total)}
          size={92}
          accessibilityLabel={`${done} of ${total} exercises done`}
        >
          <Text style={styles.ringValue}>
            {done}/{total}
          </Text>
          <Text style={styles.ringLabel}>exercises</Text>
        </ProgressRing>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {session.plan_name}
          </Text>
          <Button
            title="Continue"
            icon="play"
            chevron
            size="compact"
            onPress={() => router.push({ pathname: '/workouts/session/[id]', params: { id: session.id } })}
          />
        </View>
      </View>

      <View style={styles.list}>
        {listed.map((e) => {
          const isDone = !!e.completed_at;
          const isCurrent = session.exercises[nextIdx]?.id === e.id;
          return (
            <View key={e.id} style={styles.item} accessible accessibilityLabel={`${e.position}. ${e.exercise?.name ?? 'Exercise'}${isDone ? ', done' : isCurrent ? ', current' : ''}`}>
              <MaterialCommunityIcons
                name={isDone ? 'check-circle' : isCurrent ? 'record-circle-outline' : 'circle-outline'}
                size={22}
                color={isDone || isCurrent ? colors.accent : colors.border}
              />
              <Text style={[styles.itemText, isCurrent && styles.itemCurrent, isDone && styles.itemDone]} numberOfLines={1}>
                {e.position}. {e.exercise?.name ?? 'Exercise'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...cardShadow,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  kicker: { ...typography.label, color: colors.text },
  main: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  info: { flex: 1, gap: spacing.sm },
  name: { ...typography.heading, color: colors.text },
  ringValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  ringLabel: { ...typography.caption, color: colors.textMuted },
  list: { gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  itemText: { ...typography.body, color: colors.textMuted, flex: 1 },
  itemCurrent: { color: colors.text, fontWeight: '700' },
  itemDone: { color: colors.textMuted },
});
