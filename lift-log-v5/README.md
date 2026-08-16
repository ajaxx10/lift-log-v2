# Lift Log v5.0.0

A private, offline-first Progressive Web App for a 24-week athletic strength program. Bench press is the primary performance goal, with three core workout types (Chest & Triceps, Back & Biceps, Legs) plus an optional Upper Strength day.

## New in v5

- Adaptive progression that uses current performance plus recent sessions to increase, repeat, or deload a lift
- Plain-language "Why" explanations for recommendations
- 24-week bench roadmap with current week, heavy/volume targets, e1RM, progress, and deload timing
- Previous-session weights and reps shown inside the active workout
- One-tap "Use last session" for an exercise
- Exercise detail pages with e1RM trend, PR, volume, recommendation, and recent sessions
- Coaching note on the Today dashboard
- Bodyweight tracking for future relative-strength metrics
- Existing custom Other exercises remain fully supported

## Data preservation

This release intentionally keeps the existing localStorage keys `liftLogDataV4` and `liftLogSettingsV4`. Existing workout history loads in place. The existing one-time safety snapshot key `liftLogDataV4PreCustomUpdateBackup` is also preserved. Deploy over the same GitHub Pages site and continue using the same browser/home-screen installation to keep local history.

Before any deployment, using **Settings → Export full backup** is still recommended.

## Deploy on GitHub Pages

Upload the contents of this folder over the files in the root of your existing repository. Do not create a new repository. GitHub Pages can continue using **Settings → Pages → Deploy from a branch → main → /(root)**.
