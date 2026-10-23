# Architecture

## Folder layout

```
app/                  Expo Router screens (file = route)
  _layout.tsx         Root: AuthProvider + protected route groups
  (auth)/             sign-in, sign-up, forgot-password (signed-out only)
  (tabs)/             Home, Workout, Diet, Progress, Profile (signed-in only)
  reset-password.tsx  Opened from the reset email; works in either state
components/ui/        Reusable, presentation-only components
constants/theme.ts    Colours, spacing, radius, typography
features/<feature>/   Business logic per feature (services, hooks, providers)
services/supabase.ts  The single Supabase client
types/database.ts     Generated from the live schema — do not hand-edit
utils/                Small pure helpers
tests/                Jest unit tests
supabase/migrations/  Version-controlled SQL, applied in filename order
docs/                 Project documentation
```

Rules: screens call feature services/hooks, never Supabase directly. Validation and error mapping are pure functions so they can be unit tested.

## Navigation and auth

`AuthProvider` restores the session from AsyncStorage on launch and listens to `onAuthStateChange`. The root `Stack` uses `Stack.Protected` guards, so signing in or out moves the user between `(auth)` and `(tabs)` automatically — screens never navigate after login/logout themselves.

Password reset uses Supabase's implicit flow: the email link redirects to `fitmxo://reset-password#access_token=…&refresh_token=…`. `features/auth/authLinks.ts` parses that URL and `setSession` signs the user in before the new password is saved.

### Other routes (signed-in only)

`app/workouts/plan/[id]`, `app/workouts/session/[id]`, `app/workouts/exercises`, `app/workouts/history` — stack screens opened from the Home and Workout tabs. (Folder is `workouts/` so it never clashes with the `(tabs)/workout` tab URL.)

Screens refresh their data on focus via `hooks/useFocusLoader`; long lists page through `hooks/usePagedList` (20 rows per page).

## Data and security

| Table | Purpose | RLS |
| --- | --- | --- |
| `profiles` | Display name, onboarding status, water goal, goal weight | select/update own row only |
| `user_preferences` | Units, notification toggle (1 row per user) | select/update own row only |
| `exercises` | Shared catalog (slug, muscle group, equipment, gym/home/both, level, how-to) | read-only for signed-in users |
| `workout_plans`, `workout_plan_exercises` | Shared plans with ordered exercises (sets, reps or seconds, rest) | read-only for signed-in users |
| `workout_sessions` | A user's workout run: plan name snapshot, status, start/end | select/insert/update own |
| `workout_session_exercises` | Exercises copied into a session; `completed_at` per exercise | via owning session |
| `water_logs` | Water entries (ml, timestamp) | select/insert/delete own |
| `weight_logs` | One weight per user per local day | select/insert/update/delete own |

- `start_workout_session(plan_id)` (security invoker, so RLS applies) creates the session and copies the plan's exercises atomically. Same plan → resumes; different plan → the old one is marked abandoned. A partial unique index allows only one in-progress workout per user.
- Catalog rows are seeded by `20261023100100_seed_workout_catalog.sql`, referencing each other by slug.

- Both rows are created by the `on_auth_user_created` trigger (`security definer`, empty `search_path`, execute revoked from API roles). Clients cannot insert or delete them directly.
- Deleting the `auth.users` row cascades to all user data — this is the basis for account deletion (M5).
- Authorization is enforced in Postgres via RLS; the app's own checks are only for UX.
- Verified on 2026-10-23 with a rolled-back SQL test: user A could read only their own row, could not update user B's row (0 rows affected), and the `anon` role saw 0 rows. Supabase security advisor: 0 findings.

### Changing the schema

1. Add a new file `supabase/migrations/<YYYYMMDDHHMMSS>_<name>.sql` (never edit applied ones).
2. Apply it to the Supabase project.
3. Regenerate `types/database.ts`.
4. Run the security advisor and confirm every new private table has RLS.

## Secrets

- `.env` is git-ignored; `.env.example` holds placeholders only.
- EAS cloud builds do **not** read the local `.env`. Set the same two `EXPO_PUBLIC_*` variables in EAS environment variables (expo.dev → project → Environment variables) before building.
- AI provider keys (M6) will live only in Supabase Edge Function secrets, never in the app.

## Decisions

| Decision | Reason |
| --- | --- |
| Expo SDK 54 | Last SDK whose exact versions could be pinned from memory while npm was unreachable; `npx expo install --fix` aligns everything on first install. Re-evaluate before release. |
| AsyncStorage for the session | Supabase's documented React Native setup; SecureStore has a ~2 KB value limit that session JSON can exceed. |
| Light green UI | Owner's Home/Workout designs (2026-10-23) replaced the original dark brief. Tokens in `constants/theme.ts`. |
| No stock photos | Design photos replaced by icons until owner supplies images they have rights to. |
| Charts without a chart library | Rings use `react-native-svg`; the weekly bars are plain Views. |
| "Today's workout" | Rotates daily through plans for the chosen location (`pickTodaysPlan`); replaced by goal-based plans after onboarding. |
| Daily goal % on Home | Average of water progress and "workout done today". Diet/steps join when built. |
| UI copy in Hinglish | Matches the target audience; easy to move to i18n later. |
