# FitMxo (FitLife AI)

All-in-one fitness app for Android — workouts, diet, progress tracking and an AI fitness assistant.

- **App name:** FitMxo
- **Android package:** `com.fitmxo.fitlifeai` (permanent once published)
- **Stack:** Expo (SDK 54) · React Native · TypeScript · Expo Router · Supabase (Auth + Postgres + RLS) · EAS Build

Current status: **Milestone M0 (foundation)** — see [docs/PROGRESS.md](docs/PROGRESS.md).

## Setup

Requirements: Node.js 20+ and the Expo Go app (or an Android emulator).

```bash
git clone https://github.com/karanofficial290-arch/fitlife-ai.git
cd fitlife-ai
npm install
npx expo install --fix     # aligns every package to the installed Expo SDK
cp .env.example .env       # then fill in the two values (see below)
npm run check              # typecheck + lint + unit tests
npx expo start             # scan the QR code with Expo Go
```

### Environment variables

| Variable | Where to find it |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same page → **Publishable** key (`sb_publishable_…`) |

Only the publishable key belongs in the app. **Never** put the `service_role` / secret key in `.env` or source code.

### Supabase auth settings (one-time, in the dashboard)

Authentication → URL Configuration → **Redirect URLs**, add:

- `fitmxo://**` (installed app)
- `exp://**` (Expo Go during development)

Without these, password-reset and email-confirmation links cannot open the app.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run typecheck` | TypeScript, strict mode |
| `npm run lint` | ESLint (Expo config) |
| `npm test` | Jest unit tests in `tests/` |
| `npm run check` | All three of the above |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Development plan](docs/DEVELOPMENT_PLAN.md)
- [Progress tracker](docs/PROGRESS.md)
- [Testing](docs/TESTING.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
