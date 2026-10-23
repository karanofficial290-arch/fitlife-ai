import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { parseAuthCallbackUrl } from '@/features/auth/authLinks';
import { startSessionFromTokens, updatePassword } from '@/features/auth/authService';
import { validatePassword, validatePasswordConfirmation } from '@/features/auth/validation';

type Phase = 'verifying' | 'ready' | 'invalid' | 'done';

export default function ResetPasswordScreen() {
  const url = Linking.useURL();
  const { session } = useAuth();
  const [phase, setPhase] = useState<Phase>('verifying');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string | null; confirm?: string | null }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const handledUrl = useRef<string | null>(null);
  const confirmRef = useRef<TextInput>(null);

  useEffect(() => {
    function handleNoRecoveryLink() {
      // Opened without a recovery link: only allow it if already signed in.
      setPhase(session ? 'ready' : 'invalid');
      if (!session) setLinkError('Ye reset link sahi nahi hai. Naya link mangwayein.');
    }

    if (!url) {
      // useURL can be null briefly while the initial URL resolves.
      const timer = setTimeout(() => {
        if (!handledUrl.current) handleNoRecoveryLink();
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (handledUrl.current === url) return;
    handledUrl.current = url;

    const parsed = parseAuthCallbackUrl(url);
    if (parsed.kind === 'error') {
      setLinkError(parsed.message);
      setPhase('invalid');
      return;
    }
    if (parsed.kind === 'none') {
      handleNoRecoveryLink();
      return;
    }

    void startSessionFromTokens(parsed.accessToken, parsed.refreshToken).then(({ error }) => {
      if (error) {
        setLinkError(error);
        setPhase('invalid');
      } else {
        setPhase('ready');
      }
    });
  }, [url, session]);

  async function handleSubmit() {
    const next = {
      password: validatePassword(password),
      confirm: validatePasswordConfirmation(password, confirm),
    };
    setErrors(next);
    setFormError(null);
    if (next.password || next.confirm) return;

    setSubmitting(true);
    const { error } = await updatePassword(password);
    setSubmitting(false);
    if (error) setFormError(error);
    else setPhase('done');
  }

  if (phase === 'verifying') {
    return (
      <View style={styles.center} accessibilityLabel="Link verify ho raha hai">
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.subtitle}>Link verify ho raha hai…</Text>
      </View>
    );
  }

  if (phase === 'invalid') {
    return (
      <Screen>
        <Text style={styles.title} accessibilityRole="header">
          Link kaam nahi kar raha
        </Text>
        <FormMessage tone="error" message={linkError} />
        <Button title="Naya reset link mangwayein" onPress={() => router.replace('/forgot-password')} />
      </Screen>
    );
  }

  if (phase === 'done') {
    return (
      <Screen>
        <Text style={styles.title} accessibilityRole="header">
          Password badal gaya
        </Text>
        <FormMessage tone="success" message="Aapka naya password save ho gaya hai." />
        <Button title="App kholein" onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Naya password
        </Text>
        <Text style={styles.subtitle}>Ek naya, strong password chunein.</Text>
      </View>

      <FormMessage tone="error" message={formError} />

      <TextField
        label="Naya password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current?.focus()}
      />
      <TextField
        ref={confirmRef}
        label="Password dobara"
        value={confirm}
        onChangeText={setConfirm}
        error={errors.confirm}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <Button title="Password save karein" onPress={handleSubmit} loading={submitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  header: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
});
