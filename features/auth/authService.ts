import * as Linking from 'expo-linking';

import { supabase } from '@/services/supabase';

import { mapAuthError } from './authErrors';
import { normalizeEmail } from './validation';

export type AuthResult = { error: string | null };
export type SignUpResult = AuthResult & { needsEmailConfirmation: boolean };

async function run(action: () => Promise<{ error: unknown }>): Promise<AuthResult> {
  try {
    const { error } = await action();
    return { error: error ? mapAuthError(error) : null };
  } catch (e) {
    return { error: mapAuthError(e) };
  }
}

export function signIn(email: string, password: string): Promise<AuthResult> {
  return run(() =>
    supabase.auth.signInWithPassword({ email: normalizeEmail(email), password }),
  );
}

export type SignUpInput = {
  email: string;
  password: string;
  displayName: string;
  /** Normalized, e.g. +919876543210, or null. */
  phone: string | null;
  /** YYYY-MM-DD */
  dateOfBirth: string;
  gender: string;
};

export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: normalizeEmail(input.email),
      password: input.password,
      options: {
        // Copied into public.profiles by the handle_new_user() trigger.
        data: {
          display_name: input.displayName.trim(),
          phone: input.phone,
          date_of_birth: input.dateOfBirth,
          gender: input.gender,
        },
        emailRedirectTo: Linking.createURL('/sign-in'),
      },
    });
    if (error) return { error: mapAuthError(error), needsEmailConfirmation: false };
    // With email confirmation enabled, Supabase returns no session until verified.
    return { error: null, needsEmailConfirmation: !data.session };
  } catch (e) {
    return { error: mapAuthError(e), needsEmailConfirmation: false };
  }
}

export function sendPasswordReset(email: string): Promise<AuthResult> {
  return run(() =>
    supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
      redirectTo: Linking.createURL('/reset-password'),
    }),
  );
}

export function startSessionFromTokens(accessToken: string, refreshToken: string): Promise<AuthResult> {
  return run(() =>
    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }),
  );
}

export function updatePassword(newPassword: string): Promise<AuthResult> {
  return run(() => supabase.auth.updateUser({ password: newPassword }));
}

export function signOut(): Promise<AuthResult> {
  return run(() => supabase.auth.signOut());
}
