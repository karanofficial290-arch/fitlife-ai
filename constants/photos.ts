import type { ImageSourcePropType } from 'react-native';

import type { MuscleGroup } from '@/features/workouts/types';

// Owner-supplied photos. Put the file in assets/photos/ and replace `null`
// with require('../assets/photos/<file>.jpg'). Until then a branded
// gradient placeholder is shown (no third-party images are bundled).

export type PhotoKey =
  | 'homeHero'
  | 'workoutHero'
  | 'shortcutWorkout'
  | 'shortcutDiet'
  | 'shortcutProgress'
  | 'shortcutCoach';

export const photos: Record<PhotoKey, ImageSourcePropType | null> = {
  homeHero: null,
  workoutHero: null,
  shortcutWorkout: null,
  shortcutDiet: null,
  shortcutProgress: null,
  shortcutCoach: null,
};

/** One photo per muscle group, used on plan cards; per-plan photos can override. */
export const musclePhotos: Record<MuscleGroup, ImageSourcePropType | null> = {
  chest: null,
  back: null,
  shoulders: null,
  arms: null,
  legs: null,
  core: null,
};

/** Optional photo for a specific plan (by slug), e.g. "home-chest". */
export const planPhotos: Partial<Record<string, ImageSourcePropType>> = {};
