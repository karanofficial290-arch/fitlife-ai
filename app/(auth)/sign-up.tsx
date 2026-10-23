import { Link, router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing, typography } from '@/constants/theme';
import { signUp } from '@/features/auth/authService';
import {
  validateDisplayName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '@/features/auth/validation';

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'confirm', string | null>>;

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  async function handleSubmit() {
    const next: FieldErrors = {
      name: validateDisplayName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validatePasswordConfirmation(password, confirm),
    };
    setErrors(next);
    setFormError(null);
    if (Object.values(next).some(Boolean)) return;

    setSubmitting(true);
    const result = await signUp(email, password, name);
    setSubmitting(false);

    if (result.error) {
      setFormError(result.error);
    } else if (result.needsEmailConfirmation) {
      setConfirmationSent(true);
    }
    // Otherwise a session exists and the router guard opens the app.
  }

  if (confirmationSent) {
    return (
      <Screen>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Email check karein
          </Text>
          <Text style={styles.subtitle}>
            Humne {email.trim()} par ek verification link bheja hai. Link kholne ke baad yahan login karein.
          </Text>
        </View>
        <Button title="Login par jaayein" onPress={() => router.replace('/sign-in')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Account banayein
        </Text>
        <Text style={styles.subtitle}>FitMxo ke saath apna fitness safar shuru karein.</Text>
      </View>

      <FormMessage tone="error" message={formError} />

      <TextField
        label="Naam"
        value={name}
        onChangeText={setName}
        error={errors.name}
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <TextField
        ref={emailRef}
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

      <Text style={styles.hint}>
        Account banake aap maante hain ki FitMxo aapka data sirf app chalane ke liye store karega. Poori privacy
        policy release se pehle add ki jayegi.
      </Text>

      <Button title="Sign up" onPress={handleSubmit} loading={submitting} />

      <View style={styles.footer}>
        <Text style={styles.muted}>Pehle se account hai? </Text>
        <Link href="/sign-in" style={styles.linkInline}>
          Login karein
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
  hint: { ...typography.caption, color: colors.textMuted },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' },
  muted: { ...typography.body, color: colors.textMuted },
  linkInline: { ...typography.label, color: colors.accent, paddingVertical: spacing.sm },
});
