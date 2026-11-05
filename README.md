# Supabase + Next.js starter

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your project URL and publishable (or anon) key from Supabase dashboard → Project Settings → API.
3. `npm run dev` and open http://localhost:3000. The home page shows whether the app can reach your database.

## Layout

- `src/lib/supabase.ts` — shared Supabase client (`import { supabase } from "@/lib/supabase"`)
- `app/` — Next.js App Router pages
