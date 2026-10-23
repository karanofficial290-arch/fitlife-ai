import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing, typography } from '@/constants/theme';
import { sendPasswordReset } from '@/features/auth/authService';
import { validateEmail } from '@/features/auth/validation';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const error = validateEmail(email);
    setEmailError(error);
    setFormError(null);
    if (error) return;

    setSubmitting(true);
    const result = await sendPasswordReset(email);
    setSubmitting(false);
    if (result.error) setFormError(result.error);
    else setSent(true);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Password reset
        </Text>
        <Text style={styles.subtitle}>Apna email daalein, hum reset link bhejenge.</Text>
      </View>

      <FormMessage tone="error" message={formError} />
      {/* Same message whether or not the account exists, to avoid revealing registered emails. */}
      <FormMessage
        tone="success"
        message={sent ? 'Agar is email se account hai, toh reset link bhej diya gaya hai. Inbox check karein.' : null}
      />

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
      />

      <Button title={sent ? 'Link dobara bhejein' : 'Reset link bhejein'} onPress={handleSubmit} loading={submitting} />
      <Button title="Login par wapas" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
});
