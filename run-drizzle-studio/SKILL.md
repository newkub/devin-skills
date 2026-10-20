---
name: run-drizzle-studio
description: Run Drizzle Studio to manage the database via a GUI
argument-hint: "[scope]"
related:
  - deep-review
  - follow-lib-drizzle
  - resolve-errors
---

## Goal

Run `drizzle-kit studio` so it actually works, verifying config, database connection, and opening the browser

## Scope

Use for projects that already have `drizzle-kit` installed — focused on executing the studio run, not a general guide

## Execute

> Pre-Run: Always run `/deep-review` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (drizzle studio)

### 1. Verify Prerequisites

> Goal: Verify the project is ready to run Drizzle Studio

1. Check that a `drizzle.config.ts` or `drizzle.config.js` file exists
2. Read `drizzle.config.ts` to inspect `schema`, `dialect`, and `dbCredentials`
3. Check that `drizzle-kit` is in the `package.json` dependencies
4. Check that the required environment variable such as `DATABASE_URL` exists
5. If the config is missing → run `/follow-lib-drizzle` first, then stop

### 2. Check Database Connection

> Goal: Verify the database is ready to use

1. Pull `DATABASE_URL` from `.env` or the environment
2. Use a database client or `drizzle-kit push --dry-run` to confirm it connects
3. If the database is not ready → inform the user and stop
4. Check that the schema named in the config actually exists

### 3. Start Drizzle Studio

> Goal: Run Drizzle Studio with the correct command

1. Choose the command based on the package manager:
Latest: `drizzle-kit@0.31.11` (verified 2026-09-26)

   - `bunx drizzle-kit studio`
   - `bunx drizzle-kit studio`
   - `pnpm dlx drizzle-kit studio`
   - `yarn dlx drizzle-kit studio`
2. If `package.json` has a `studio` script → use `bun studio` or `npm run studio`
3. Run the command and wait for the output to show `http://localhost:4983`
4. Record the port the studio uses

### 4. Open Browser

> Goal: Open the browser to use Studio

1. Use `open-web` or a platform equivalent to open `http://localhost:<port>`
2. The default port is `4983`
3. If the port is taken, wait for the output to report the new port
4. Confirm that the Studio page loads

### 5. Handle Errors

> Goal: Fix common problems during the run

1. If `drizzle-kit: command not found` → run `bun add -D drizzle-kit`
2. If `database connection failed` → check `DATABASE_URL` and access permissions
3. If `schema not found` → check the path in `drizzle.config.ts`
4. If port 4983 is taken → use `PORT=4984 bunx drizzle-kit studio` or another port option
5. If it still fails → run `/resolve-errors`

### 6. Stop Studio

> Goal: Stop the process cleanly

1. Note when to stop based on the user request
2. Use `Ctrl+C` on the running process
3. If the process hangs → use `taskkill` or `pkill` to stop it
4. Confirm that the port has been released

## Rules

### 1. Package Manager

- Use `bunx` as the default if the project uses Bun
- Never `npx` — it is denied by policy; if Bun is missing, install it first
- Use `pnpm dlx` or `yarn dlx` according to the lockfile

### 2. Port And URL

- The default port is `4983`
- Open the URL that studio reports in the output
- If there is a custom port, record it and communicate it to the user

### 3. Configuration

- A `drizzle.config.ts` is always required before running
- A `DATABASE_URL` or the credentials named in the config is required
- If the config is incorrect, fix it first or stop

### 4. Safety

- Do not run studio against a production database without confirmation
- Do not edit production data directly through studio
- Verify the environment before running

### 5. Non-Redundancy

- Do not duplicate `/follow-lib-drizzle`, which focuses on the development guide
- Use these steps only when you actually need to run studio

## Expected Outcome

- `drizzle-kit studio` is running on `http://localhost:4983` or the specified port
- The browser has opened the Studio page
- The database connection and schema are correct
- No process is left hanging after use
