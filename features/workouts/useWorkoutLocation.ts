import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';

import type { PlanLocation } from './types';

// Gym/Home choice shared by Home and Workout tabs, remembered on this device.
// Moves to user_preferences when onboarding (M1) collects it.

const KEY = 'fitmxo.workoutLocation';
let current: PlanLocation = 'gym';
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setWorkoutLocation(location: PlanLocation) {
  current = location;
  emit();
  AsyncStorage.setItem(KEY, location).catch(() => {
    // Non-critical: the choice simply won't be remembered next launch.
  });
}

export function useWorkoutLocation(): PlanLocation {
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    AsyncStorage.getItem(KEY)
      .then((value) => {
        if (value === 'gym' || value === 'home') {
          current = value;
          emit();
        }
      })
      .catch(() => {});
  }, []);
  return useSyncExternalStore(subscribe, () => current);
}
