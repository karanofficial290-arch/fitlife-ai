import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { IconBadge, type IconName } from '@/components/ui/IconBadge';
import { Pill } from '@/components/ui/Pill';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { cardShadow, colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';
import { WEEKDAY_SHORT } from '@/utils/dates';
import { clampProgress, percent } from '@/utils/progress';

/* ---------- Hero ---------- */

export function HeroCard({ greeting, name, goalProgress }: { greeting: string; name: string | null; goalProgress: number }) {
  const pct = percent(goalProgress);
  return (
    <View style={styles.hero}>
      <View style={styles.heroArt} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <MaterialCommunityIcons name="run-fast" size={110} color={colors.accent} />
        <Text style={styles.heroScript}>Stronger than yesterday</Text>
      </View>
      <View style={styles.greetingPill}>
        <MaterialCommunityIcons name="white-balance-sunny" size={16} color={colors.calories} />
        <Text style={styles.greetingText}>{greeting}</Text>
      </View>
      <Text style={styles.heroName} accessibilityRole="header" numberOfLines={1}>
        {name ? `${name} 👋` : 'Welcome 👋'}
      </Text>
      <Text style={styles.heroLine}>Small steps today, big results tomorrow!</Text>
      <View style={styles.heroProgressRow}>
        <MaterialCommunityIcons name="fire" size={18} color={colors.calories} />
        <Text style={styles.heroProgressLabel}>Aaj ke goals</Text>
      </View>
      <View style={styles.barRow}>
        <View
          style={styles.barTrack}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Aaj ke goals"
          accessibilityValue={{ min: 0, max: 100, now: pct }}
        >
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.barValue}>{pct}%</Text>
      </View>
    </View>
  );
}

/* ---------- Small ring stat ---------- */

type StatProps = {
  icon: IconName;
  title: string;
  color: string;
  soft: string;
  value?: string;
  goal?: string;
  progress?: number;
  /** When set, the card shows "coming soon" instead of numbers. */
  comingSoon?: boolean;
  onPress?: () => void;
  accessibilityHint?: string;
};

export function StatCard({ icon, title, color, soft, value, goal, progress = 0, comingSoon, onPress, accessibilityHint }: StatProps) {
  const label = comingSoon ? `${title}, jald aa raha hai` : `${title}: ${value} of ${goal}`;
  const body = (
    <>
      <View style={styles.statHeader}>
        <IconBadge name={icon} color={color} background={soft} size={36} />
        <Text style={styles.statTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.statRing}>
        <ProgressRing progress={comingSoon ? 0 : progress} size={84} strokeWidth={8} color={color}>
          {comingSoon ? (
            <Text style={styles.soonText}>Soon</Text>
          ) : (
            <>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statGoal}>/ {goal}</Text>
            </>
          )}
        </ProgressRing>
      </View>
    </>
  );

  if (onPress && !comingSoon) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        style={({ pressed }) => [styles.stat, pressed && { opacity: 0.85 }]}
      >
        {body}
      </Pressable>
    );
  }
  return (
    <View style={styles.stat} accessible accessibilityLabel={label}>
      {body}
    </View>
  );
}

/* ---------- Today's workout ---------- */

type TodayProps = {
  title: string;
  name: string;
  minutes: number | null;
  buttonLabel: string;
  loading: boolean;
  onStart: () => void;
};

export function TodayWorkoutCard({ title, name, minutes, buttonLabel, loading, onStart }: TodayProps) {
  return (
    <View style={styles.card}>
      <View style={styles.rowCenter}>
        <IconBadge name="dumbbell" color={colors.onAccent} background={colors.accent} size={48} />
        <View style={styles.flex}>
          <Text style={styles.caption}>{title}</Text>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>
      {minutes ? (
        <View style={styles.rowCenter}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={colors.text} />
          <Text style={styles.body}>{minutes} min</Text>
        </View>
      ) : null}
      <Button title={buttonLabel} onPress={onStart} loading={loading} />
    </View>
  );
}

/* ---------- Weekly progress ---------- */

type WeeklyProps = {
  minutesByDay: number[];
  todayIndex: number;
  currentWeight: string | null;
  goalWeight: string | null;
  onLogWeight: () => void;
  onSetGoal: () => void;
};

export function WeeklyProgressCard({ minutesByDay, todayIndex, currentWeight, goalWeight, onLogWeight, onSetGoal }: WeeklyProps) {
  const max = Math.max(...minutesByDay, 0);
  const total = minutesByDay.reduce((a, b) => a + b, 0);
  return (
    <View style={styles.card}>
      <View style={styles.rowCenter}>
        <IconBadge name="chart-bar" color={colors.accent} background={colors.accentSoft} size={36} />
        <Text style={[styles.cardTitle, styles.flex]} accessibilityRole="header">
          Weekly Progress
        </Text>
        <Text style={styles.caption}>{total} min</Text>
      </View>

      <View
        style={styles.chart}
        accessible
        accessibilityLabel={`Is hafte workout minutes: ${WEEKDAY_SHORT.map((d, i) => `${d} ${minutesByDay[i] ?? 0}`).join(', ')}`}
      >
        {minutesByDay.map((mins, i) => {
          const h = max > 0 ? Math.max(6, clampProgress(mins / max) * 84) : 6;
          return (
            <View key={WEEKDAY_SHORT[i]} style={styles.barCol}>
              <View style={styles.barSlot}>
                <View
                  style={[
                    styles.bar,
                    { height: h, backgroundColor: mins > 0 ? colors.accent : colors.surfaceRaised },
                    i === todayIndex && mins === 0 && { borderWidth: 1.5, borderColor: colors.accent },
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, i === todayIndex && styles.dayToday]}>{WEEKDAY_SHORT[i]}</Text>
            </View>
          );
        })}
      </View>
      {total === 0 ? <Text style={styles.caption}>Is hafte abhi tak koi workout complete nahi hua.</Text> : null}

      <View style={styles.weightRow}>
        <WeightTile icon="scale-bathroom" label="Current Weight" value={currentWeight} emptyLabel="Weight log karein" onPress={onLogWeight} />
        <WeightTile icon="bullseye-arrow" label="Goal Weight" value={goalWeight} emptyLabel="Goal set karein" onPress={onSetGoal} />
      </View>
    </View>
  );
}

function WeightTile(props: { icon: IconName; label: string; value: string | null; emptyLabel: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={props.value ? `${props.label} ${props.value}. Badalne ke liye tap karein` : props.emptyLabel}
      style={({ pressed }) => [styles.weightTile, pressed && { opacity: 0.8 }]}
    >
      <MaterialCommunityIcons name={props.icon} size={26} color={colors.accent} />
      <View style={styles.flex}>
        <Text style={styles.caption}>{props.label}</Text>
        {props.value ? (
          <Text style={styles.weightValue}>{props.value}</Text>
        ) : (
          <Text style={styles.weightEmpty}>{props.emptyLabel}</Text>
        )}
      </View>
    </Pressable>
  );
}

/* ---------- Feature tiles and quick actions ---------- */

type FeatureProps = {
  icon: IconName;
  title: string;
  subtitle: string;
  color: string;
  soft: string;
  onPress?: () => void;
};

export function FeatureTile({ icon, title, subtitle, color, soft, onPress }: FeatureProps) {
  const content = (
    <>
      <View style={styles.rowCenter}>
        <IconBadge name={icon} color={color} background={soft} size={40} />
        <View style={styles.flex}>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.caption} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        {onPress ? <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} /> : null}
      </View>
      <View style={[styles.featureArt, { backgroundColor: soft }]}>
        <MaterialCommunityIcons name={icon} size={46} color={color} />
      </View>
      {!onPress ? <Pill label="Jald aa raha hai" tone="grey" /> : null}
    </>
  );
  if (!onPress) {
    return (
      <View style={styles.feature} accessible accessibilityLabel={`${title}, jald aa raha hai`}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={({ pressed }) => [styles.feature, pressed && { opacity: 0.85 }]}
    >
      {content}
    </Pressable>
  );
}

export function QuickAction(props: { icon: IconName; label: string; color: string; soft: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={props.label}
      style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }]}
    >
      <IconBadge name={props.icon} color={props.color} background={props.soft} size={56} />
      <Text style={styles.quickLabel} numberOfLines={2}>
        {props.label}
      </Text>
    </Pressable>
  );
}

export function SoonBanner({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  return (
    <View style={[styles.card, styles.rowCenter]} accessible accessibilityLabel={`${title}. ${body}. Jald aa raha hai`}>
      <IconBadge name={icon} color={colors.onAccent} background={colors.accent} size={52} />
      <View style={[styles.flex, { gap: 4 }]}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.caption}>{body}</Text>
        <Pill label="Jald aa raha hai" tone="green" />
      </View>
    </View>
  );
}

export function CardRow({ children }: { children: ReactNode }) {
  return <View style={styles.cardRow}>{children}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  caption: { ...typography.caption, color: colors.textMuted },
  body: { ...typography.body, color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...cardShadow,
  },
  cardTitle: { ...typography.subheading, color: colors.text },
  cardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },

  hero: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  heroArt: { position: 'absolute', right: -10, top: 6, alignItems: 'center', opacity: 0.9 },
  heroScript: { fontSize: 13, fontStyle: 'italic', fontWeight: '700', color: colors.accentText, marginTop: -6 },
  greetingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  greetingText: { ...typography.label, color: colors.accentText },
  heroName: { fontSize: 32, fontWeight: '800', color: colors.text, maxWidth: '65%' },
  heroLine: { ...typography.body, color: colors.text, maxWidth: '62%' },
  heroProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  heroProgressLabel: { ...typography.label, color: colors.text },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.surface, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5, backgroundColor: colors.accent },
  barValue: { ...typography.label, color: colors.text, minWidth: 40, textAlign: 'right' },

  stat: {
    flexGrow: 1,
    flexBasis: 104,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...cardShadow,
  },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statTitle: { ...typography.label, color: colors.text, flexShrink: 1 },
  statRing: { alignItems: 'center' },
  statValue: { fontSize: 17, fontWeight: '800', color: colors.text },
  statGoal: { fontSize: 11, color: colors.textMuted },
  soonText: { ...typography.label, color: colors.textMuted },

  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 112 },
  barCol: { alignItems: 'center', flex: 1, gap: 4 },
  barSlot: { height: 88, justifyContent: 'flex-end' },
  bar: { width: 18, borderRadius: 6 },
  dayLabel: { fontSize: 12, color: colors.textMuted },
  dayToday: { color: colors.accentText, fontWeight: '700' },
  weightRow: { flexDirection: 'row', gap: spacing.sm },
  weightTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: MIN_TOUCH_TARGET + 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  weightValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  weightEmpty: { ...typography.label, color: colors.accentText },

  feature: {
    flexGrow: 1,
    flexBasis: 150,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...cardShadow,
  },
  featureTitle: { ...typography.label, color: colors.text },
  featureArt: { height: 72, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },

  quick: { width: 76, alignItems: 'center', gap: spacing.xs, minHeight: MIN_TOUCH_TARGET },
  quickLabel: { ...typography.caption, color: colors.text, textAlign: 'center' },
});
