// Pure validation helpers. Each returns an error message, or null when valid.
// Server-side constraints still apply; these exist for fast, friendly feedback.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_MIN_LENGTH = 8;
export const DISPLAY_NAME_MAX_LENGTH = 60;

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return 'Email daalna zaroori hai.';
  if (!EMAIL_PATTERN.test(value)) return 'Sahi email address daalein.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password daalna zaroori hai.';
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password kam se kam ${PASSWORD_MIN_LENGTH} characters ka hona chahiye.`;
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password mein kam se kam ek letter aur ek number hona chahiye.';
  }
  return null;
}

export function validatePasswordConfirmation(password: string, confirmation: string): string | null {
  if (!confirmation) return 'Password dobara daalein.';
  if (password !== confirmation) return 'Dono passwords match nahi kar rahe.';
  return null;
}

export function validateDisplayName(name: string): string | null {
  const value = name.trim();
  if (!value) return 'Apna naam daalein.';
  if (value.length > DISPLAY_NAME_MAX_LENGTH) {
    return `Naam ${DISPLAY_NAME_MAX_LENGTH} characters se chhota rakhein.`;
  }
  return null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ---------------------------------------------------------------
// Sign-up profile fields
// ---------------------------------------------------------------

export const MIN_AGE_YEARS = 13;

export const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'] as const;
export type Gender = (typeof GENDERS)[number];
export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say',
};

/** Optional Indian-style mobile number: 10 digits, or +country code. Returns normalized value. */
export function parsePhone(input: string): { value: string | null; error: string | null } {
  const digits = input.replace(/[\s-]/g, '');
  if (!digits) return { value: null, error: null };
  if (/^[6-9]\d{9}$/.test(digits)) return { value: `+91${digits}`, error: null };
  if (/^\+\d{10,15}$/.test(digits)) return { value: digits, error: null };
  return { value: null, error: '10 digit mobile number daalein, jaise 98765 43210.' };
}

/** Adds slashes while typing: "14051998" → "14/05/1998". */
export function formatDobInput(input: string): string {
  const d = input.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Parses DD/MM/YYYY into YYYY-MM-DD, enforcing a real date and minimum age. */
export function parseDob(input: string, today: Date = new Date()): { value: string | null; error: string | null } {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input.trim());
  if (!m) return { value: null, error: 'Janam tithi DD/MM/YYYY mein daalein.' };
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || year < 1900) {
    return { value: null, error: 'Ye tarikh sahi nahi hai.' };
  }
  const minBirth = new Date(today.getFullYear() - MIN_AGE_YEARS, today.getMonth(), today.getDate());
  if (date > minBirth) return { value: null, error: `FITMXO use karne ke liye umar kam se kam ${MIN_AGE_YEARS} saal honi chahiye.` };
  const iso = `${m[3]}-${m[2]}-${m[1]}`;
  return { value: iso, error: null };
}

export function isGender(value: string): value is Gender {
  return (GENDERS as readonly string[]).includes(value);
}
