import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { Button } from '@/components/ui/Button';
import { IconBadge, type IconName } from '@/components/ui/IconBadge';
import { PhotoSlot } from '@/components/ui/PhotoSlot';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SegmentRing } from '@/components/ui/SegmentRing';
import { cardShadow, colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';
import { formatNumber, type DaySummary } from '@/features/nutrition/nutritionLogic';
import { WEEKDAY_SHORT } from '@/utils/dates';
import { clampProgress, percent } from '@/utils/progress';

/** Matches the light sky at the left edge of the home hero photo. */
const HERO_BG = '#EEF3F1';

export const MACRO_COLORS = { protein: '#F59E0B', carbs: '#EAB308', fat: '#8B5CF6' } as const;

/* ---------- shared card shell ---------- */

function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function CardTitle({ icon, title, actionLabel, onAction }: { icon: IconName; title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.titleRow}>
      <IconBadge name={icon} color={colors.accent} background={colors.accentSoft} size={38} />
      <Text style={[styles.cardTitle, styles.flex]} accessibilityRole="header">
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={12} accessibilityRole="button" accessibilityLabel={`${title}: ${actionLabel}`} style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.accentText} />
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------- Hero banner ---------- */

type HeroProps = { greeting: string; name: string | null; goalProgress: number; photo: ImageSourcePropType | null };

export function HeroBanner({ greeting, name, goalProgress, photo }: HeroProps) {
  const pct = percent(goalProgress);
  return (
    <PhotoSlot source={photo} placeholderIcon="arm-flex" layout="right" rightWidth="56%" background={HERO_BG} style={styles.hero}>
      <View style={styles.heroContent}>
        <View style={styles.greetingPill}>
          <MaterialCommunityIcons name="white-balance-sunny" size={16} color="#F59E0B" />
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>
        <Text style={styles.heroName} accessibilityRole="header" numberOfLines={1}>
          {name ?? 'Champion'} 👋
        </Text>
        <Text style={styles.heroLine}>Small steps today, big results tomorrow!</Text>
        <View style={styles.keepRow}>
          <MaterialCommunityIcons name="fire" size={18} color="#F97316" />
          <Text style={styles.keepText}>Keep Going</Text>
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
      {photo ? null : (
        <Text style={styles.heroScript} importantForAccessibility="no">
          Stronger Than{'\n'}Yesterday
        </Text>
      )}
    </PhotoSlot>
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
    <Card>
      <View style={styles.titleRow}>
        <IconBadge name="dumbbell" color={colors.onAccent} background={colors.accent} size={52} />
        <View style={styles.flex}>
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.workoutName} numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>
      {minutes ? (
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={colors.text} />
          <Text style={styles.body}>{minutes} min</Text>
        </View>
      ) : null}
      <Button title={buttonLabel} onPress={onStart} loading={loading} icon="play" chevron />
    </Card>
  );
}

/* ---------- Ring stat (calories / water / steps) ---------- */

type StatProps = {
  icon: IconName;
  title: string;
  color: string;
  soft: string;
  value: string;
  goal: string;
  progress: number;
  onPress: () => void;
  accessibilityHint?: string;
};

export function RingStat({ icon, title, color, soft, value, goal, progress, onPress, accessibilityHint }: StatProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${value} of ${goal}`}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.stat, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.statHeader}>
        <IconBadge name={icon} color={color} background={soft} size={34} />
        <Text style={styles.statTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <ProgressRing progress={progress} size={88} strokeWidth={8} color={color}>
        <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        <Text style={styles.statGoal} numberOfLines={1}>
          / {goal}
        </Text>
      </ProgressRing>
    </Pressable>
  );
}

/* ---------- Nutrition today ---------- */

export function NutritionCard({ summary, calorieGoal, onDetails, onLog }: { summary: DaySummary; calorieGoal: number; onDetails: () => void; onLog: () => void }) {
  const rows = [
    { key: 'protein', label: 'Protein', grams: summary.protein_g, pct: summary.percent.protein, color: MACRO_COLORS.protein },
    { key: 'carbs', label: 'Carbs', grams: summary.carbs_g, pct: summary.percent.carbs, color: MACRO_COLORS.carbs },
    { key: 'fat', label: 'Fat', grams: summary.fat_g, pct: summary.percent.fat, color: MACRO_COLORS.fat },
  ] as const;
  const empty = summary.calories === 0;

  return (
    <Card>
      <CardTitle icon="silverware-fork-knife" title="Nutrition Today" actionLabel="View Details" onAction={onDetails} />
      <View style={styles.nutritionRow}>
        <SegmentRing
          size={124}
          strokeWidth={12}
          segments={rows.map((r) => ({ value: r.grams * (r.key === 'fat' ? 9 : 4), color: r.color }))}
          accessibilityLabel={`${summary.calories} of ${calorieGoal} calories today`}
        >
          <Text style={styles.nutritionValue}>{formatNumber(summary.calories)}</Text>
          <Text style={styles.statGoal}>calories</Text>
        </SegmentRing>
        <View style={styles.macroList}>
          {rows.map((r) => (
            <View key={r.key} style={styles.macroRow} accessible accessibilityLabel={`${r.label} ${r.grams} grams, ${r.pct} percent`}>
              <View style={[styles.dot, { backgroundColor: r.color }]} />
              <Text style={[styles.body, styles.flex]}>{r.label}</Text>
              <Text style={styles.macroGrams}>{r.grams}g</Text>
              <Text style={styles.macroPct}>{r.pct}%</Text>
            </View>
          ))}
        </View>
      </View>
      {empty ? (
        <Pressable onPress={onLog} accessibilityRole="button" style={styles.inlineCta}>
          <MaterialCommunityIcons name="plus-circle" size={20} color={colors.accentText} />
          <Text style={styles.actionText}>Aaj ka pehla meal log karein</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

/* ---------- Weekly progress ---------- */

type WeeklyProps = {
  minutesByDay: number[];
  todayIndex: number;
  currentWeight: string | null;
  goalWeight: string | null;
  onViewAll: () => void;
  onLogWeight: () => void;
  onSetGoal: () => void;
};

export function WeeklyProgressCard({ minutesByDay, todayIndex, currentWeight, goalWeight, onViewAll, onLogWeight, onSetGoal }: WeeklyProps) {
  const max = Math.max(...minutesByDay, 0);
  return (
    <Card>
      <CardTitle icon="chart-bar" title="Weekly Progress" actionLabel="View All" onAction={onViewAll} />
      <View
        style={styles.chart}
        accessible
        accessibilityLabel={`Is hafte workout minutes: ${WEEKDAY_SHORT.map((d, i) => `${d} ${minutesByDay[i] ?? 0}`).join(', ')}`}
      >
        {minutesByDay.map((mins, i) => {
          const h = max > 0 ? Math.max(8, clampProgress(mins / max) * 92) : 8;
          return (
            <View key={WEEKDAY_SHORT[i]} style={styles.barCol}>
              <View style={styles.barSlot}>
                <View style={[styles.bar, { height: h, backgroundColor: mins > 0 ? colors.accent : colors.surfaceRaised }]} />
              </View>
              <Text style={[styles.dayLabel, i === todayIndex && styles.dayToday]}>{WEEKDAY_SHORT[i]}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.weightRow}>
        <WeightTile icon="scale-bathroom" label="Current Weight" value={currentWeight} emptyLabel="Log karein" onPress={onLogWeight} />
        <WeightTile icon="bullseye-arrow" label="Goal Weight" value={goalWeight} emptyLabel="Set karein" onPress={onSetGoal} />
      </View>
    </Card>
  );
}

function WeightTile(props: { icon: IconName; label: string; value: string | null; emptyLabel: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={props.value ? `${props.label} ${props.value}. Badalne ke liye tap karein` : `${props.label}: ${props.emptyLabel}`}
      style={({ pressed }) => [styles.weightTile, pressed && { opacity: 0.8 }]}
    >
      <IconBadge name={props.icon} color={colors.accent} background={colors.accentSoft} size={40} />
      <View style={styles.flex}>
        <Text style={styles.caption}>{props.label}</Text>
        {props.value ? <Text style={styles.weightValue}>{props.value}</Text> : <Text style={styles.actionText}>{props.emptyLabel}</Text>}
      </View>
    </Pressable>
  );
}

/* ---------- Shortcuts ---------- */

type ShortcutProps = { icon: IconName; title: string; subtitle: string; color: string; soft: string; photo: ImageSourcePropType | null; onPress: () => void };

export function ShortcutTile({ icon, title, subtitle, color, soft, photo, onPress }: ShortcutProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={({ pressed }) => [styles.shortcut, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.titleRow}>
        <IconBadge name={icon} color={color} background={soft} size={42} />
        <View style={styles.flex}>
          <Text style={styles.shortcutTitle}>{title}</Text>
          <Text style={styles.caption} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
      </View>
      <PhotoSlot source={photo} placeholderIcon={icon} style={styles.shortcutPhoto} />
    </Pressable>
  );
}

/* ---------- Quick actions ---------- */

export function QuickAction({ icon, label, color, soft, onPress }: { icon: IconName; label: string; color: string; soft: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }]}>
      <IconBadge name={icon} color={color} background={soft} size={60} />
      <Text style={styles.quickLabel} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...cardShadow,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardTitle: { fontSize: 19, fontWeight: '800', color: colors.text },
  action: { flexDirection: 'row', alignItems: 'center', minHeight: 32 },
  actionText: { ...typography.label, color: colors.accentText },
  label: { ...typography.label, color: colors.text },
  caption: { ...typography.caption, color: colors.textMuted },
  body: { ...typography.body, color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  workoutName: { fontSize: 20, fontWeight: '800', color: colors.text },

  hero: { borderRadius: radius.lg, minHeight: 210, ...cardShadow },
  heroContent: { padding: spacing.lg, gap: 6, maxWidth: '64%' },
  greetingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  greetingText: { ...typography.label, color: colors.accentText },
  heroName: { fontSize: 32, fontWeight: '900', color: colors.text },
  heroLine: { fontSize: 15, lineHeight: 21, color: colors.text },
  keepRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  keepText: { ...typography.label, color: colors.text },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: 'rgba(16,35,63,0.12)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5, backgroundColor: colors.accent },
  barValue: { ...typography.label, color: colors.text, minWidth: 40, textAlign: 'right' },
  heroScript: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '800',
    color: colors.accentText,
    textAlign: 'right',
    transform: [{ rotate: '-8deg' }],
  },

  stat: {
    flex: 1,
    minWidth: 104,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
    ...cardShadow,
  },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'stretch' },
  statTitle: { ...typography.label, color: colors.text, flexShrink: 1 },
  statValue: { fontSize: 19, fontWeight: '900', color: colors.text, maxWidth: 70 },
  statGoal: { fontSize: 12, color: colors.textMuted },

  nutritionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  nutritionValue: { fontSize: 26, fontWeight: '900', color: colors.text },
  macroList: { flex: 1, gap: spacing.sm },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 32, borderBottomWidth: 1, borderBottomColor: colors.border },
  dot: { width: 10, height: 10, borderRadius: 5 },
  macroGrams: { ...typography.label, color: colors.text, minWidth: 44, textAlign: 'right' },
  macroPct: { ...typography.caption, color: colors.textMuted, minWidth: 34, textAlign: 'right' },
  inlineCta: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: MIN_TOUCH_TARGET },

  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barCol: { alignItems: 'center', flex: 1, gap: 6 },
  barSlot: { height: 96, justifyContent: 'flex-end' },
  bar: { width: 22, borderRadius: 6 },
  dayLabel: { fontSize: 12, color: colors.textMuted },
  dayToday: { color: colors.accentText, fontWeight: '800' },
  weightRow: { flexDirection: 'row', gap: spacing.sm },
  weightTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 64,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    padding: spacing.sm,
  },
  weightValue: { fontSize: 22, fontWeight: '900', color: colors.text },

  shortcut: {
    flexGrow: 1,
    flexBasis: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
    ...cardShadow,
  },
  shortcutTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  shortcutPhoto: { height: 96, borderRadius: radius.md },

  quick: { flex: 1, alignItems: 'center', gap: spacing.xs, minHeight: MIN_TOUCH_TARGET },
  quickLabel: { ...typography.caption, color: colors.text, textAlign: 'center', fontWeight: '600' },
});
