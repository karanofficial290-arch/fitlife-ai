import { parseAuthCallbackUrl } from '../features/auth/authLinks';

describe('parseAuthCallbackUrl', () => {
  it('returns none for missing or plain URLs', () => {
    expect(parseAuthCallbackUrl(null)).toEqual({ kind: 'none' });
    expect(parseAuthCallbackUrl('fitmxo://reset-password')).toEqual({ kind: 'none' });
  });

  it('extracts tokens from the URL fragment', () => {
    const result = parseAuthCallbackUrl(
      'fitmxo://reset-password#access_token=AT&expires_in=3600&refresh_token=RT&token_type=bearer&type=recovery',
    );
    expect(result).toEqual({ kind: 'session', accessToken: 'AT', refreshToken: 'RT', type: 'recovery' });
  });

  it('works with Expo Go style URLs', () => {
    const result = parseAuthCallbackUrl('exp://192.168.1.5:8081/--/reset-password#access_token=A&refresh_token=R');
    expect(result).toMatchObject({ kind: 'session', accessToken: 'A', refreshToken: 'R' });
  });

  it('reports expired links in friendly language', () => {
    const result = parseAuthCallbackUrl(
      'fitmxo://reset-password#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid',
    );
    expect(result.kind).toBe('error');
    if (result.kind === 'error') expect(result.message).toContain('expire');
  });

  it('reports other errors from the query string', () => {
    const result = parseAuthCallbackUrl('fitmxo://reset-password?error=server_error&error_description=Something+broke');
    expect(result).toEqual({ kind: 'error', message: 'Something broke' });
  });

  it('ignores a token pair that is incomplete', () => {
    expect(parseAuthCallbackUrl('fitmxo://reset-password#access_token=only')).toEqual({ kind: 'none' });
  });
});
