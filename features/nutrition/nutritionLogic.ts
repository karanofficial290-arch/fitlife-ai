// Pure nutrition maths (unit tested).

export type MealMacros = { calories: number; protein_g: number; carbs_g: number; fat_g: number };

export type DaySummary = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  /** Share of energy from each macro, 0..100, rounded so they add up to 100 (or all 0). */
  percent: { protein: number; carbs: number; fat: number };
};

const KCAL_PER_G = { protein: 4, carbs: 4, fat: 9 } as const;

const round1 = (n: number) => Math.round(n * 10) / 10;

export function summarizeMeals(meals: readonly MealMacros[]): DaySummary {
  const total = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (Number(m.calories) || 0),
      protein_g: acc.protein_g + (Number(m.protein_g) || 0),
      carbs_g: acc.carbs_g + (Number(m.carbs_g) || 0),
      fat_g: acc.fat_g + (Number(m.fat_g) || 0),
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  const kcal = {
    protein: total.protein_g * KCAL_PER_G.protein,
    carbs: total.carbs_g * KCAL_PER_G.carbs,
    fat: total.fat_g * KCAL_PER_G.fat,
  };
  const macroKcal = kcal.protein + kcal.carbs + kcal.fat;

  let percent = { protein: 0, carbs: 0, fat: 0 };
  if (macroKcal > 0) {
    const protein = Math.round((kcal.protein / macroKcal) * 100);
    const carbs = Math.round((kcal.carbs / macroKcal) * 100);
    percent = { protein, carbs, fat: Math.max(0, 100 - protein - carbs) };
  }

  return {
    calories: Math.round(total.calories),
    protein_g: round1(total.protein_g),
    carbs_g: round1(total.carbs_g),
    fat_g: round1(total.fat_g),
    percent,
  };
}

/** "1,350" style thousands separator without depending on device locale. */
export function formatNumber(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
