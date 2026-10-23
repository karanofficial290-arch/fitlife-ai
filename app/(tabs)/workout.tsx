import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { FormMessage } from '@/components/ui/FormMessage';
import { IconBadge, type IconName } from '@/components/ui/IconBadge';
import { Pill } from '@/components/ui/Pill';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Skeleton } from '@/components/ui/Skeleton';
import { cardShadow, colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';
import { useMyProfile } from '@/features/profile/useMyProfile';
import { CurrentWorkoutCard } from '@/features/workouts/components/CurrentWorkoutCard';
import { MuscleGroupPicker } from '@/features/workouts/components/MuscleGroupPicker';
import { PlanCard } from '@/features/workouts/components/PlanCard';
import { isLevel, LEVEL_LABELS, MUSCLE_ICONS, isMuscleGroup, type Level, type MuscleGroup, type PlanLocation } from '@/features/workouts/types';
import { useStartWorkout } from '@/features/workouts/useStartWorkout';
import { setWorkoutLocation, useWorkoutLocation } from '@/features/workouts/useWorkoutLocation';
import { filterPlans, pickTodaysPlan } from '@/features/workouts/workoutLogic';
import { fetchActiveSession, fetchPlans } from '@/features/workouts/workoutService';
import { useFocusLoader } from '@/hooks/useFocusLoader';

const LEVEL_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const LOCATION_OPTIONS = [
  { value: 'gym', label: 'Gym' },
  { value: 'home', label: 'Home' },
] as const;

async function loadWorkoutHub() {
  const [plans, active] = await Promise.all([fetchPlans(), fetchActiveSession()]);
  const error = plans.error ?? active.error;
  if (error) return { data: null, error };
  return { data: { plans: plans.data ?? [], active: active.data ?? null }, error: null };
}

export default function WorkoutScreen() {
  const { profile } = useMyProfile();
  const { data, loading, error, reload } = useFocusLoader(loadWorkoutHub);
  const location = useWorkoutLocation();
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all');
  const [level, setLevel] = useState<Level | 'all'>('all');
  const { start, startingPlanId, error: startError } = useStartWorkout();

  const plans = useMemo(() => data?.plans ?? [], [data]);
  const todays = useMemo(() => pickTodaysPlan(plans, new Date(), location), [plans, location]);
  const filtered = useMemo(() => filterPlans(plans, { muscle, level, location }), [plans, muscle, level, location]);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <AppHeader
        right={
          <>
            <Pressable
              onPress={() => router.push('/workouts/exercises')}
              accessibilityRole="button"
              accessibilityLabel="Exercise library mein search karein"
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name="magnify" size={26} color={colors.text} />
            </Pressable>
            <Avatar name={profile?.display_name} onPress={() => router.push('/profile')} />
          </>
        }
      />

      <ErrorRetry message={data ? null : error} onRetry={reload} />
      <FormMessage tone="error" message={startError} />

      {/* Today's workout hero */}
      {loading && !data ? (
        <View style={styles.hero}>
          <Skeleton width={140} height={24} />
          <Skeleton width="80%" height={32} />
          <Skeleton width="60%" />
        </View>
      ) : todays ? (
        <View style={styles.hero}>
          <View style={styles.heroArt} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
            <MaterialCommunityIcons
              name={isMuscleGroup(todays.muscle_group) ? MUSCLE_ICONS[todays.muscle_group] : 'dumbbell'}
              size={96}
              color={colors.accent}
            />
          </View>
          <View style={styles.kicker}>
            <MaterialCommunityIcons name="dumbbell" size={16} color={colors.accentText} />
            <Text style={styles.kickerText}>TODAY&apos;S WORKOUT</Text>
          </View>
          <Text style={styles.heroTitle} accessibilityRole="header">
            {todays.name}
          </Text>
          <Text style={styles.heroDesc}>{todays.description}</Text>
          <View style={styles.metaRow}>
            <Meta icon="clock-outline" label={`${todays.estimated_minutes} min`} />
            <Meta icon="signal-cellular-2" label={isLevel(todays.level) ? LEVEL_LABELS[todays.level] : todays.level} />
            <Meta icon={todays.location === 'home' ? 'home-outline' : 'map-marker-outline'} label={todays.location === 'home' ? 'Home' : 'Gym'} />
          </View>
          <View style={styles.heroButtons}>
            <View style={styles.flex}>
              <Button title="Start Workout" onPress={() => start(todays.id)} loading={startingPlanId === todays.id} />
            </View>
            <Button
              title="Details"
              variant="secondary"
              onPress={() => router.push({ pathname: '/workouts/plan/[id]', params: { id: todays.id } })}
            />
          </View>
        </View>
      ) : null}

      {data?.active ? <CurrentWorkoutCard session={data.active} /> : null}

      <MuscleGroupPicker value={muscle} onChange={setMuscle} />

      <View style={styles.filters}>
        <SegmentedControl
          options={LEVEL_OPTIONS}
          value={level}
          onChange={setLevel}
          accessibilityLabel="Level filter"
        />
        <SegmentedControl<PlanLocation>
          options={LOCATION_OPTIONS}
          value={location}
          onChange={setWorkoutLocation}
          accessibilityLabel="Gym ya Home"
        />
      </View>

      <SectionHeader title="Recommended Workouts" />
      {loading && !data ? (
        <View style={styles.row}>
          <Skeleton width={190} height={200} />
          <Skeleton width={190} height={200} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            In filters ke saath abhi koi workout nahi hai. Level &quot;All&quot; karke ya doosra muscle group chun ke dekhein.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
          renderItem={({ item }) => <PlanCard plan={item} />}
        />
      )}

      <SectionHeader title="Quick Access" />
      <View style={styles.quickRow}>
        <QuickLink
          icon="book-open-variant"
          title="Exercise Library"
          subtitle="Saari exercises dekhein"
          color={colors.water}
          bg={colors.waterSoft}
          onPress={() => router.push('/workouts/exercises')}
        />
        <QuickLink
          icon="history"
          title="Workout History"
          subtitle="Apni progress dekhein"
          color={colors.purple}
          bg={colors.purpleSoft}
          onPress={() => router.push('/workouts/history')}
        />
      </View>
      <View style={styles.soonRow}>
        <Pill label="Jald aa raha hai" tone="grey" />
        <Text style={styles.soonText}>Custom plans aur AI recommendations</Text>
      </View>
    </Screen>
  );
}

function Meta({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.meta}>
      <MaterialCommunityIcons name={icon} size={18} color={colors.text} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

function QuickLink(props: { icon: IconName; title: string; subtitle: string; color: string; bg: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={`${props.title}. ${props.subtitle}`}
      style={({ pressed }) => [styles.quick, pressed && { opacity: 0.8 }]}
    >
      <IconBadge name={props.icon} color={props.color} background={props.bg} size={40} />
      <View style={styles.flex}>
        <Text style={styles.quickTitle}>{props.title}</Text>
        <Text style={styles.quickSub}>{props.subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  iconButton: { width: MIN_TOUCH_TARGET, height: MIN_TOUCH_TARGET, alignItems: 'center', justifyContent: 'center' },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
    ...cardShadow,
  },
  heroArt: {
    position: 'absolute',
    right: -18,
    top: -10,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  kickerText: { fontSize: 12, fontWeight: '800', color: colors.accentText, letterSpacing: 0.6 },
  heroTitle: { ...typography.title, color: colors.text, maxWidth: '75%' },
  heroDesc: { ...typography.body, color: colors.textMuted, maxWidth: '80%' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginVertical: spacing.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { ...typography.label, color: colors.text },
  heroButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  filters: { gap: spacing.sm },
  row: { gap: spacing.md, flexDirection: 'row', paddingVertical: 4 },
  empty: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  emptyText: { ...typography.body, color: colors.textMuted },
  quickRow: { gap: spacing.sm },
  quick: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 64,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  quickTitle: { ...typography.label, color: colors.text },
  quickSub: { ...typography.caption, color: colors.textMuted },
  soonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  soonText: { ...typography.caption, color: colors.textMuted, flex: 1 },
});
