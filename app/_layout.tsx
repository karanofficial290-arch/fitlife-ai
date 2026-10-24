import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SPLASH_BACKGROUND, WelcomeSplash } from '@/components/brand/WelcomeSplash';
import { colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';

/** Shortest time the welcome screen stays up, so it never just flashes. */
const MIN_SPLASH_MS = 1500;

function AppStack() {
  const { session } = useAuth();
  const signedIn = !!session;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workouts/plan/[id]" />
        <Stack.Screen name="workouts/session/[id]" options={{ gestureEnabled: false }} />
        <Stack.Screen name="workouts/exercises" />
        <Stack.Screen name="workouts/history" />
        <Stack.Screen name="coach" />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      {/* Reachable from the reset email whether or not a session exists yet. */}
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

function RootNavigator() {
  const { initializing } = useAuth();
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [splashGone, setSplashGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style={splashGone ? 'dark' : 'light'} />
      {/* Mount the app once the session is known; the splash fades out on top of it. */}
      {initializing ? <View style={styles.splashBg} /> : <AppStack />}
      {!splashGone ? <WelcomeSplash ready={!initializing && minTimePassed} onDone={() => setSplashGone(true)} /> : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  splashBg: { flex: 1, backgroundColor: SPLASH_BACKGROUND },
});
