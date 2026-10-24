// Rule-based coaching from the user's own data (no AI provider, no cost).
// Advice stays general and conservative: no diagnoses, no extreme targets.

export type CoachInput = {
  hour: number;
  waterMl: number;
  waterGoalMl: number;
  calories: number;
  calorieGoal: number;
  proteinG: number;
  workoutDoneToday: boolean;
  workoutsThisWeek: number;
  hasActiveWorkout: boolean;
};

export type CoachTip = { id: string; icon: 'water' | 'food-apple' | 'dumbbell' | 'bed' | 'trophy'; title: string; body: string };

export function coachTips(i: CoachInput): CoachTip[] {
  const tips: CoachTip[] = [];

  if (i.hasActiveWorkout) {
    tips.push({ id: 'resume', icon: 'dumbbell', title: 'Workout adhura hai', body: 'Aapka ek workout chal raha hai. Continue karke use poora karein.' });
  } else if (!i.workoutDoneToday) {
    tips.push({
      id: 'train',
      icon: 'dumbbell',
      title: i.hour >= 21 ? 'Kal ka plan banayein' : 'Aaj ka workout baaki hai',
      body: i.hour >= 21 ? 'Raat ho gayi hai — halka stretch karein aur kal subah workout karein.' : 'Neeche diya workout shuru karein. Pehle 5 minute warm-up zaroor karein.',
    });
  } else {
    tips.push({ id: 'done', icon: 'trophy', title: 'Aaj ka workout ho gaya', body: 'Shabaash! Muscles ko recover hone dein — achhi neend aur protein zaroori hai.' });
  }

  const waterLeft = Math.max(0, i.waterGoalMl - i.waterMl);
  if (waterLeft > 0) {
    const glasses = Math.ceil(waterLeft / 250);
    tips.push({ id: 'water', icon: 'water', title: `${glasses} glass paani aur`, body: `Goal tak ${waterLeft} ml baaki hai. Thoda-thoda karke din bhar piyein.` });
  } else {
    tips.push({ id: 'water', icon: 'water', title: 'Paani ka goal poora', body: 'Badhiya! Garmi ya workout ke din thoda zyada pee sakte hain.' });
  }

  if (i.calories === 0) {
    tips.push({ id: 'food', icon: 'food-apple', title: 'Meals log karein', body: 'Aaj ka khana log karenge toh calories aur protein ka hisaab yahan dikhega.' });
  } else if (i.calories > i.calorieGoal * 1.15) {
    tips.push({ id: 'food', icon: 'food-apple', title: 'Calories goal se upar', body: 'Aaj goal se zyada ho gaya hai. Agle meal mein sabzi aur protein zyada, tala hua kam rakhein.' });
  } else if (i.proteinG < 50 && i.hour >= 15) {
    tips.push({ id: 'food', icon: 'food-apple', title: 'Protein thoda kam hai', body: 'Dal, paneer, dahi, anda ya chicken jaise protein waale khane shaamil karein.' });
  } else {
    tips.push({ id: 'food', icon: 'food-apple', title: 'Khana track par hai', body: 'Isi tarah balanced khana rakhein — har meal mein protein aur sabzi.' });
  }

  if (i.workoutsThisWeek >= 6) {
    tips.push({ id: 'rest', icon: 'bed', title: 'Rest day bhi zaroori hai', body: 'Is hafte bahut training hui hai. Hafte mein kam se kam ek din aaram karein.' });
  }

  return tips;
}
