// Parses the deep link Supabase redirects to after a password-reset email.
// Implicit flow puts tokens in the URL fragment:
//   fitmxo://reset-password#access_token=...&refresh_token=...&type=recovery
// Errors arrive as error / error_code / error_description in query or fragment.

export type AuthCallbackResult =
  | { kind: 'session'; accessToken: string; refreshToken: string; type: string | null }
  | { kind: 'error'; message: string }
  | { kind: 'none' };

function readParams(url: string): URLSearchParams {
  const params = new URLSearchParams();
  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');

  if (queryIndex !== -1) {
    const end = hashIndex !== -1 && hashIndex > queryIndex ? hashIndex : url.length;
    new URLSearchParams(url.slice(queryIndex + 1, end)).forEach((v, k) => params.set(k, v));
  }
  if (hashIndex !== -1) {
    // Fragment values win: that is where Supabase puts tokens.
    new URLSearchParams(url.slice(hashIndex + 1)).forEach((v, k) => params.set(k, v));
  }
  return params;
}

export function parseAuthCallbackUrl(url: string | null | undefined): AuthCallbackResult {
  if (!url) return { kind: 'none' };
  const params = readParams(url);

  const errorDescription = params.get('error_description') ?? params.get('error');
  if (errorDescription) {
    const code = params.get('error_code');
    return {
      kind: 'error',
      message:
        code === 'otp_expired'
          ? 'Ye link expire ho gaya hai. Naya reset link mangwayein.'
          : errorDescription.replace(/\+/g, ' '),
    };
  }

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (accessToken && refreshToken) {
    return { kind: 'session', accessToken, refreshToken, type: params.get('type') };
  }
  return { kind: 'none' };
}
