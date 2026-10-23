# Progress

Last updated: 2026-10-23

Statuses: Not started · In progress · Implemented · Tested · Blocked

## M0 Foundation

| Item | Status | Notes |
| --- | --- | --- |
| Supabase project `fitmxo` (ap-south-1, free plan) | Implemented | Created 2026-10-23 |
| `profiles` / `user_preferences` + trigger + RLS | **Tested** | Rolled-back SQL test + security advisor (0 findings) |
| Generated DB types | Implemented | `types/database.ts` |
| Validation, error mapping, reset-link parsing, greeting | **Tested** | 17 unit tests passed (run via Node's built-in TS, not Jest — see TESTING.md) |
| Expo config, tsconfig, ESLint, Jest, EAS profiles | Implemented | Not yet installed/run — npm unreachable from the build session |
| Theme + UI components | Implemented | Not yet run on a device |
| Sign up / login / logout / forgot + reset password | Implemented | Not yet run end to end |
| Persistent session + route guards | Implemented | Not yet run on a device |
| 5-tab navigation with honest "coming soon" states | Implemented | Not yet run on a device |
| Supabase redirect URLs (`fitmxo://**`, `exp://**`) | Implemented | Added by owner in dashboard on 2026-10-23 (not independently verified) |
| `npm install`, typecheck, lint, Jest, app launch | **Blocked** | Needs a machine with npm access |

## Later milestones

M1 Onboarding · M2 Workouts · M3 Diet · M4 Progress · M5 Profile & privacy · M6 AI · M7 Release — all **Not started**.

## Known limitations

- Package versions in `package.json` were written without registry access; run `npx expo install --fix` after the first install.
- Home and Profile each fetch the profile separately (fine for now; share via a cache in M4).
- Sign-up consent text is a placeholder until a real privacy policy exists (M7).

## Next task

Owner runs the first install on a computer (see TESTING.md), then M1 Onboarding.
