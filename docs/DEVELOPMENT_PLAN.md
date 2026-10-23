# Development plan

| Milestone | Scope | Depends on |
| --- | --- | --- |
| **M0 Foundation** | Expo + TS + Router, dark theme, 5 tabs, Supabase auth (sign up, login, logout, reset, persistent session), `profiles` + `user_preferences` with RLS, docs, unit tests | — |
| M1 Onboarding | Welcome, goal, age/height/weight, experience, gym/home, diet preference, privacy consent; store in DB | M0 |
| M2 Workouts | Exercise library (6 muscle groups), plans by level and location, sets/reps/rest, timer, session tracking, history | M1 |
| M3 Diet | Food items, search, meal logs (4 meals), calories/macros, daily summary, custom foods, water logs | M1 |
| M4 Progress + Home | Weight logs, goals, weekly/monthly charts; real Home dashboard data | M2, M3 |
| M5 Profile & privacy | Edit profile, units, notifications, privacy settings, data export, **account deletion** (Edge Function) | M1 |
| M6 AI assistant | Edge Function proxy to an AI provider (needs owner approval for cost), safety rules, rate limiting | M5 |
| M7 Release | Icon, splash, privacy policy, Data Safety form, content rating, EAS production AAB, device testing | All |

Each milestone ends with: typecheck, lint, tests, security advisor, docs update, and owner approval before any push.
