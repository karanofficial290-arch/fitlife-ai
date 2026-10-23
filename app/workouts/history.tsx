import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { ErrorRetry } from '@/components/ui/ErrorRetry';
import { Pill } from '@/components/ui/Pill';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { cardShadow, colors, radius, spacing, typography } from '@/constants/theme';
import type { SessionSummary } from '@/features/workouts/types';
import { fetchHistory, PAGE_SIZE } from '@/features/workouts/workoutService';
import { usePagedList } from '@/hooks/usePagedList';
import { formatDateTime } from '@/utils/dates';

export default function WorkoutHistoryScreen() {
  const { items, loading, error, loadMore, retry } = usePagedList(fetchHistory, PAGE_SIZE);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <FlatList
        data={items}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <HistoryItem item={item} />}
        contentContainerStyle={styles.content}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View style={styles.header}>
            <ScreenHeader title="Workout History" />
          </View>
        }
        ListEmptyComponent={
          loading || error ? null : (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={48} color={colors.accent} />
              <Text style={styles.emptyTitle}>Abhi tak koi workout nahi</Text>
              <Text style={styles.emptyText}>Pehla workout poora karte hi wo yahan dikhega.</Text>
              <Button title="Workout chunein" onPress={() => router.replace('/workout')} />
            </View>
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

function HistoryItem({ item }: { item: SessionSummary }) {
  const completed = item.status === 'completed';
  const minutes = item.ended_at
    ? Math.max(1, Math.round((new Date(item.ended_at).getTime() - new Date(item.started_at).getTime()) / 60000))
    : null;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/workouts/session/[id]', params: { id: item.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${item.plan_name}, ${formatDateTime(item.started_at)}, ${completed ? 'completed' : 'stopped'}${minutes ? `, ${minutes} minute` : ''}`}
      style={styles.card}
    >
      <MaterialCommunityIcons
        name={completed ? 'check-circle' : 'close-circle-outline'}
        size={28}
        color={completed ? colors.accent : colors.textMuted}
      />
      <View style={styles.flex}>
        <Text style={styles.name}>{item.plan_name}</Text>
        <Text style={styles.meta}>
          {formatDateTime(item.started_at)}
          {minutes ? ` • ${minutes} min` : ''}
        </Text>
      </View>
      <Pill label={completed ? 'Done' : 'Stopped'} tone={completed ? 'green' : 'grey'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.sm, flexGrow: 1 },
  header: { marginBottom: spacing.sm },
  flex: { flex: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 64,
    ...cardShadow,
  },
  name: { ...typography.label, fontSize: 16, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  emptyTitle: { ...typography.heading, color: colors.text },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  footer: { paddingVertical: spacing.lg, gap: spacing.sm },
});
