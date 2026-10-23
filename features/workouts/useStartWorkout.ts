import { router } from 'expo-router';
import { useCallback, useState } from 'react';

import { startWorkout } from './workoutService';

/** Starts (or resumes) a plan on the server, then opens the session screen. */
export function useStartWorkout() {
  const [startingPlanId, setStartingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (planId: string) => {
    setStartingPlanId(planId);
    setError(null);
    const result = await startWorkout(planId);
    setStartingPlanId(null);
    if (result.error || !result.data) {
      setError(result.error ?? 'Workout shuru nahi ho paaya. Dobara try karein.');
      return;
    }
    router.push({ pathname: '/workouts/session/[id]', params: { id: result.data } });
  }, []);

  return { start, startingPlanId, error, clearError: () => setError(null) };
}
