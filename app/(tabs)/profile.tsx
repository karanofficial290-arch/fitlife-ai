import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormMessage } from '@/components/ui/FormMessage';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { signOut } from '@/features/auth/authService';
import { useMyProfile } from '@/features/profile/useMyProfile';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, loading, error, reload } = useMyProfile();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError(null);
    const result = await signOut();
    // On success the router guard returns to sign-in; this screen unmounts.
    if (result.error) {
      setSignOutError(result.error);
      setSigningOut(false);
    }
  }

  return (
    <Screen edges={['top', 'left', 'right']}>
      <Text style={styles.title} accessibilityRole="header">
        Profile
      </Text>

      <Card title="Account">
        {loading ? (
          <View style={styles.skeleton} accessibilityLabel="Profile load ho raha hai" />
        ) : (
          <Text style={styles.name}>{profile?.display_name ?? 'Naam set nahi hai'}</Text>
        )}
        <Text style={styles.muted}>{user?.email}</Text>
      </Card>

      {error ? (
        <View style={styles.block}>
          <FormMessage tone="error" message={error} />
          <Button title="Dobara try karein" variant="secondary" onPress={reload} />
        </View>
      ) : null}

      <Card title="Jald aa raha hai">
        <Text style={styles.muted}>
          Fitness profile, units (metric/imperial), notifications, privacy settings, data export aur account delete
          karne ka option agle milestones mein yahan aayenge.
        </Text>
      </Card>

      <FormMessage tone="error" message={signOutError} />
      <Button title="Logout" variant="danger" onPress={handleSignOut} loading={signingOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text, marginTop: spacing.md },
  name: { ...typography.heading, color: colors.text },
  muted: { ...typography.body, color: colors.textMuted },
  skeleton: { height: 26, width: 160, borderRadius: 8, backgroundColor: colors.surfaceRaised },
  block: { gap: spacing.sm },
});
