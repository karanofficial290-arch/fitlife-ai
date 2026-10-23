# Android release checklist

Nothing here is complete yet. Play Store requirements change — re-check each item against current Google Play policy at release time.

## App configuration
- [x] Application ID `com.fitmxo.fitlifeai` set (permanent after first upload)
- [x] `version` 0.1.0 / `versionCode` 1 set in `app.json`
- [ ] Final app icon (adaptive icon foreground/background) and splash screen
- [ ] Android permissions reviewed — currently none requested; add only what a feature needs
- [ ] Target API level meets Google Play's current requirement (verify the Expo SDK in use)
- [ ] HTTPS only (Supabase is HTTPS; no cleartext traffic)

## Accounts and data
- [x] Sign up / login / logout / password reset implemented (device test pending)
- [ ] In-app account deletion (Play requirement for apps with accounts) — M5
- [ ] Web page/link for account deletion requests (required in the Data Safety form)
- [ ] Data export — M5

## Legal and Play Console (owner)
- [ ] Privacy policy hosted at a public URL
- [ ] Data Safety form (email, name, health & fitness data, etc.)
- [ ] Content rating questionnaire
- [ ] Health apps declaration if Play Console asks for it
- [ ] Store listing: title, descriptions, screenshots, feature graphic
- [ ] Google Play developer account and app created

## Build and signing
- [ ] EAS project linked (`eas init`) — owner's Expo account
- [ ] EAS environment variables set for `production`
- [ ] Play App Signing enabled; upload key managed by EAS
- [ ] `eas build -p android --profile production` produces an `.aab`
- [ ] Tested on at least one physical Android device
- [ ] Internal testing track before production

**Publishing or submitting requires explicit owner approval.**
