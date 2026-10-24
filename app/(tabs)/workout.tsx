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
import { PhotoSlot } from '@/components/ui/PhotoSlot';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Skeleton } from '@/components/ui/Skeleton';
import { photos } from '@/constants/photos';
import { cardShadow, colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';
import { useMyProfile } from '@/features/profile/useMyProfile';
import { CurrentWorkoutCard } from '@/features/workouts/components/CurrentWorkoutCard';
import { MuscleGroupPicker } from '@/features/workouts/components/MuscleGroupPicker';
import { PlanCard } from '@/features/workouts/components/PlanCard';
import { isLevel, LEVEL_LABELS, type Level, type MuscleGroup, type PlanLocation } from '@/features/workouts/types';
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
              accessibilityLabel="Exercise search"
              style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
            >
              <MaterialCommunityIcons name="magnify" size={28} color={colors.text} />
            </Pressable>
            <Avatar name={profile?.display_name} onPress={() => router.push('/profile')} />
          </>
        }
      />

      <ErrorRetry message={data ? null : error} onRetry={reload} />
      <FormMessage tone="error" message={startError} />

      {loading && !data ? (
        <Skeleton height={230} />
      ) : todays ? (
        <PhotoSlot source={photos.workoutHero} placeholderIcon="weight-lifter" iconAlign="right" fadeLeft style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={styles.kicker}>
              <MaterialCommunityIcons name="dumbbell" size={16} color={colors.accentText} />
              <Text style={styles.kickerText}>TODAY&apos;S WORKOUT</Text>
            </View>
            <Text style={styles.heroTitle} accessibilityRole="header" numberOfLines={2}>
              {todays.name}
            </Text>
            <Text style={styles.heroDesc} numberOfLines={2}>
              {todays.description}
            </Text>
            <View style={styles.metaRow}>
              <Meta icon="clock-outline" label={`${todays.estimated_minutes} min`} />
              <Meta icon="signal-cellular-2" label={isLevel(todays.level) ? LEVEL_LABELS[todays.level] : todays.level} />
              <Meta icon="map-marker-outline" label={todays.location === 'home' ? 'Home' : 'Gym'} />
            </View>
            <View style={styles.heroButtons}>
              <Button
                title="START WORKOUT"
                icon="play"
                chevron
                size="compact"
                onPress={() => start(todays.id)}
                loading={startingPlanId === todays.id}
              />
              <Pressable
                onPress={() => router.push({ pathname: '/workouts/plan/[id]', params: { id: todays.id } })}
                accessibilityRole="button"
                accessibilityLabel={`${todays.name} details`}
                style={styles.detailsLink}
              >
                <Text style={styles.detailsText}>Details</Text>
              </Pressable>
            </View>
          </View>
        </PhotoSlot>
      ) : null}

      <MuscleGroupPicker value={muscle} onChange={setMuscle} />

      <SegmentedControl options={LEVEL_OPTIONS} value={level} onChange={setLevel} accessibilityLabel="Level filter" />
      <View style={styles.locationRow}>
        <Text style={styles.locationLabel}>Kahan workout karenge?</Text>
        <SegmentedControl<PlanLocation> options={LOCATION_OPTIONS} value={location} onChange={setWorkoutLocation} accessibilityLabel="Gym ya Home" />
      </View>

      <SectionHeader title="Recommended Workouts" />
      {loading && !data ? (
        <View style={styles.row}>
          <Skeleton width={196} height={230} />
          <Skeleton width={196} height={230} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            In filters ke saath koi workout nahi mila. Level &quot;All&quot; karein ya doosra muscle group chunein.
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

      {data?.active ? <CurrentWorkoutCard session={data.active} /> : null}

      <SectionHeader title="Quick Access" />
      <View style={styles.quickRow}>
        <QuickTile
          icon="book-open-variant"
          title="Exercise Library"
          subtitle={`Saari exercises`}
          color="#1D6FD8"
          bg={colors.waterSoft}
          onPress={() => router.push('/workouts/exercises')}
        />
        <QuickTile
          icon="history"
          title="Workout History"
          subtitle="Track your progress"
          color={colors.purple}
          bg={colors.purpleSoft}
          onPress={() => router.push('/workouts/history')}
        />
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

function QuickTile(props: { icon: IconName; title: string; subtitle: string; color: string; bg: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={`${props.title}. ${props.subtitle}`}
      style={({ pressed }) => [styles.quick, { backgroundColor: props.bg }, pressed && { opacity: 0.8 }]}
    >
      <IconBadge name={props.icon} color={props.color} background={colors.surface} size={44} />
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
  hero: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...cardShadow },
  heroContent: { padding: spacing.lg, gap: spacing.sm, maxWidth: '74%' },
  kicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  kickerText: { fontSize: 12, fontWeight: '900', color: colors.accentText, letterSpacing: 0.8 },
  heroTitle: { fontSize: 30, lineHeight: 35, fontWeight: '900', color: colors.text },
  heroDesc: { fontSize: 15, lineHeight: 21, color: colors.textMuted },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginVertical: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { ...typography.label, color: colors.text },
  heroButtons: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs, flexWrap: 'wrap' },
  detailsLink: { minHeight: MIN_TOUCH_TARGET, justifyContent: 'center', paddingHorizontal: spacing.xs },
  detailsText: { ...typography.label, color: colors.accentText, textDecorationLine: 'underline' },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  locationLabel: { ...typography.label, color: colors.textMuted, flexShrink: 1 },
  row: { gap: spacing.md, flexDirection: 'row', paddingVertical: 4, paddingRight: spacing.lg },
  empty: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  emptyText: { ...typography.body, color: colors.textMuted },
  quickRow: { gap: spacing.sm, paddingBottom: spacing.xl },
  quick: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 68,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  quickTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  quickSub: { ...typography.caption, color: colors.textMuted },
});
