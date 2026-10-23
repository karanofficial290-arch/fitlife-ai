import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { FormMessage } from '@/components/ui/FormMessage';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { formatPrescription, nextExerciseIndex } from '@/features/workouts/workoutLogic';
import {
  completeSessionExercise,
  endSession,
  fetchSession,
  type SessionDetail,
} from '@/features/workouts/workoutService';
import { useFocusLoader } from '@/hooks/useFocusLoader';
import { useCountdown, useNow } from '@/hooks/useTimers';
import { formatClock } from '@/utils/dates';
import { ratio } from '@/utils/progress';

export default function WorkoutSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const load = useCallback(() => fetchSession(String(id)), [id]);
  const { data: session, loading, error, reload } = useFocusLoader(load);

  if (!session) {
    return (
      <Screen>
        <ScreenHeader title="Workout" />
        {loading ? (
          <View style={styles.gap}>
            <Skeleton height={120} />
            <Skeleton height={200} />
          </View>
        ) : (
          <ErrorRetry message={error ?? 'Workout load nahi hua.'} onRetry={reload} />
        )}
      </Screen>
    );
  }

  if (session.status !== 'in_progress') return <SessionSummaryView session={session} />;
  return <ActiveSession session={session} onChanged={reload} />;
}

function ActiveSession({ session, onChanged }: { session: SessionDetail; onChanged: () => Promise<void> }) {
  const now = useNow(1000);
  const [setsDone, setSetsDone] = useState(0);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const rest = useCountdown();
  const work = useCountdown();

  const total = session.exercises.length;
  const done = session.exercises.filter((e) => e.completed_at).length;
  const currentIdx = nextExerciseIndex(session.exercises);
  const current = currentIdx >= 0 ? session.exercises[currentIdx] : undefined;
  const elapsed = (now.getTime() - new Date(session.started_at).getTime()) / 1000;

  // New exercise → reset set counter and timers. If the previous exercise
  // just finished, start its rest here so the reset can't cancel it.
  const pendingRest = useRef(0);
  const currentId = current?.id;
  const { start: startRest, stop: stopRest } = rest;
  const stopWork = work.stop;
  useEffect(() => {
    setSetsDone(0);
    stopWork();
    if (pendingRest.current > 0) {
      startRest(pendingRest.current);
      pendingRest.current = 0;
    } else {
      stopRest();
    }
  }, [currentId, startRest, stopRest, stopWork]);

  async function finishSet() {
    if (!current) return;
    const nextCount = setsDone + 1;
    if (nextCount < current.sets) {
      setSetsDone(nextCount);
      if (current.rest_seconds > 0) rest.start(current.rest_seconds);
      return;
    }
    // Last set: persist the exercise as completed.
    setSaving(true);
    setActionError(null);
    const result = await completeSessionExercise(current.id);
    if (result.error) {
      setActionError(result.error);
      setSaving(false);
      return;
    }
    const isLast = currentIdx === total - 1;
    pendingRest.current = isLast ? 0 : current.rest_seconds;
    await onChanged();
    setSaving(false);
  }

  async function finish(status: 'completed' | 'abandoned') {
    setSaving(true);
    setActionError(null);
    const result = await endSession(session.id, status);
    if (result.error) {
      setActionError(result.error);
      setSaving(false);
      return;
    }
    await onChanged();
    setSaving(false);
  }

  function confirmEnd() {
    const allDone = currentIdx === -1;
    if (allDone) {
      void finish('completed');
      return;
    }
    Alert.alert(
      'Workout khatam karein?',
      done > 0
        ? `${done}/${total} exercises ho chuki hain. Jitna kiya hai wo save ho jayega.`
        : 'Abhi tak koi exercise complete nahi hui. Ye workout save nahi hoga.',
      [
        { text: 'Jaari rakhein', style: 'cancel' },
        {
          text: 'Khatam karein',
          style: 'destructive',
          onPress: () => void finish(done > 0 ? 'completed' : 'abandoned'),
        },
      ],
    );
  }

  return (
    <Screen>
      <ScreenHeader title={session.plan_name} />

      <View style={styles.statusRow}>
        <ProgressRing progress={ratio(done, total)} size={84} accessibilityLabel={`${done} of ${total} exercises done`}>
          <Text style={styles.ringValue}>
            {done}/{total}
          </Text>
        </ProgressRing>
        <View style={styles.flex}>
          <Text style={styles.caption}>Total time</Text>
          <Text style={styles.clock} accessibilityLabel={`Total time ${formatClock(elapsed)}`}>
            {formatClock(elapsed)}
          </Text>
        </View>
      </View>

      <FormMessage tone="error" message={actionError} />

      {rest.running ? (
        <View style={styles.rest} accessibilityLiveRegion="polite">
          <Text style={styles.restLabel}>Rest</Text>
          <Text style={styles.restClock}>{formatClock(rest.remaining)}</Text>
          <Button title="Rest skip karein" variant="secondary" onPress={rest.stop} />
        </View>
      ) : null}

      {current ? (
        <Card>
          <Text style={styles.caption}>
            Exercise {currentIdx + 1} of {total}
          </Text>
          <Text style={styles.exerciseName} accessibilityRole="header">
            {current.exercise?.name ?? 'Exercise'}
          </Text>
          <Text style={styles.prescription}>
            {formatPrescription(current.sets, current.reps, current.duration_seconds)} • rest {current.rest_seconds}s
          </Text>
          <View style={styles.setDots} accessible accessibilityLabel={`Set ${Math.min(setsDone + 1, current.sets)} of ${current.sets}`}>
            {Array.from({ length: current.sets }, (_, i) => (
              <View key={i} style={[styles.dot, i < setsDone && styles.dotDone, i === setsDone && styles.dotCurrent]} />
            ))}
          </View>
          {current.exercise ? <Text style={styles.instructions}>{current.exercise.instructions}</Text> : null}

          {current.duration_seconds != null ? (
            work.running ? (
              <View style={styles.workTimer}>
                <Text style={styles.restClock}>{formatClock(work.remaining)}</Text>
                <Button title="Timer roken" variant="secondary" onPress={work.stop} />
              </View>
            ) : (
              <Button
                title={`${current.duration_seconds}s timer shuru karein`}
                variant="secondary"
                onPress={() => work.start(current.duration_seconds ?? 0)}
                disabled={rest.running}
              />
            )
          ) : null}

          <Button
            title={setsDone + 1 >= current.sets ? 'Exercise complete' : `Set ${setsDone + 1} done`}
            onPress={finishSet}
            loading={saving}
            disabled={rest.running}
          />
        </Card>
      ) : (
        <Card>
          <View style={styles.center}>
            <MaterialCommunityIcons name="trophy" size={48} color={colors.accent} />
            <Text style={styles.exerciseName}>Saari exercises ho gayi!</Text>
            <Text style={styles.caption}>Workout save karne ke liye neeche tap karein.</Text>
          </View>
        </Card>
      )}

      <Card title="Exercises">
        {session.exercises.map((e, i) => (
          <View key={e.id} style={styles.listItem}>
            <MaterialCommunityIcons
              name={e.completed_at ? 'check-circle' : i === currentIdx ? 'record-circle-outline' : 'circle-outline'}
              size={22}
              color={e.completed_at || i === currentIdx ? colors.accent : colors.border}
            />
            <Text style={[styles.listText, i === currentIdx && styles.listCurrent]} numberOfLines={1}>
              {e.position}. {e.exercise?.name ?? 'Exercise'}
            </Text>
          </View>
        ))}
      </Card>

      <Button
        title={currentIdx === -1 ? 'Workout finish karein' : 'Workout khatam karein'}
        variant={currentIdx === -1 ? 'primary' : 'danger'}
        onPress={confirmEnd}
        loading={saving && currentIdx === -1}
      />
    </Screen>
  );
}

function SessionSummaryView({ session }: { session: SessionDetail }) {
  const done = session.exercises.filter((e) => e.completed_at).length;
  const minutes = session.ended_at
    ? Math.max(1, Math.round((new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / 60000))
    : null;
  const completed = session.status === 'completed';

  return (
    <Screen>
      <ScreenHeader title={session.plan_name} onBack={() => router.replace('/workout')} />
      <View style={styles.center}>
        <MaterialCommunityIcons
          name={completed ? 'trophy' : 'close-circle-outline'}
          size={64}
          color={completed ? colors.accent : colors.textMuted}
        />
        <Text style={styles.exerciseName} accessibilityRole="header">
          {completed ? 'Shabaash! Workout complete' : 'Workout band kiya gaya'}
        </Text>
        <Text style={styles.prescription}>
          {done}/{session.exercises.length} exercises{minutes ? ` • ${minutes} min` : ''}
        </Text>
      </View>
      <Button title="Workout tab par jaayein" onPress={() => router.replace('/workout')} />
      <Button title="Home" variant="secondary" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.md },
  center: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  ringValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  caption: { ...typography.caption, color: colors.textMuted },
  clock: { fontSize: 34, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
  rest: {
    backgroundColor: colors.waterSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  restLabel: { ...typography.label, color: colors.water },
  restClock: { fontSize: 44, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
  workTimer: { alignItems: 'center', gap: spacing.sm },
  exerciseName: { ...typography.title, color: colors.text, textAlign: 'center' },
  prescription: { ...typography.subheading, color: colors.accentText, textAlign: 'center' },
  setDots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginVertical: spacing.xs },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.border },
  dotDone: { backgroundColor: colors.accent },
  dotCurrent: { backgroundColor: colors.accentSoft, borderWidth: 2, borderColor: colors.accent },
  instructions: { ...typography.body, color: colors.textMuted },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 32 },
  listText: { ...typography.body, color: colors.textMuted, flex: 1 },
  listCurrent: { color: colors.text, fontWeight: '700' },
});
