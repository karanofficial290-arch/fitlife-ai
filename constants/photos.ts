import type { ImageSourcePropType } from 'react-native';

import type { MuscleGroup } from '@/features/workouts/types';

// Owner-supplied photos. To add one: put the file in assets/photos/ and point
// the entry at it with require(). Entries left as null show a branded
// gradient placeholder (no third-party images are bundled).

export type PhotoKey =
  | 'homeHero'
  | 'workoutHero'
  | 'shortcutWorkout'
  | 'shortcutDiet'
  | 'shortcutProgress'
  | 'shortcutCoach';

// Cropped from the owner's Home and Workout design images (2026-10-24).
export const photos: Record<PhotoKey, ImageSourcePropType | null> = {
  homeHero: require('../assets/photos/home-hero.jpg'),
  workoutHero: require('../assets/photos/workout-hero.jpg'),
  shortcutWorkout: require('../assets/photos/shortcut-workout.jpg'),
  shortcutDiet: require('../assets/photos/shortcut-diet.jpg'),
  shortcutProgress: null,
  shortcutCoach: require('../assets/photos/shortcut-coach.jpg'),
};

/** One photo per muscle group, used on plan cards; per-plan photos can override. */
export const musclePhotos: Record<MuscleGroup, ImageSourcePropType | null> = {
  chest: require('../assets/photos/plan-chest-basics.jpg'),
  back: null,
  shoulders: null,
  arms: null,
  legs: null,
  core: null,
};

/** Optional photo for a specific plan (by slug), e.g. "home-chest". */
export const planPhotos: Partial<Record<string, ImageSourcePropType>> = {
  'chest-basics': require('../assets/photos/plan-chest-basics.jpg'),
  'chest-triceps': require('../assets/photos/plan-chest-triceps.jpg'),
  'power-chest': require('../assets/photos/plan-power-chest.jpg'),
  'home-chest': require('../assets/photos/plan-home-chest.jpg'),
};

/** Anatomy icons from the owner's Workout design, recoloured for selected / unselected. */
export const muscleIcons: Record<MuscleGroup, { on: ImageSourcePropType; off: ImageSourcePropType }> = {
  chest: { on: require('../assets/muscles/chest-on.png'), off: require('../assets/muscles/chest-off.png') },
  back: { on: require('../assets/muscles/back-on.png'), off: require('../assets/muscles/back-off.png') },
  shoulders: { on: require('../assets/muscles/shoulders-on.png'), off: require('../assets/muscles/shoulders-off.png') },
  arms: { on: require('../assets/muscles/arms-on.png'), off: require('../assets/muscles/arms-off.png') },
  legs: { on: require('../assets/muscles/legs-on.png'), off: require('../assets/muscles/legs-off.png') },
  core: { on: require('../assets/muscles/core-on.png'), off: require('../assets/muscles/core-off.png') },
};
