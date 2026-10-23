import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormMessage } from '@/components/ui/FormMessage';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/theme';
import { useMyProfile } from '@/features/profile/useMyProfile';
import { getGreeting } from '@/utils/greeting';

export default function HomeScreen() {
  const { profile, loading, error, reload } = useMyProfile();
  const name = profile?.display_name?.trim();

  return (
    <Screen edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting(new Date())}</Text>
        {loading ? (
          <View style={styles.nameSkeleton} accessibilityLabel="Naam load ho raha hai" />
        ) : (
          <Text style={styles.name} accessibilityRole="header">
            {name ? name : 'FitMxo mein swagat'}
          </Text>
        )}
      </View>

      {error ? (
        <View style={styles.errorBlock}>
          <FormMessage tone="error" message={error} />
          <Button title="Dobara try karein" variant="secondary" onPress={reload} />
        </View>
      ) : null}

      <Card title="Aaj ka workout">
        <Text style={styles.body}>Workout plans agle milestones mein aayenge.</Text>
      </Card>
      <Card title="Nutrition aur paani">
        <Text style={styles.body}>Meal aur water tracking jald hi yahan dikhegi.</Text>
      </Card>
      <Card title="Weekly progress">
        <Text style={styles.body}>Workout log karna shuru karte hi aapki progress yahan dikhegi.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginTop: spacing.md, marginBottom: spacing.sm },
  greeting: { ...typography.body, color: colors.textMuted },
  name: { ...typography.title, color: colors.text },
  nameSkeleton: { height: 34, width: 180, borderRadius: 8, backgroundColor: colors.surfaceRaised },
  errorBlock: { gap: spacing.sm },
  body: { ...typography.body, color: colors.text },
});
