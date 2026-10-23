import type { IconName } from '@/components/ui/IconBadge';

export const MUSCLE_GROUPS = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type Level = (typeof LEVELS)[number];

export type PlanLocation = 'gym' | 'home';

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  arms: 'Arms',
  legs: 'Legs',
  core: 'Core',
};

export const MUSCLE_ICONS: Record<MuscleGroup, IconName> = {
  chest: 'weight-lifter',
  back: 'rowing',
  shoulders: 'kettlebell',
  arms: 'arm-flex',
  legs: 'run',
  core: 'yoga',
};

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function isMuscleGroup(value: string): value is MuscleGroup {
  return (MUSCLE_GROUPS as readonly string[]).includes(value);
}

export function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}

export type WorkoutPlan = {
  id: string;
  slug: string;
  name: string;
  description: string;
  muscle_group: string;
  level: string;
  location: string;
  estimated_minutes: number;
  exercise_count: number;
};

export type PlanFilters = {
  muscle: MuscleGroup | 'all';
  level: Level | 'all';
  location: PlanLocation;
};

export type SessionSummary = {
  id: string;
  plan_id: string | null;
  plan_name: string;
  status: string;
  started_at: string;
  ended_at: string | null;
};
