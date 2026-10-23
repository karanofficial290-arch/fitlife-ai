import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { levelTone, Pill } from '@/components/ui/Pill';
import { cardShadow, colors, radius, spacing, typography } from '@/constants/theme';

import { isLevel, isMuscleGroup, LEVEL_LABELS, MUSCLE_ICONS, type WorkoutPlan } from '../types';

export function PlanCard({ plan }: { plan: WorkoutPlan }) {
  const icon = isMuscleGroup(plan.muscle_group) ? MUSCLE_ICONS[plan.muscle_group] : 'dumbbell';
  const levelLabel = isLevel(plan.level) ? LEVEL_LABELS[plan.level] : plan.level;
  const isHome = plan.location === 'home';

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/workouts/plan/[id]', params: { id: plan.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${plan.name}, ${levelLabel}, ${plan.exercise_count} exercises, ${plan.estimated_minutes} minute, ${isHome ? 'Home' : 'Gym'}`}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.art}>
        <MaterialCommunityIcons name={icon} size={56} color={colors.accent} />
        <View style={styles.pill}>
          <Pill label={levelLabel} tone={levelTone(plan.level)} />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {plan.name}
        </Text>
        <Text style={styles.meta}>
          {plan.exercise_count} Exercises • {plan.estimated_minutes} min
        </Text>
        <View style={styles.footer}>
          <View style={styles.location}>
            <MaterialCommunityIcons name={isHome ? 'home-outline' : 'dumbbell'} size={16} color={colors.textMuted} />
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
    width: 190,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...cardShadow,
  },
  art: { height: 104, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  pill: { position: 'absolute', top: spacing.sm, left: spacing.sm },
  body: { padding: spacing.md, gap: 4 },
  name: { ...typography.subheading, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
