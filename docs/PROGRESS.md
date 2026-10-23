# Progress

Last updated: 2026-10-23

Statuses: Not started · In progress · Implemented · Tested · Blocked

"Tested" here means automated checks passed. Nothing has run on a phone yet — see "Not yet verified".

## M0 Foundation

| Item | Status | Notes |
| --- | --- | --- |
| Supabase project `fitmxo` (ap-south-1, free plan) | Implemented | Created 2026-10-23 |
| `profiles` / `user_preferences` + trigger + RLS | **Tested** | Rolled-back SQL test + security advisor (0 findings) |
| Validation, error mapping, reset-link parsing | **Tested** | Unit tests |
| Auth screens, session persistence, route guards | Implemented | Not yet run on a device |
| Supabase redirect URLs | Implemented | Added by owner (not independently verified) |

## Design pass 1 (owner screens: Home + Workout)

| Item | Status | Notes |
| --- | --- | --- |
| Light green theme from owner designs | Implemented | Replaced dark theme; all text pairs ≥ 4.5:1 contrast |
| Exercise catalog (41) + 16 workout plans, gym and home | **Tested** | Seeded; slug references validated; RLS read-only |
| `workout_sessions`, session exercises, `start_workout_session` RPC | **Tested** | SQL test: start, resume, switch, cross-user isolation, anon blocked |
| `water_logs`, `weight_logs`, profile water/weight goals | **Tested** | SQL test: own rows only |
| Workout tab: today's workout, muscle/level/location filters, recommended, current workout, quick access | Implemented | |
| Plan detail, workout session (sets, rest timer, duration timer, finish/stop), exercise library (search + paging), history (paging) | Implemented | |
| Home: greeting, daily goal bar, today's workout, water ring, weekly minutes chart, current/goal weight, quick actions | Implemented | Real data only |
| Home: calories, steps, nutrition, AI assistant | Not started | Shown as "Jald aa raha hai" — no fake numbers |
| Pure logic (dates, plan picking, weekly minutes, weight/water parsing) | **Tested** | 38 unit tests in total |
| GitHub Actions CI (install, Expo version check, typecheck, lint, Jest) | **Tested** | First run green on `5168eaa` |

## Not yet verified

- No run on an Android device yet (owner has no computer — plan: EAS cloud build → APK).
- Supabase auth flows end to end (needs the app running).

## Later milestones

M1 Onboarding · M3 Diet (calories, nutrition, meals) · M4 Progress tab · M5 Profile & privacy · M6 AI assistant · M7 Release — **Not started**. Steps tracking needs a pedometer permission decision.

## Known limitations

- Photos from the designs are replaced by icons until the owner supplies licensed images.
- Gym/Home choice is stored on the device only (moves to `user_preferences` in M1).
- Weight is kg-only; imperial units come with M5 settings.
- Exercise library search filters only pages already loaded (catalog is small today).

## Next task

Push the CI warning fixes, then EAS cloud build for an installable APK (owner creates a free expo.dev account).
