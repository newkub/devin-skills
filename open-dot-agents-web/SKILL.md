---
name: open-dot-agents-web
description: Start the local harness dashboard at ~/.agents/web and open http://localhost:4173
argument-hint: "[start|open|stop] [port]"
related:
  - list-dot-agents-global
  - check-open-ports
  - open-web
  - report
---

## Goal

Run the read-only harness dashboard served from `~/.agents/web` and open it at `http://localhost:4173`

## Scope

- App root: `~/.agents/web` (`D:\dot-agents\web` on this machine); it reads the harness store directly and never writes client configs
- Tabs: Health, Skills, Agents, MCP, Hooks, and AGENTS.md
- Port: `4173`; override with `PORT`
- Domains: `start`, `open`, `stop`; default `open`
- Boundary: inventory in chat → `/list-dot-agents-global`; port conflicts → `/check-open-ports`; a different web target → `/open-web`

## Execute

### 1. Pick Domain

> Goal: route the request

| Domain | Use when | Action |
|---|---|---|
| `start` | the dashboard is not running | start the dev server, then open the browser |
| `open` | the server is already running | open `http://localhost:4173` |
| `stop` | the caller wants the port freed | stop the server after confirmation |

1. Read the argument; when empty use `open`
2. Pass the optional port to every later step

### 2. Check The Port

> Goal: never start on a busy port

1. Run `/check-open-ports 4173`
2. Free → continue
3. Busy and owned by this dashboard → go to Open The Browser
4. Busy by another process → stop and ask for a different `PORT`

### 3. Start The Server

> Goal: serve the dashboard from the canonical store

```bash
cd ~/.agents/web
bun run dev
```

1. `bun run dev` runs the UnoCSS watcher plus `bun --watch server.ts`
2. Use `bun run start` for a one-shot CSS build with no watcher
3. Run it in the background and keep the log; report the log path
4. When `PORT` is set, export it before `bun run dev`

### 4. Open The Browser

> Goal: show the dashboard

1. Open `http://localhost:4173`
2. Use `/open-web http://localhost:4173` when the server already runs and only the browser is needed
3. Report which tab the user asked for when they name one

### 5. Stop The Server

> Goal: leave no orphan process

1. Only for the `stop` domain
2. Find the PID owning the port via `/check-open-ports 4173`
3. Confirm the process belongs to `~/.agents/web` before terminating it
4. Ask for confirmation, then stop it and report that the port is free

### 6. Report

> Goal: one table with the run state

1. Follow `/report`; table columns: No., Item, Value
2. Show app root, URL, port, process state, and log path
3. On failure, show the command output and the next action via `/suggest-next-action`

## Rules

- The dashboard is read-only: never edit harness files or client configs from this skill
- Never run `bun run deploy` here; deployment is a separate skill and needs confirmation
- Never start on a busy port and never terminate an unrelated process
- If `~/.agents/web` is missing → report it; never clone or scaffold it
- Never use `**` bold; use backticks for paths, commands, and URLs

## Expected Outcome

- The dashboard runs at `http://localhost:4173`, or the browser opens on an already-running instance
- One report table states the port, process state, and log path
- Stopping leaves the port free with no orphan process
