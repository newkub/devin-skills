# AGENTS.md - Web App

## Project

- Name: `@ask-requirement/web`
- Framework: `@tanstack/solid-start`
- Styling: `UnoCSS`
- Build Tool: `Vite` (Rolldown)
- Linting: `Biome`

## Architecture

- Entry points: `src/client.tsx`, `src/server.tsx`
- Router: `src/router.tsx` (uses `createRouter` from `@tanstack/solid-router`)
- Routes: `src/routes/` (file-based routing with `createFileRoute`)
- Root route: `src/routes/__root.tsx`
- Auto-generated route tree: `src/routeTree.gen.ts` (do not edit)
- Uses shared types and data from `@ask-requirement/shared`
- UnoCSS with `presetWind4`, `presetIcons`, `transformerDirectives`, `transformerVariantGroup`

## Scripts

- `bun run dev` - Start Vite dev server
- `bun run build` - Build with Vite
- `bun run preview` - Preview production build
- `bun run typecheck` - Type check
- `bun run lint` - Lint with Biome
- `bun run verify` - Typecheck + lint
