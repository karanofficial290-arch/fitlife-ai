import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { FormMessage } from '@/components/ui/FormMessage';
import { IconField } from '@/components/ui/IconField';
import { colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';
import { signUp } from '@/features/auth/authService';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import {
  formatDobInput,
  GENDER_LABELS,
  GENDERS,
  parseDob,
  parsePhone,
  validateDisplayName,
  validateEmail,
  validatePassword,
  type Gender,
} from '@/features/auth/validation';

const HERO = require('../../assets/photos/signup-hero.png');

type Field = 'name' | 'email' | 'phone' | 'password' | 'dob' | 'gender' | 'terms';
type FieldErrors = Partial<Record<Field, string | null>>;

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const dobRef = useRef<TextInput>(null);

  async function handleSubmit() {
    const phoneParsed = parsePhone(phone);
    const dobParsed = parseDob(dob);
    const next: FieldErrors = {
      name: validateDisplayName(name),
      email: validateEmail(email),
      phone: phoneParsed.error,
      password: validatePassword(password),
      dob: dobParsed.error,
      gender: gender ? null : 'Gender chunein.',
      terms: agreed ? null : 'Aage badhne ke liye Terms aur Privacy Policy maanein.',
    };
    setErrors(next);
    setFormError(null);
    if (Object.values(next).some(Boolean) || !dobParsed.value || !gender) return;

    setSubmitting(true);
    const result = await signUp({
      email,
      password,
      displayName: name,
      phone: phoneParsed.value,
      dateOfBirth: dobParsed.value,
      gender,
    });
    setSubmitting(false);

    if (result.error) setFormError(result.error);
    else if (result.needsEmailConfirmation) setConfirmationSentTo(email.trim());
    // Otherwise a session exists and the route guard opens the app.
  }

  if (confirmationSentTo) {
    return (
      <AuthLayout
        titleLine1="Check your"
        titleLine2="Email!"
        subtitle="Ek kadam aur, phir aapka safar shuru."
        photo={HERO}
        photoAspect={484 / 456}
      >
        <View style={styles.sentRow}>
          <MaterialCommunityIcons name="email-check-outline" size={40} color={colors.accent} />
          <Text style={[styles.body, styles.flex]}>
            Humne <Text style={styles.bold}>{confirmationSentTo}</Text> par verification link bheja hai. Link kholne ke
            baad login karein. Email na dikhe toh spam folder dekhein.
          </Text>
        </View>
        <Button title="Login" trailingIcon="arrow-right" onPress={() => router.replace('/sign-in')} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      titleLine1="Create Your"
      titleLine2="Account"
      subtitle="Join FITMXO and take the first step towards a healthier, stronger you."
      photo={HERO}
      photoAspect={484 / 456}
      showBack
    >
      <FormMessage tone="error" message={formError} />

      <IconField
        icon="account-outline"
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        error={errors.name}
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <IconField
        ref={emailRef}
        icon="email-outline"
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
      />
      <IconField
        ref={phoneRef}
        icon="phone-outline"
        label="Mobile Number (optional)"
        placeholder="Enter your mobile number"
        value={phone}
        onChangeText={setPhone}
        error={errors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <IconField
        ref={passwordRef}
        icon="lock-outline"
        label="Password"
        placeholder="Create a strong password"
        password
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => dobRef.current?.focus()}
      />

      <View style={styles.twoCol}>
        <View style={styles.flex}>
          <IconField
            ref={dobRef}
            icon="calendar-blank-outline"
            label="Date of Birth"
            placeholder="DD/MM/YYYY"
            value={dob}
            onChangeText={(t) => setDob(formatDobInput(t))}
            error={errors.dob}
            keyboardType="number-pad"
            maxLength={10}
            returnKeyType="done"
          />
        </View>
        <View style={styles.flex}>
          <Pressable
            onPress={() => setGenderOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`Gender: ${gender ? GENDER_LABELS[gender] : 'select gender'}`}
            style={[styles.picker, !!errors.gender && styles.pickerError]}
          >
            <MaterialCommunityIcons name="gender-male-female" size={26} color={colors.text} />
            <View style={styles.flex}>
              <Text style={styles.pickerLabel}>Gender</Text>
              <Text style={gender ? styles.pickerValue : styles.pickerPlaceholder} numberOfLines={1}>
                {gender ? GENDER_LABELS[gender] : 'Select gender'}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={22} color={colors.textMuted} />
          </Pressable>
          {errors.gender ? <Text style={styles.error}>{errors.gender}</Text> : null}
        </View>
      </View>

      <Checkbox checked={agreed} onChange={setAgreed} accessibilityLabel="I agree to the Terms and Conditions and Privacy Policy" error={!!errors.terms}>
        <Text style={styles.terms}>
          I agree to the{' '}
          <Text style={styles.termsLink} onPress={() => router.push('/legal/terms')} accessibilityRole="link">
            Terms &amp; Conditions
          </Text>{' '}
          and{' '}
          <Text style={styles.termsLink} onPress={() => router.push('/legal/privacy')} accessibilityRole="link">
            Privacy Policy
          </Text>
        </Text>
      </Checkbox>
      {errors.terms ? <Text style={styles.error}>{errors.terms}</Text> : null}

      <Button title="Create Account" trailingIcon="arrow-right" onPress={handleSubmit} loading={submitting} />

      <View style={styles.switchRow}>
        <Text style={styles.body}>Already have an account?</Text>
        <Pressable onPress={() => router.replace('/sign-in')} accessibilityRole="link" accessibilityLabel="Login" style={styles.switchLink}>
          <Text style={styles.linkStrong}>Login</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color={colors.accentText} />
        </Pressable>
      </View>

      <BottomSheet visible={genderOpen} title="Gender chunein" onClose={() => setGenderOpen(false)}>
        <View accessibilityRole="radiogroup" style={styles.options}>
          {GENDERS.map((g) => {
            const selected = gender === g;
            return (
              <Pressable
                key={g}
                onPress={() => {
                  setGender(g);
                  setGenderOpen(false);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected, checked: selected }}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{GENDER_LABELS[g]}</Text>
                {selected ? <MaterialCommunityIcons name="check-circle" size={22} color={colors.accent} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { ...typography.body, color: colors.textMuted },
  bold: { fontWeight: '700', color: colors.text },
  sentRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  twoCol: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 64,
    paddingHorizontal: spacing.md,
    backgroundColor: '#FBFCFD',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  pickerError: { borderColor: colors.danger },
  pickerLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
  pickerValue: { ...typography.body, color: colors.text },
  pickerPlaceholder: { ...typography.body, color: '#8A97A8' },
  error: { ...typography.caption, color: colors.danger, marginLeft: spacing.sm, marginTop: 4 },
  terms: { fontSize: 15, lineHeight: 22, color: colors.text },
  termsLink: { color: colors.accentText, fontWeight: '700' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: spacing.sm },
  switchLink: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: MIN_TOUCH_TARGET },
  linkStrong: { fontSize: 17, fontWeight: '800', color: colors.accentText },
  options: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  optionText: { ...typography.body, color: colors.text },
  optionTextSelected: { fontWeight: '700', color: colors.accentText },
});
