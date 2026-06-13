# Habit Tracker — with Calendar View

A motivational personal-development app for building and maintaining habits. Users define
habits, mark them complete on a calendar, and watch their progress through streaks, monthly
consistency, and an analytics dashboard — all wrapped in a dark, mobile-first UI with fluid
animations and **Duolingo-style celebrations** (a flame burst on a growing streak, confetti when
the day is fully done) plus a branded **launch splash**. It is also an **installable,
offline-capable Progressive Web App (PWA)** — install it on your phone or computer and it behaves
like a native app, no app store required.

- **Live demo:** https://habit-tracker-zeta-lake.vercel.app/
- **Repository:** https://github.com/kobe1212/habit-tracker

> Data is stored locally in your browser/device (no account, no backend). The deployed app seeds a
> few sample habits on first visit so the dashboards have something to show — use **Profile → Reset
> Demo Data** to start fresh.

---

## Install as an app (PC, Android, iOS)

Because it is a PWA, you can install it straight from the browser — it then opens in its own window,
works offline, and shows up with its own icon. **First, open the live demo:**
https://habit-tracker-zeta-lake.vercel.app/

### On a PC (Windows / macOS / Linux — Chrome or Edge)
1. Open the live demo in **Chrome** or **Edge**.
2. Click the **install icon** (a monitor with a down-arrow) at the right end of the address bar.
   - No icon? Open the **⋮** menu → **Cast, save, and share** / **Apps** → **Install Habit Tracker…**
3. Click **Install**. It opens in its own window and adds a desktop / Start-menu / Launchpad shortcut.

*(Safari on macOS 16+: open the site, then **File → Add to Dock**.)*

### On Android (Chrome)
1. Open the live demo in **Chrome**.
2. Tap the **⋮** menu → **Add to Home screen** (or **Install app**).
3. Tap **Install / Add**. The icon lands on your home screen and launches fullscreen.

### On iPhone / iPad (Safari)
> iOS only allows installing PWAs through **Safari** — Chrome on iOS won't show the option.
1. Open the live demo in **Safari**.
2. Tap the **Share** button (the square with an up-arrow).
3. Scroll down and tap **Add to Home Screen**, then **Add**.
4. Launch it from the new home-screen icon — it runs fullscreen, like a native app.

Once installed it works **offline** (the app shell and fonts are cached), and it auto-updates to the
latest version the next time you open it online.

---

## 1. Project Choice

**The Habit Tracker with Calendar View.** The brief was to build a motivational tool with a
calendar interface where users mark habits complete and the app computes statistics like
**completion streaks** and **monthly consistency**. This implementation delivers that core, plus a
daily check-in screen, an analytics dashboard, and per-habit detail views with an interactive
year-to-date chart and a clickable month calendar.

### Features

- **Today / Home** — profile greeting, a sliding week strip with previous/next week navigation, a
  per-day progress dial that counts up, an animated streak banner with a "living" flame, and a
  tap-to-complete habit checklist for the selected day.
- **Habits** — create / edit / delete habits (name, emoji icon, color, daily or specific-weekday
  frequency, and a **category**); each row shows its category tag and current streak, and a sliding
  chip-bar filters the list by category (Health, Fitness, Mind, Work, Personal).
- **Habit Detail** — current & longest streak, this-month consistency, an interactive **Year to
  Date** bar chart (hover for exact values, click a month to slide the calendar to it), and a
  monthly **calendar** with success / skipped / today states you can toggle.
- **Analytics** — **Week / Month / Year** scoped summary (completions, active days, consistency
  with clear denominators), an **Activity Rate Over Time** chart with a numeric axis and hover
  tooltips, and a Top Habit — all animating between ranges.
- **Profile** — editable name + avatar (upload a photo or pick an emoji), a working **Dark / Light**
  theme toggle, and a real browser **Notifications** opt-in.
- **Celebrations** — a looping flame burst + sound when completing a habit that extends a streak,
  and a confetti burst + sound when every habit for the day is done (Lottie animations + audio,
  Duolingo-style overlays that blend over the Home screen).
- **Launch splash** — a short branded video plays full-screen on open, then fades into the app.
- **Installable PWA** — add to home screen / install on desktop, works offline, with an animated
  expandable bottom navigation.

---

## 2. Justification of Tools

| Tool | Why |
| --- | --- |
| **React 19 + Vite** | Fast dev loop (instant HMR) and a tiny, fully-static production bundle — ideal for a CDN-hosted SPA. |
| **TypeScript** | The streak / consistency / date logic is easy to get subtly wrong; static types caught real bugs (e.g. an off-by-one timezone issue) early. |
| **Tailwind CSS v4** | Rapid, consistent styling with CSS-variable design tokens, which made the dark/light theming a token swap rather than a rewrite. |
| **framer-motion** | Page transitions, the segmented progress dial, count-ups, the living streak flame, and the sliding nav/calendar — the "modern, alive" feel. |
| **lottie-react** | Plays the vector flame + confetti celebration animations (via the `useLottie` hook). |
| **react-router** | Clean multi-screen navigation with deep-linkable routes. |
| **localStorage** | Zero-backend persistence — instant, offline-capable, and no accounts to manage for a single-user personal tool. |
| **vite-plugin-pwa (Workbox)** | Generates the service worker + web manifest for offline use and installability. |
| **@vercel/analytics + speed-insights** | Production observability — page views and Core Web Vitals. |
| **lucide-react / class-variance-authority** | Icons and variant styling for the shadcn-style UI primitives (`components/ui`). |
| **Vercel** | One-click Git-connected deploys, automatic builds on push, and a global CDN. |
| **Claude Code (Opus)** | The app was built conversationally with Claude Code as the engineering agent — planning, implementing, verifying in a browser preview, and committing. |

---

## 3. High-Level Approach

This project was built as a **prompt chain**, not a single prompt — an iterative,
software-engineering loop rather than one-shot generation:

1. **Scope & plan** — an initial prompt set the product, stack, and constraints; plan-mode was used
   for larger features to agree on an approach before writing code.
2. **Front-end first** — all screens were built with mock data to lock in the visual design
   (driven by reference images) before any logic.
3. **Wire real data** — the mock arrays were replaced by a single source of truth.
4. **Polish** — theming, animations, and interaction details were layered on.
5. **Ship & harden** — deploy to Vercel, turn it into an installable PWA, add analytics, and
   refactor for maintainability (shared utilities, an error boundary).
6. **Delight** — habit categories with a filter, plus motivational moments: a launch splash video
   and Lottie + sound celebrations for streaks and full-day completion.

Each step ended the same way: **build → verify in a live browser preview → commit with a clean
message → push to GitHub.**

### Architecture

- **State:** a single `HabitStoreProvider` (React Context) holds `habits` + `completions`, persists
  them to `localStorage`, and seeds sample data on first run. `ThemeProvider` and `ProfileProvider`
  do the same for theme and profile.
- **Data model:** `Habit { id, name, color, icon, frequency, createdAt }` and
  `CompletionData { [date]: { [habitId]: boolean } }`.
- **Pure logic layer:** `src/lib/stats.ts` (current/longest streak, monthly consistency, weekly
  activity, totals), `src/lib/dateUtils.ts` (timezone-safe local date helpers), and
  `src/lib/format.ts` / `src/lib/chart.ts` (shared formatting + chart helpers). Keeping the math
  pure made it easy to reason about and reuse across every screen.
- **UI:** screens in `src/screens`, reusable pieces in `src/components` (incl. a shared
  `ScreenHeader`, an `ErrorBoundary`, a `SplashScreen`, and `Celebrations`), and shadcn-style
  primitives in `src/components/ui` (`expandable-tabs`, `streak-badge`). Category presets live in
  `src/lib/categories.ts`.
- **Media:** the splash video and celebration sounds live in `public/media/`, the Lottie JSON in
  `src/assets/lottie/`. (Assets must go in `public/`, not the build output `dist/`, which is
  regenerated on every build.)
- **PWA:** `vite-plugin-pwa` generates the service worker + `manifest.webmanifest`; the SW is
  registered from `src/main.tsx`. Icons live in `public/` (generated by `scripts/generate-icons.mjs`),
  and `/media/*` video/audio is runtime-cached so the splash isn't re-downloaded each launch.

---

## 4. Final Prompts

Cleaned, copy-pastable versions of the key prompts used to build the app, in order:

**1 — Kickoff / scoping**
```
Build a Habit Tracker web app similar to the HabitNow app, following this assessment:
"The Habit Tracker with Calendar View" — users define habits, mark them complete on a
calendar, and the app shows streaks and monthly consistency. List the features, map out a
build plan, and ask me clarifying questions before starting. Stack: React + Vite +
TypeScript + Tailwind, localStorage for persistence, deploy to Vercel. Use Git from the
start: clean commit messages, push to GitHub after each step.
```

**2 — Dark mobile redesign (front-end first)**
```
Rebuild the UI from this reference image: a dark, mobile-first habit tracker with a blue
accent. Start with ONLY the front-end Home screen (static data) so I can approve the design
before we build the rest. Present it as a centered phone frame on desktop, full-screen on mobile.
```

**3 — Remaining screens**
```
Build the remaining front-end screens — Analytics and Habit Detail (with a year-progress bar
chart and a monthly calendar) — plus a Profile screen using the provided reference layout, but
keep the same dark UI as the Home screen.
```

**4 — Wire real data**
```
Replace the mock arrays with localStorage so habits persist, completions actually toggle, and
streaks / consistency / the calendar all compute from real data. Add create/edit/delete habits.
```

**5 — Range-scoped analytics + interactive chart**
```
On Analytics, make the Summary, the Activity chart, and Top Habit all reflect the selected range:
Week = current week, Month = current month, Year = current year. Give the chart a numeric axis
("Total Activity") and a hover tooltip showing the exact value for each point.
```

**6 — Make it feel alive**
```
Enhance the app with animations so it feels modern and futuristic: animate page transitions, the
progress dial, the streak flame, count-up numbers, and the data changes when switching ranges.
Make the Year-to-Date chart interactive — hover for values, click a month to open its calendar.
```

**7 — Deploy**
```
Plan and deploy the app to Vercel via GitHub integration, and write the full assessment README.
```

**8 — Make it an installable PWA**
```
Turn the app into an installable, offline-capable PWA. Generate a modern app icon set, add a web
manifest and a service worker (vite-plugin-pwa) that precaches the app shell, and keep the strict
Content-Security-Policy intact (no inline scripts).
```

**9 — Observability + maintainability**
```
Add Vercel Web Analytics and Speed Insights for production monitoring. Then refactor for
maintainability: extract the duplicated formatting/chart/header code into shared modules, and add
reliability guards (safe localStorage writes and a React error boundary). Open it as a pull request.
```

**10 — Habit categories**
```
Add habit categories: a preset, color-coded category per habit (Health, Fitness, Mind, Work,
Personal) chosen in the form, shown as a tag on habit rows and the detail screen, and a sliding
filter chip-bar on the Habits list. Keep existing saved habits working (treat as Uncategorized).
```

**11 — Celebrations + splash**
```
Add Duolingo-style celebrations using the provided Lottie files and sounds: a flame burst + sound
when a completion extends a streak, and a confetti burst + sound when all of the day's habits are
done. Also add a launch splash that plays a video on open, then fades into the app.
```

---

## 5. Instructions — Run & Reproduce

**Prerequisites:** Node.js 20+ and npm.

```bash
# 1. Clone
git clone https://github.com/kobe1212/habit-tracker.git
cd habit-tracker

# 2. Install
npm install

# 3. Run the dev server (http://localhost:5173)
npm run dev

# 4. Production build + local preview (the service worker only runs in a build)
npm run build
npm run preview
```

On first load the app seeds sample habits. To clear everything and start with your own data, go to
**Profile → Reset Demo Data**. To regenerate the PWA icons after editing the design, run
`node scripts/generate-icons.mjs`.

### Deploy your own (Vercel)

1. Fork/clone this repo to your GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project → Import** the repo.
3. Vercel auto-detects **Vite** (build `npm run build`, output `dist`). **No environment variables
   are needed.**
4. **Deploy.** Every push to `master` then auto-deploys.

`vercel.json` adds an SPA rewrite (so deep links like `/analytics` survive a refresh) and a set of
security headers (a strict CSP plus `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
`Permissions-Policy`).

---

## 6. Challenges & Iterations

- **Design pivot.** The first build used a light, multi-page layout; it was scrapped for a dark,
  mobile-first design driven by reference images. The old version is preserved on the
  `archive/old-design` branch, and the rebuild went **front-end-first** so the look could be
  approved before wiring logic.
- **Timezone off-by-one.** Early date helpers used `toISOString()` (UTC), which shifted "today" by a
  day in some timezones and corrupted streak math. Fixed by formatting from **local** date parts.
- **Dark/light theming without a rewrite.** Hardcoded `text-white` and white borders didn't adapt to
  light mode. Introduced semantic CSS-variable tokens (`fg`, `surface`, `line`, …) that flip under
  `html.light`, keeping literal white **only** where it sits on the blue brand color.
- **Animating the bottom nav.** Rendering the nav per-screen meant it remounted on every navigation,
  so framer-motion never animated. Fixed by mounting it **once** and driving its selection from the
  current route — now tab changes animate smoothly.
- **Third-party component in a strict setup.** Integrating the shadcn `ExpandableTabs`/`StreakBadge`
  needed a `@/` path alias, a `cn()` util, and small fixes for React 19's stricter ref types and the
  project's strict TS config — plus mapping the shadcn color tokens onto this app's theme tokens.
- **SPA routing on a static host.** Client-side deep links 404 on refresh on a plain static host;
  added a catch-all rewrite to `index.html` in `vercel.json`.
- **PWA under a strict CSP.** The service-worker registration was kept out of the HTML (registered
  from `main.tsx` via `virtual:pwa-register`) so no inline `<script>` is emitted, keeping
  `script-src 'self'` intact; the CSP was widened only enough to cache Google Fonts and report
  Vercel insights.
- **Reliability hardening.** `localStorage` reads/writes are wrapped so corrupted data or a quota
  error can't crash startup, and a top-level `ErrorBoundary` turns any render crash into a
  recoverable "Reload" screen instead of a blank page.
- **Lottie default-export crash.** Under Vite, `lottie-react`'s default `<Lottie>` component
  resolved to an object and crashed the celebration overlay — the `ErrorBoundary` caught it (no
  white screen), and switching to the `useLottie` hook fixed it.
- **Splash black screen (`public/` vs `dist/` + codec).** A black splash traced to two things: the
  video was dropped into the throwaway `dist/media` (the dev server reads `public/`, and `dist/` is
  rebuilt every time), and iPhone videos are often HEVC/H.265 which browsers can't decode. Fix:
  keep media in `public/media/` and use an H.264 (`avc1`) MP4.

---

Built with [Claude Code](https://claude.com/claude-code).
