# Financial Forecast

See your balance days and weeks ahead. Schedule the income and expenses you already
know about, and the app projects a running balance across a calendar — then summarizes
your outlook as **financial weather**: ☀️ Clear Skies, ⛅ Partly Cloudy, or 🌧️ Storm Warning.

![icon](public/icon.svg)

## Features

- **Forecast calendar** — every day shows a projected balance plus color-coded
  transaction chips (Rent, Groceries, Paycheck, Gas, Bills, and more).
- **Weather outlook** — scans the forecast for its lowest point: negative balance is a
  Storm Warning, under $200 is Partly Cloudy, otherwise Clear Skies.
- **Recurring transactions** — one-time, weekly, every-2-weeks, or monthly.
- **First-run onboarding** — set your real starting balance; explore with examples or
  start fresh.
- **Backup & restore** — export your data to a JSON file and import it on any device.
- **Installable PWA** — add to your home screen; works offline.
- **Light & dark mode**, safe-area aware, keyboard-friendly (Esc closes dialogs).

All data lives locally in your browser (`localStorage`). Nothing is sent to a server.

## Develop

```bash
npm install
npm run dev      # http://localhost:5199
```

## Build & preview

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Deploy

`dist/` is a static bundle — host it on any static host (Netlify, Vercel, Azure Static
Web Apps, GitHub Pages). Serve over HTTPS so the service worker and "Add to Home Screen"
work. Bump the `CACHE` name in `public/sw.js` when you ship a new version to invalidate
the offline cache.

## Tech

React 18 + Vite, plain CSS (no UI framework). Forecast engine in `src/lib/forecast.js`.
