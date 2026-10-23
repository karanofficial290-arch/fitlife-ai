import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing, typography } from '@/constants/theme';
import { signIn } from '@/features/auth/authService';
import { validateEmail } from '@/features/auth/validation';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  async function handleSubmit() {
    const next = {
      email: validateEmail(email),
      password: password ? null : 'Password daalna zaroori hai.',
    };
    setErrors(next);
    setFormError(null);
    if (next.email || next.password) return;

    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    // On success, AuthProvider receives the session and the router guard
    // moves the user to the tabs automatically.
    if (error) setFormError(error);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.brand}>FitMxo</Text>
        <Text style={styles.title} accessibilityRole="header">
          Wapas swagat hai
        </Text>
        <Text style={styles.subtitle}>Apne account mein login karein.</Text>
      </View>

      <FormMessage tone="error" message={formError} />

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        ref={passwordRef}
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <Link href="/forgot-password" style={styles.link}>
        Password bhool gaye?
      </Link>

      <Button title="Login" onPress={handleSubmit} loading={submitting} />

      <View style={styles.footer}>
        <Text style={styles.muted}>Account nahi hai? </Text>
        <Link href="/sign-up" style={styles.linkInline}>
          Sign up karein
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginTop: spacing.xxl, marginBottom: spacing.md },
  brand: { ...typography.label, color: colors.accent, letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
  link: { ...typography.label, color: colors.accent, alignSelf: 'flex-end', paddingVertical: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' },
  muted: { ...typography.body, color: colors.textMuted },
  linkInline: { ...typography.label, color: colors.accent, paddingVertical: spacing.sm },
});
