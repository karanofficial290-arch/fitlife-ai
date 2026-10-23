import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { levelTone, Pill } from '@/components/ui/Pill';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { cardShadow, colors, radius, spacing, typography } from '@/constants/theme';
import { MuscleGroupPicker } from '@/features/workouts/components/MuscleGroupPicker';
import { isLevel, isMuscleGroup, LEVEL_LABELS, MUSCLE_LABELS, type MuscleGroup } from '@/features/workouts/types';
import { fetchExercises, PAGE_SIZE, type LibraryExercise } from '@/features/workouts/workoutService';
import { usePagedList } from '@/hooks/usePagedList';

export default function ExerciseLibraryScreen() {
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all');
  const [search, setSearch] = useState('');
  const fetchPage = useCallback((page: number) => fetchExercises(muscle, page), [muscle]);
  const { items, loading, error, done, loadMore, retry } = usePagedList(fetchPage, PAGE_SIZE);

  const query = search.trim().toLowerCase();
  const visible = useMemo(
    () => (query ? items.filter((e) => e.name.toLowerCase().includes(query)) : items),
    [items, query],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <FlatList
        data={visible}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => <ExerciseItem item={item} />}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onEndReached={query ? undefined : loadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View style={styles.header}>
            <ScreenHeader title="Exercise Library" />
            <TextField
              label="Search"
              placeholder="Exercise ka naam, jaise squat"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            <MuscleGroupPicker value={muscle} onChange={setMuscle} />
            {query && !done ? (
              <Text style={styles.hint}>Search sirf load hui exercises mein hai. Neeche scroll karke aur load karein.</Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading ? null : error ? null : (
            <Text style={styles.empty}>{query ? 'Is naam ki koi exercise nahi mili.' : 'Koi exercise nahi mili.'}</Text>
          )
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {loading ? <ActivityIndicator color={colors.accent} accessibilityLabel="Load ho raha hai" /> : null}
            <ErrorRetry message={error} onRetry={retry} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

function ExerciseItem({ item }: { item: LibraryExercise }) {
  const [open, setOpen] = useState(false);
  const muscle = isMuscleGroup(item.muscle_group) ? MUSCLE_LABELS[item.muscle_group] : item.muscle_group;
  const level = isLevel(item.level) ? LEVEL_LABELS[item.level] : item.level;
  const where = item.location === 'both' ? 'Gym / Home' : item.location === 'home' ? 'Home' : 'Gym';

  return (
    <Pressable
      onPress={() => setOpen((v) => !v)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityLabel={`${item.name}, ${muscle}, ${level}, ${where}`}
      accessibilityHint="Tarika dekhne ke liye tap karein"
      style={styles.card}
    >
      <View style={styles.row}>
        <View style={styles.flex}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>
            {muscle} • {item.equipment} • {where}
          </Text>
        </View>
        <Pill label={level} tone={levelTone(item.level)} />
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={22} color={colors.textMuted} />
      </View>
      {open ? <Text style={styles.instructions}>{item.instructions}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.sm },
  header: { gap: spacing.lg, marginBottom: spacing.sm },
  flex: { flex: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...cardShadow,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 },
  name: { ...typography.label, fontSize: 16, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted, textTransform: 'capitalize' },
  instructions: { ...typography.body, color: colors.textMuted },
  hint: { ...typography.caption, color: colors.textMuted },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.xl },
  footer: { paddingVertical: spacing.lg, gap: spacing.sm },
});
