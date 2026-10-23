// Mirrors the database CHECK constraints so users get instant feedback.

export const WEIGHT_MIN_KG = 20;
export const WEIGHT_MAX_KG = 400;
export const WATER_MAX_ML = 5000;

/** Accepts "72", "72.5" or "72,5". Returns kg rounded to 2 decimals, or an error. */
export function parseWeightKg(input: string): { value: number | null; error: string | null } {
  const text = input.trim().replace(',', '.');
  if (!text) return { value: null, error: 'Weight daalein.' };
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(text)) return { value: null, error: 'Sahi number daalein, jaise 72.5' };
  const value = Number(text);
  if (value < WEIGHT_MIN_KG || value > WEIGHT_MAX_KG) {
    return { value: null, error: `Weight ${WEIGHT_MIN_KG}–${WEIGHT_MAX_KG} kg ke beech hona chahiye.` };
  }
  return { value: Math.round(value * 100) / 100, error: null };
}

export function parseWaterMl(input: string): { value: number | null; error: string | null } {
  const text = input.trim();
  if (!text) return { value: null, error: 'Paani ki matra daalein.' };
  if (!/^\d{1,4}$/.test(text)) return { value: null, error: 'Sirf ml mein number daalein, jaise 250' };
  const value = Number(text);
  if (value < 1 || value > WATER_MAX_ML) return { value: null, error: `1–${WATER_MAX_ML} ml ke beech daalein.` };
  return { value, error: null };
}

/** "1.5 L" / "750 ml" */
export function formatWater(ml: number): string {
  if (ml >= 1000) {
    const litres = Math.round((ml / 1000) * 10) / 10;
    return `${litres} L`;
  }
  return `${ml} ml`;
}
