import { GENERIC_ERROR, mapAuthError, NETWORK_ERROR } from '../features/auth/authErrors';

describe('mapAuthError', () => {
  it('maps known Supabase error codes', () => {
    expect(mapAuthError({ code: 'invalid_credentials', message: 'x' })).toBe('Email ya password galat hai.');
    expect(mapAuthError({ code: 'user_already_exists' })).toContain('pehle se');
  });

  it('detects network failures', () => {
    expect(mapAuthError({ name: 'AuthRetryableFetchError', message: 'fetch failed' })).toBe(NETWORK_ERROR);
    expect(mapAuthError(new TypeError('Network request failed'))).toBe(NETWORK_ERROR);
  });

  it('falls back to message matching for older error shapes', () => {
    expect(mapAuthError({ message: 'Invalid login credentials' })).toBe('Email ya password galat hai.');
  });

  it('never leaks raw unknown errors', () => {
    expect(mapAuthError({ code: 'something_new', message: 'internal detail' })).toBe(GENERIC_ERROR);
    expect(mapAuthError(null)).toBe(GENERIC_ERROR);
    expect(mapAuthError('boom')).toBe(GENERIC_ERROR);
  });
});
