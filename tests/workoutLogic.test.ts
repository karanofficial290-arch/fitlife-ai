import type { SessionSummary, WorkoutPlan } from '../features/workouts/types';
import {
  completedToday,
  filterPlans,
  formatPrescription,
  nextExerciseIndex,
  pickTodaysPlan,
  weeklyWorkoutMinutes,
} from '../features/workouts/workoutLogic';

const plan = (slug: string, muscle: string, level: string, location: string): WorkoutPlan => ({
  id: slug,
  slug,
  name: slug,
  description: 'x',
  muscle_group: muscle,
  level,
  location,
  estimated_minutes: 30,
  exercise_count: 4,
});

const plans = [
  plan('chest-basics', 'chest', 'beginner', 'gym'),
  plan('chest-triceps', 'chest', 'intermediate', 'gym'),
  plan('home-chest', 'chest', 'intermediate', 'home'),
  plan('leg-day', 'legs', 'intermediate', 'gym'),
];

describe('filterPlans', () => {
  it('filters by location, muscle and level', () => {
    expect(filterPlans(plans, { muscle: 'all', level: 'all', location: 'gym' }).map((p) => p.slug)).toEqual([
      'chest-basics',
      'chest-triceps',
      'leg-day',
    ]);
    expect(filterPlans(plans, { muscle: 'chest', level: 'intermediate', location: 'gym' }).map((p) => p.slug)).toEqual([
      'chest-triceps',
    ]);
    expect(filterPlans(plans, { muscle: 'legs', level: 'all', location: 'home' })).toEqual([]);
  });
});

describe('pickTodaysPlan', () => {
  it('is stable for a day and only uses the chosen location', () => {
    const morning = pickTodaysPlan(plans, new Date(2026, 9, 23, 7), 'gym');
    const night = pickTodaysPlan(plans, new Date(2026, 9, 23, 22), 'gym');
    expect(morning?.slug).toBe(night?.slug);
    expect(morning?.location).toBe('gym');
    expect(pickTodaysPlan(plans, new Date(2026, 9, 23), 'home')?.slug).toBe('home-chest');
  });

  it('rotates across consecutive days', () => {
    const a = pickTodaysPlan(plans, new Date(2026, 9, 23), 'gym')?.slug;
    const b = pickTodaysPlan(plans, new Date(2026, 9, 24), 'gym')?.slug;
    expect(a === b).toBe(false);
  });

  it('returns null when nothing matches', () => {
    expect(pickTodaysPlan([], new Date(), 'gym')).toBeNull();
  });
});

const session = (started: Date, minutes: number | null, status = 'completed'): SessionSummary => ({
  id: String(started.getTime()),
  plan_id: null,
  plan_name: 'x',
  status,
  started_at: started.toISOString(),
  ended_at: minutes == null ? null : new Date(started.getTime() + minutes * 60000).toISOString(),
});

describe('weeklyWorkoutMinutes', () => {
  it('sums completed minutes per weekday of the current week only', () => {
    const now = new Date(2026, 9, 23, 20); // Friday
    const sessions = [
      session(new Date(2026, 9, 19, 7), 40), // Mon
      session(new Date(2026, 9, 19, 18), 20), // Mon again
      session(new Date(2026, 9, 21, 7), 35), // Wed
      session(new Date(2026, 9, 22, 7), null, 'in_progress'), // ignored
      session(new Date(2026, 9, 22, 9), 30, 'abandoned'), // ignored
      session(new Date(2026, 9, 18, 7), 50), // previous Sunday: ignored
    ];
    expect(weeklyWorkoutMinutes(sessions, now)).toEqual([60, 0, 35, 0, 0, 0, 0]);
  });
});

describe('completedToday', () => {
  it('detects a workout finished today', () => {
    const now = new Date(2026, 9, 23, 20);
    expect(completedToday([session(new Date(2026, 9, 23, 7), 30)], now)).toBe(true);
    expect(completedToday([session(new Date(2026, 9, 22, 7), 30)], now)).toBe(false);
    expect(completedToday([session(new Date(2026, 9, 23, 7), null, 'in_progress')], now)).toBe(false);
  });
});

describe('session helpers', () => {
  it('finds the next unfinished exercise', () => {
    expect(nextExerciseIndex([{ completed_at: 'x' }, { completed_at: null }, { completed_at: null }])).toBe(1);
    expect(nextExerciseIndex([{ completed_at: 'x' }])).toBe(-1);
  });

  it('formats sets × reps or seconds', () => {
    expect(formatPrescription(3, 12, null)).toBe('3 × 12 reps');
    expect(formatPrescription(3, null, 30)).toBe('3 × 30 sec');
  });
});
