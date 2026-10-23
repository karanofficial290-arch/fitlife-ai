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
| 2026-10-23 | 7 test files (38 tests) via the same Node shim | 38 passed, 0 failed |
| 2026-10-23 | RLS + RPC test for workouts, water, weight (rolled back) | Start/resume/switch correct; user B saw 0 of A's rows and could not update or insert into A's session; anon blocked from catalog and RPC |
| 2026-10-23 | Seed validation script | 41 exercises, 16 plans, 68 plan rows; no broken slugs; home plans use no gym-only exercises |
| 2026-10-23 | Supabase advisors | Security: 0. Performance: only "unused index" (INFO) on a brand-new database |
| 2026-10-23 | Parser over 72 `.ts`/`.tsx` files; local import/export resolution script | 0 syntax errors; all imports resolve |
| 2026-10-23 | **GitHub Actions CI** on commit `5168eaa` (run 39939400846): npm install, `tsc`, ESLint, Jest | **All passed.** Warnings: `react-native` should be 0.81.5 (fixed next commit); actions on deprecated Node 20 (bumped to v5 / Node 22) |
| 2026-10-23 | First EAS preview build (c64a2c15) | **Failed** at `npm ci`: unpinned `react-dom` resolved to 19.3.1, conflicting with `react` 19.1.0. Fix: pin `react-dom` 19.1.0; CI now runs `npm ci --include=dev` like EAS |
| 2026-10-23 | EAS preview build 1d8d56c4 | **Failed** at Gradle: `EAS_BUILD_UNKNOWN_GRADLE_ERROR` |
| 2026-10-23 | Android compile check on GitHub (prebuild + `gradlew assembleRelease`) | Found cause: `@expo/vector-icons` pulled `expo-font@58.0.9` (newer SDK; versionless `android.publication`). Fix: pin `expo-font ~14.0.12` + npm override; `scripts/check-expo-modules.js` now runs in CI |
| — | App launch on an Android device | **Not run yet** |

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
10. **Workout tab:** change muscle group, level, Gym/Home → list updates; Home tab's "Today's Workout" follows the Gym/Home choice.
11. **Start Workout** → session opens; tap set buttons → rest timer appears and can be skipped; plank shows a seconds timer.
12. Leave the session, come back → **Current Workout** card shows progress; Continue resumes it.
13. Finish all exercises → trophy summary; it appears in **Workout History** and in Home's weekly chart.
14. Stop a workout with 0 exercises done → shows as "Stopped", not counted in the weekly chart.
15. **Home water:** tap +250 → ring updates; custom 0 or 6000 ml → validation error.
16. **Weight:** add 72.5 → shown on Home; add again same day → value replaced, not duplicated; set goal weight.
17. Airplane mode on Home → error with retry; turn back on → retry works.
