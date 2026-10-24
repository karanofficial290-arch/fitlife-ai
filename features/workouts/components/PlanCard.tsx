import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PhotoSlot } from '@/components/ui/PhotoSlot';
import { cardShadow, colors, radius, spacing, typography } from '@/constants/theme';
import { musclePhotos, planPhotos } from '@/constants/photos';

import { isLevel, isMuscleGroup, LEVEL_LABELS, MUSCLE_ICONS, type WorkoutPlan } from '../types';

const LEVEL_BADGE: Record<string, string> = {
  beginner: '#047857',
  intermediate: '#1D6FD8',
  advanced: '#6D3FD1',
};

export function PlanCard({ plan }: { plan: WorkoutPlan }) {
  const muscle = isMuscleGroup(plan.muscle_group) ? plan.muscle_group : null;
  const icon = muscle ? MUSCLE_ICONS[muscle] : 'dumbbell';
  const photo = planPhotos[plan.slug] ?? (muscle ? musclePhotos[muscle] : null);
  const levelLabel = isLevel(plan.level) ? LEVEL_LABELS[plan.level] : plan.level;
  const isHome = plan.location === 'home';

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/workouts/plan/[id]', params: { id: plan.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${plan.name}, ${levelLabel}, ${plan.exercise_count} exercises, ${plan.estimated_minutes} minute, ${isHome ? 'Home' : 'Gym'}`}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <PhotoSlot source={photo} placeholderIcon={icon} style={styles.photo}>
        <View style={[styles.badge, { backgroundColor: LEVEL_BADGE[plan.level] ?? colors.textMuted }]}>
          <Text style={styles.badgeText}>{levelLabel.toUpperCase()}</Text>
        </View>
      </PhotoSlot>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {plan.name}
        </Text>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="dumbbell" size={15} color={colors.textMuted} />
          <Text style={styles.meta}>
            {plan.exercise_count} Exercises • {plan.estimated_minutes} min
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name={isHome ? 'home-outline' : 'weight-lifter'} size={16} color={colors.textMuted} />
            <Text style={styles.meta}>{isHome ? 'Home' : 'Gym'}</Text>
          </View>
          <View style={styles.chevron}>
            <MaterialCommunityIcons name="chevron-right" size={18} color={colors.text} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 196,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...cardShadow,
  },
  photo: { height: 120 },
  badge: { position: 'absolute', top: spacing.sm, left: spacing.sm, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  body: { padding: spacing.md, gap: 6 },
  name: { fontSize: 17, fontWeight: '800', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { ...typography.caption, color: colors.textMuted },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  chevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
