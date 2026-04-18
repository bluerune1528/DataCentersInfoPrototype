
# Data Center Environmental Impact Site

A clean, professional informational site backed by Supabase data, with live search, per-center stats charts, an emerging tech page, and dark mode.

## Pages & Routes
- `/` — Home: short intro on why data center sustainability matters + prominent live search bar + result cards (5–10).
- `/technologies` — Emerging tech cards (Immersion Cooling, AI Power Management, Renewable Energy Integration, Liquid Cooling) with "Learn More" external links.
- `/about` — Brief about page explaining the project's purpose and data sources.
- Shared layout in `__root.tsx`: top navbar (Home | Technologies | About) + dark/light toggle on the right.

## Data Layer
- Supabase client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Fetch from `data_centers` table (id, name, company, country, location, water_consumption, electricity_consumption, pollution, sustainability_steps, technology_links).
- Live search: client-side debounced filter on `company` and `country` fields, capped at 10 results. Empty query shows a featured subset (first 8).
- "No results found" friendly empty state.

## Card Content
Each card displays: Name & Company, Location, Annual water consumption, Annual electricity consumption, Carbon/pollution output, Key sustainability steps (truncated), and a **View Stats** button.

## Stats Modal
- Opens on "View Stats" click (shadcn Dialog).
- Two simple Recharts bar charts: Water Consumption over years, Electricity Consumption over years.
- Assumption: `water_consumption` and `electricity_consumption` may be a single number or a JSON object/array of yearly values. The modal will handle both — if it's a single number we'll display it as a single bar; if it's an array/object of `{year: value}` we'll render the full series. (I'll confirm structure once data loads; logic will be defensive.)

## Design
- Tailwind, Inter font, white/light-grey light mode, slate dark mode.
- Green accent (`oklch` green) for primary actions, badges, and chart bars.
- Fully responsive grid (1 col mobile → 2–3 cols desktop).
- No animations beyond default hover/focus states.

## Dark Mode
- Toggle in navbar, persisted in `localStorage`, applied via `.dark` class on `<html>`. Initial value read in a small inline script in root shell to avoid flash.

## Tech
- TanStack Start routes, Tailwind v4 tokens (extend with green accent), shadcn Dialog/Card/Input/Button, Recharts, `@supabase/supabase-js`.
- Secrets entered as `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` env vars (the values you shared will be added).

