# Testing

## Automated checks

```bash
npm run typecheck   # tsc --noEmit, strict
npm run lint        # expo lint
npm test            # jest (tests/**/*.test.ts)
```

Unit tests cover pure logic: input validation, Supabase error mapping, password-reset deep-link parsing, and the greeting helper.

### History

| Date | What ran | Result |
| --- | --- | --- |
| 2026-10-23 | The 4 test files under Node 22 `--experimental-strip-types` with a minimal Jest-compatible shim (npm registry was unreachable, so Jest itself could not be installed) | 17 passed, 0 failed |
| 2026-10-23 | RLS check: two users inserted inside a transaction that was rolled back | Own row visible; other user's row invisible and not updatable; `anon` sees 0 rows |
| 2026-10-23 | Supabase security advisor | 0 findings |
| 2026-10-23 | TypeScript 6.0 strict check of the 4 pure-logic files | 0 errors |
| 2026-10-23 | TypeScript parser over all 34 `.ts`/`.tsx` files (syntax only — React Native/Expo types not installed) | 0 syntax errors |
| — | Full `tsc` with dependencies, ESLint, Jest, app launch | **Not run yet** |

## Manual test script (Android, Expo Go)

1. **Sign up** with a real email → "Email check karein" screen appears → open the email link → sign in.
2. **Wrong password** → "Email ya password galat hai."
3. **Airplane mode + login** → network error message, no crash.
4. **Close and reopen the app** → still signed in (persistent session).
5. **Home** shows greeting + your name. **Profile** shows name + email.
6. **Logout** → back on sign-in screen; reopen app → still signed out.
7. **Forgot password** → email arrives → link opens the app → set new password → sign in with it.
8. Open an **old reset link** → "Link kaam nahi kar raha" with a button to request a new one.
9. Tap through all **5 tabs**; check keyboard does not cover inputs on the auth screens.
