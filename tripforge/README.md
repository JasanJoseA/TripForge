# TripForge — Forge your trip.

A multi-agent AI travel planner. Three trail guides work in sequence:

- **Scout** — asks guided questions and builds a structured travel profile.
- **Explorer** — turns that profile into five distinct itinerary options.
- **Guardian** — reviews your chosen itinerary for safety, budget, packing, and fit.

Theme: forest / adventure — deep pine and moss backgrounds, fern and campfire-amber
accents, a hand-drawn topo-map "trail" as the signature visual thread connecting each
stage of the flow.

## A security note on the AI endpoint

The original spec included a bearer token hardcoded directly in source, pointing at a
third-party proxy. That's not shippable: any key embedded in frontend code is visible
to anyone who opens dev tools, regardless of how it's obfuscated. This build does two
things instead:

1. Ships fully functional **without** any AI key — Scout's question flow, Explorer's
   itinerary generation, and Guardian's review are all produced by local logic in
   `src/lib/mockAgents.ts`, so the whole app works offline out of the box.
2. Optionally supports a **real** endpoint via environment variables (see `.env.example`).
   If you do wire up a live model, put the real request behind your own backend — never
   call a third-party API directly from shipped client code with a key attached.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

To enable live AI calls instead of the local simulation:

```bash
cp .env.example .env.local
# fill in VITE_AI_API_URL / VITE_AI_API_KEY / VITE_AI_MODEL
npm run dev
```

## Build & deploy

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

`dist/` is a static site — deploy it to Vercel, Netlify, Cloudflare Pages, or any static
host. If you're using a live AI endpoint, set the same `VITE_*` env vars in your host's
dashboard (as build-time env vars, since Vite inlines them at build time).

## Architecture

```
src/
  components/
    layout/     NavBar, TrailProgress (signature route visual)
    scout/      ScoutChat — guided conversational profile builder
    explorer/   ItineraryCard — the five-route grid
    guardian/   GuardianReport — safety/planning/packing/verdict sections
    ui/         Card, Button, AgentRating (shared primitives)
  lib/
    aiClient.ts    configurable request helper (env-based, no hardcoded secrets)
    mockAgents.ts  local simulation: Scout questions, Explorer generation,
                   Guardian review, and the feedback → guidance summarizer
  store/
    useTripStore.ts   Zustand store; savedTrips + ratings persist to localStorage
  pages/
    Landing, Plan (orchestrates the Scout→Explorer→Guardian→Summary flow),
    Saved, Ratings, Settings
```

## Feedback / learning system

Ratings are per-agent (Scout, Explorer, Guardian), each with a 5-star control and a
comment box. Users never edit prompts directly. Instead, approved comments are
summarized into short guidance bullets (see the Ratings page) that a real integration
would prepend to that agent's next request. A lightweight filter in `mockAgents.ts`
(`isFeedbackSafe`) rejects comments that look like prompt-injection attempts before
they're marked "approved."

## What's included vs. stretch goals

Built and working: the full three-agent flow, five itinerary cards, the detailed
Guardian report, per-agent ratings with a learning-guidance summary, saved trips with
localStorage persistence, settings/connection status, full mobile responsiveness,
live weather (Open-Meteo, keyless), an interactive route map (OpenStreetMap embed,
keyless), currency conversion on cost figures (exchangerate.host, keyless), PDF export
(browser print with a dedicated print stylesheet), calendar export (.ics download),
and trip sharing (native Web Share where available, clipboard copy as fallback).

All of the above external calls use free, keyless APIs specifically so nothing needs a
secret shipped to the client. Note: this sandbox's own network is restricted to
package registries, so these calls weren't exercised live during the build — verify
weather/map/currency rendering once you run `npm run dev` with normal internet access.

Not built (still worth a deliberate pass rather than a stub): a full daily itinerary
timeline view and a live budget tracker that updates as you plan — both are more
naturally state-heavy features that deserve their own design pass.
