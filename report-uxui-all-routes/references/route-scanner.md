---
name: route-scanner
description: Steps to scan all routes of a website (page + API routes) —
---

## Goal

Collect all routes in a website project — both page routes and API routes — with parameters and dynamic segments identified

## Scope

For website projects using file-based routing, config-based routing, or a route table, e.g. Next.js, Nuxt, SvelteKit, SolidStart, TanStack Start, Remix, Astro

## Execute

### 1. Detect Routing Framework

> Goal: Identify the framework and routing convention the project uses

1. Read `package.json` for dependencies such as `next`, `nuxt`, `svelte-kit`, `solid-start`, `@tanstack/start`, `react-router`, `astro`
2. Check the directory structure: `app/`, `src/app/`, `pages/`, `src/pages/`, `src/routes/`, `routes/`
3. See `references/frameworks.md` for each framework's convention
4. If the project has multiple routing patterns, identify every pattern

### 2. Scan Page Routes

> Goal: The list of all page routes

1. Scan the directory holding page files per the detected framework
2. Convert file paths to URL paths by stripping extensions and the `index`, `page`, `layout` suffixes
3. Identify dynamic segments such as `[id]`, `[...slug]`, `($lang)`, `[[optional]]`
4. Record: method (GET), path, file, parameters, group/folder

### 3. Scan API Routes

> Goal: The list of all API routes

1. Scan `app/api/`, `src/server/`, `src/routes/api/`, `pages/api/`, `src/pages/api/` per the framework
2. Identify the HTTP method from the file name, e.g. `+server.ts` in SvelteKit, `route.ts` in Next.js, `+page.server.ts`
3. Record: method, path, file, parameters, description if present

### 4. Extract Route Metadata

> Goal: Collect metadata for each route

1. Read the route file for exports such as `meta`, `loader`, `action`, `handler`
2. Identify the middleware or guards used
3. Identify redirects, rewrites, or catch-all routes
4. Separate public routes from routes requiring authentication

### 5. Format Output

> Goal: Present the routes in an easy-to-read form

1. Use `/report` to format the table
2. Columns: No, Type, Method, Path, File, Parameters, Notes
3. Order alphabetically by path
4. Split groups: Page Routes, API Routes, Redirects, Catch-all

## Rules

### 1. Framework Detection

- Check dependencies before guessing conventions
- Support multiple routing patterns in one project
- If unsure, report the uncertainty

### 2. Route Extraction

- Convert file paths to URL paths per the framework's convention
- Do not count `layout`, `error`, `loading`, `template` files as routes
- Keep dynamic segments with their real notation (`[]`, `()`, `[...]`)

### 3. API Route Handling

- State the HTTP method correctly per convention
- If a file states no method, default to GET
- Keep API routes clearly separated from page routes

### 4. Reporting

- Use `/report` for the report
- Use backticks for paths and methods
- Identify routes that may conflict or duplicate

- Use /analyze-attack-surface if needed
- Use /deep-review if needed
- Use /deep-test api (all-routes check) if needed

## Expected Outcome

- The list of all page routes in the project
- The list of all API routes in the project
- Dynamic segments and parameters identified
- Routes grouped and ordered clearly
- No routes lost from the file-based convention

