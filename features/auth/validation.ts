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
