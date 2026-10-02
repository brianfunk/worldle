# AGENTS.md

Guidance for AI coding agents and new contributors working in this repo.

## What this is

WORLDle is a geographic take on Wordle: a hidden place, six clicks on a map, a new puzzle every day.
It is a **static web app** with no server, no database and no accounts. Everything a player needs
to remember lives in their own browser's localStorage. Keep it that way unless the owner says otherwise.

## Stack

- Vite + React 19 + TypeScript, strict mode. `maplibre-gl` used directly (no wrapper library).
- Tiles: OpenFreeMap vector styles plus free raster sources (OSM, OpenTopoMap, CARTO, Esri). No API keys.
- Tests: Vitest, `src/**/*.test.ts`. Pure game logic has tests; UI does not.
- Hosting: Netlify, built from `netlify.toml` (`npm run build` → `dist/`). Node 22 (`.nvmrc`).

## Commands

```sh
npm install
npm run dev        # Vite dev server (if 5173 is busy: npx vite --port 5199)
npm test           # Vitest
npm run build      # tsc -b && vite build
```

Dev-only helpers: `?d=N` opens puzzle N, `?map=<id>` forces a basemap, and `window.__map` exposes the
MapLibre instance in dev builds for scripted testing.

## Layout

```
src/game/      pure logic: engine.ts (rules), daily.ts (date → puzzle), geo.ts, units.ts, share.ts, storage.ts, targets.json
src/map/       MapView.tsx (MapLibre lifecycle, rings, labels) and styles.ts (basemap catalogue)
src/components UI pieces: TopBar, ModeSwitch, HintPanel, GuessList, ResultCard, ArchivePanel, HelpModal, Toast
src/App.tsx    screen state, persistence wiring
src/styles.css design tokens and all styling (no CSS framework)
public/        icons, manifest, robots, sitemap, OG image
archive/legacy old 2022 prototype, kept for reference, do not extend
```

## Rules of the road

- **Game rules live in `src/game/engine.ts`** as pure functions with constants at the top. Change tuning there,
  add a test, never put rules in components.
- **Saved games are lists of clicks** replayed through the engine. Keep `applyClick` deterministic, and bump the
  storage key version in `storage.ts` if you change stored shapes.
- **Daily puzzles must be stable.** `daily.ts` seeds a fixed shuffle; append new targets to the end of
  `targets.json`, never reorder or delete, or past days change for everyone.
- **Targets**: six hints ordered vague → specific, plain strings, a one-line fact, and a `winRadiusKm` that fits the
  place (landmarks 2–5, cities 12–20, nature 15–100).
- **Design**: use the tokens in `styles.css`; both light and dark themes must work. Mobile first, 44px tap targets,
  no horizontal scroll at 390px. The map is the page; UI floats over it.
- **No tracking, no analytics, no third-party scripts** beyond fonts and tiles.
- **Dependencies**: keep them few. Check `engines.node` against Node 22 before adding anything.

## Git

- `dev` is the default branch. Branch off `dev` (`feature/...`, `fix/...`, `chore/...`), open a PR into `dev`.
- `main` is production. Promote with a PR from `dev` to `main`.
- Commits and PRs are authored by humans. Do not add AI attribution, co-author trailers or model names.
- Run `npm test` and `npm run build` before opening a PR.
