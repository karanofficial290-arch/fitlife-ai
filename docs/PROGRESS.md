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
| Home: calories, steps, nutrition, AI assistant | Superseded | See design pass 2 |
| Pure logic (dates, plan picking, weekly minutes, weight/water parsing) | **Tested** | 38 unit tests in total |
| GitHub Actions CI (install, Expo version check, typecheck, lint, Jest) | **Tested** | First run green on `5168eaa` |

## Design pass 2 — FITMXO brief (2026-10-24), step 1 of 4: Home + Workout

| Item | Status | Notes |
| --- | --- | --- |
| FITMXO branding: name, tagline, logo mark, colors #079669 / #10233F / #F5F8FA | Implemented | Buttons use 19px bold labels so white-on-green meets AA large-text |
| Welcome splash from owner artwork (animated lime loading bar, min 1.5 s, fades into app) | Implemented | `assets/splash/welcome.jpg` cropped from owner's design |
| X logo (vector, from owner design) in header, auth screens | Implemented | |
| Login screen per owner design: email, password show/hide, Remember me, Forgot password, Sign Up link | Implemented | Remember me off → session cleared on next app launch |
| Sign Up per owner design: name, email, mobile (optional), password, DOB (13+), gender, Terms checkbox | Implemented | Profile fields saved by DB trigger; malformed values stored as NULL (SQL-tested) |
| Login with mobile number; Google / Apple / Facebook buttons | Not started | Need SMS provider / OAuth apps set up by owner — not shown until they work |
| Terms & Privacy Policy screens | Implemented (DRAFT) | Owner must review; support email placeholder |
| Photo slots + `constants/photos.ts` registry | Implemented | Owner will send photos; branded gradient placeholder until then |
| `meal_logs` table + `calorie_goal` / `step_goal` on profile | **Tested** | RLS SQL test: own rows only, anon 0 |
| Home: hero, today's workout, calories/water/steps rings, nutrition donut, weekly chart, weight tiles, 4 shortcuts, 4 quick actions | Implemented | Log Meal sheet saves real meals |
| Steps | Blocked | Needs Health Connect (planned with Progress); card shows "—" and explains, no fake number |
| AI Coach | Implemented (rule-based) | Uses the user's own data; real AI chat needs owner approval for provider cost |
| Workout: photo hero, muscle tiles, level filter, Gym/Home, photo plan cards, current workout, library/history | Implemented | |
| Unit tests | **Tested** | 51 passing (nutrition, meal form, coach added) |

Next steps in order: **Diet** (7-day veg/non-veg plan, meals, logging) → **Progress** (charts, calendar, 30-day challenge, streaks, Health Connect steps) → **Profile** (fitness profile, preferences, reminders, account).

## Device builds

| Item | Status | Notes |
| --- | --- | --- |
| Expo account, org `fitmxos-team`, project `fitmxo` | Implemented | Created by owner on expo.dev |
| `app.json` owner + projectId, `eas.json` profiles | Implemented | |
| GitHub Actions "Android build (EAS)" workflow | **Tested** | First APK built 2026-10-24 (build 397d344f); owner installed and opened it |

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

Owner adds `EXPO_TOKEN` secret → run "Android build (EAS)" with `preview` → install APK and walk through the manual test script in TESTING.md.
