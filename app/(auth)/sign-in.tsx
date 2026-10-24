import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { FormMessage } from '@/components/ui/FormMessage';
import { IconField } from '@/components/ui/IconField';
import { colors, MIN_TOUCH_TARGET, spacing, typography } from '@/constants/theme';
import { signIn } from '@/features/auth/authService';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { setRememberMe } from '@/features/auth/rememberMe';
import { validateEmail } from '@/features/auth/validation';

const HERO = require('../../assets/photos/login-hero.png');

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
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
    await setRememberMe(remember);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    // On success AuthProvider gets the session and the route guard opens the app.
    if (error) setFormError(error);
  }

  return (
    <AuthLayout
      titleLine1="Welcome Back,"
      titleLine2="Athlete!"
      subtitle="Your fitness journey continues here."
      photo={HERO}
      photoAspect={542 / 482}
    >
      <FormMessage tone="error" message={formError} />

      <IconField
        icon="email-outline"
        accessibleName="Email address"
        placeholder="Email address"
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
      <IconField
        ref={passwordRef}
        icon="lock-outline"
        accessibleName="Password"
        placeholder="Password"
        password
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <View style={styles.optionsRow}>
        <Checkbox checked={remember} onChange={setRemember} accessibilityLabel="Remember me">
          <Text style={styles.muted}>Remember me</Text>
        </Checkbox>
        <Pressable onPress={() => router.push('/forgot-password')} accessibilityRole="link" style={styles.linkHit}>
          <Text style={styles.link}>Forgot Password?</Text>
        </Pressable>
      </View>

      <Button title="Login" trailingIcon="arrow-right" onPress={handleSubmit} loading={submitting} />

      <View style={styles.switchRow}>
        <Text style={styles.muted}>Don&apos;t have an account?</Text>
        <Pressable onPress={() => router.push('/sign-up')} accessibilityRole="link" accessibilityLabel="Sign Up" style={styles.switchLink}>
          <Text style={styles.linkStrong}>Sign Up</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color={colors.accentText} />
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  optionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  muted: { ...typography.body, color: colors.textMuted },
  linkHit: { minHeight: MIN_TOUCH_TARGET, justifyContent: 'center' },
  link: { ...typography.label, fontSize: 15, color: colors.accentText },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: spacing.sm },
  switchLink: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: MIN_TOUCH_TARGET },
  linkStrong: { fontSize: 17, fontWeight: '800', color: colors.accentText },
});
