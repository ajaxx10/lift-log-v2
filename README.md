# Lift Log

A private, local-first progressive web app for tracking workouts and completing a 24-week bench press program.

## Current release: v2.0.0

### Features
- Mobile workout logging by exercise, set, weight, and reps
- Preloaded 24-week bench progression with two weekly sessions
- One-tap loading of prescribed workouts
- Automatic program completion tracking
- Rest timer, history, estimated 1RM, volume, and progress charts
- Offline support and home-screen installation
- JSON backup/restore and CSV export
- Migration from the original `liftLogPwa_v1` browser data

## Deploy with GitHub Pages
1. Upload every file and folder in this project to the repository root.
2. Open repository **Settings → Pages**.
3. Select **Deploy from a branch**, `main`, and `/ (root)`.
4. Open the published HTTPS URL on your phone.

## Local development
Because this app uses JavaScript modules and a service worker, serve it through a local web server rather than opening `index.html` as a file.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure
- `index.html` — application shell
- `src/css/app.css` — visual styles
- `src/js/app.js` — UI and workout workflows
- `src/js/program.js` — bench program generation
- `src/js/storage.js` — persistence and migration
- `src/js/utils.js` — shared utilities
- `service-worker.js` — offline caching
- `legacy-tracker.html` — preserved original tracker

## Roadmap
See `ROADMAP.md`.
