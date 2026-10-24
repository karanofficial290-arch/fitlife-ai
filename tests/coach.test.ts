import { coachTips, type CoachInput } from '../features/coach/coachLogic';

const base: CoachInput = {
  hour: 10,
  waterMl: 0,
  waterGoalMl: 3000,
  calories: 0,
  calorieGoal: 2200,
  proteinG: 0,
  workoutDoneToday: false,
  workoutsThisWeek: 0,
  hasActiveWorkout: false,
};

const ids = (i: CoachInput) => coachTips(i).map((t) => t.id);

describe('coachTips', () => {
  it('suggests training, water and logging meals on a fresh day', () => {
    expect(ids(base)).toEqual(['train', 'water', 'food']);
    expect(coachTips(base)[1]!.title).toBe('12 glass paani aur');
  });

  it('prefers resuming an active workout', () => {
    expect(ids({ ...base, hasActiveWorkout: true })[0]).toBe('resume');
  });

  it('celebrates a finished workout and a met water goal', () => {
    const tips = coachTips({ ...base, workoutDoneToday: true, waterMl: 3200 });
    expect(tips[0]!.id).toBe('done');
    expect(tips[1]!.title).toBe('Paani ka goal poora');
  });

  it('flags calories well above goal', () => {
    expect(coachTips({ ...base, calories: 2700 })[2]!.title).toBe('Calories goal se upar');
  });

  it('nudges protein in the afternoon only when low', () => {
    expect(coachTips({ ...base, hour: 16, calories: 1200, proteinG: 30 })[2]!.title).toBe('Protein thoda kam hai');
    expect(coachTips({ ...base, hour: 16, calories: 1200, proteinG: 80 })[2]!.title).toBe('Khana track par hai');
  });

  it('recommends rest after six workouts in a week', () => {
    expect(ids({ ...base, workoutsThisWeek: 6 })).toContain('rest');
  });
});
