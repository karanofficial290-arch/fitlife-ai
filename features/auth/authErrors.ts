// Converts Supabase / network errors into short, user-friendly messages.
// Kept free of Supabase imports so it can be unit tested in isolation.

type ErrorLike = { code?: unknown; message?: unknown; name?: unknown; status?: unknown };

const MESSAGES_BY_CODE: Record<string, string> = {
  invalid_credentials: 'Email ya password galat hai.',
  email_not_confirmed: 'Pehle apna email verify karein — inbox check karein.',
  user_already_exists: 'Is email se account pehle se bana hua hai. Login karein.',
  email_exists: 'Is email se account pehle se bana hua hai. Login karein.',
  weak_password: 'Password zyada strong rakhein.',
  same_password: 'Naya password purane se alag hona chahiye.',
  over_email_send_rate_limit: 'Bahut saari emails bheji gayi hain. Thodi der baad try karein.',
  over_request_rate_limit: 'Bahut saari requests. Thodi der baad try karein.',
  otp_expired: 'Link expire ho gaya hai. Naya link mangwayein.',
  session_not_found: 'Session khatam ho gaya. Dobara login karein.',
  signup_disabled: 'Abhi naye accounts nahi ban sakte.',
};

export const GENERIC_ERROR = 'Kuch gadbad ho gayi. Dobara try karein.';
export const NETWORK_ERROR = 'Internet connection check karein aur dobara try karein.';

export function mapAuthError(error: unknown): string {
  if (!error || typeof error !== 'object') return GENERIC_ERROR;
  const { code, message, name } = error as ErrorLike;

  if (typeof code === 'string' && MESSAGES_BY_CODE[code]) {
    return MESSAGES_BY_CODE[code];
  }

  const text = typeof message === 'string' ? message.toLowerCase() : '';
  if (
    name === 'AuthRetryableFetchError' ||
    text.includes('network request failed') ||
    text.includes('failed to fetch')
  ) {
    return NETWORK_ERROR;
  }
  if (text.includes('invalid login credentials')) return MESSAGES_BY_CODE.invalid_credentials!;
  if (text.includes('email not confirmed')) return MESSAGES_BY_CODE.email_not_confirmed!;

  return GENERIC_ERROR;
}
