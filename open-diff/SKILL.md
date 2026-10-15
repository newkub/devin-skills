---
name: open-diff
description: View a diff from a PR, git, branch, or two files in a TanStack Start SPA (Solid) on Bun
argument-hint: "[pr <n>] | [git <ref>] | [branch <base>..<head>] | [file <old> <new>] [--repo owner/repo]"
related:
  - follow-create-web
  - follow-lib-unocss
  - report-git-diff
  - deep-review-codebase
---

## Goal

Open a diff from multiple sources (GitHub PR, git ref, branch, or two files) in a browser with SolidJS + TanStack Router (TanStack Start, SPA mode) on a Bun server, featuring a dim-focused UX where closing the tab makes the terminal prompt for an action

## Scope

Use for reviewing diffs in a beautiful, readable form that highlights changed code without relying on the GitHub web UI

Supported:
- GitHub PR: `open-diff pr <number> [--repo owner/repo]`
- Git ref vs HEAD: `open-diff git <ref> [--repo path]`
- Branch base..head: `open-diff branch <base>..<head> [--repo path]`
- Two files: `open-diff file <old> <new>`
- Diff rendering with `@pierre/diffs` (diffs.com)
- Syntax highlighting with Shiki
- Dark / light mode
- Left sidebar file tree (grouped by directory, collapsible, file-type icons, status letters, +/- badges)
- Source tabs + params in the nav (PR/Commit/Branch/File + dropdowns selecting PRs/branches/tags/commits from `/api/prs`, `/api/refs`)
- Auto-load when launched from the CLI
- Terminal prompt when the tab is closed
- Action buttons (Merge ▾ merge/squash/rebase, Approve, Comment, Checkout, Close) that send commands to the terminal for execution
- CI status pill in the header (`gh pr checks`) — auto-polls every 8s until no pending checks remain
- Merge button blocked until CI is fully green (pending/fail → disabled with a tooltip naming the broken check)
- Action log streamed to the terminal in real time (`[open-diff] $ cmd`, `[open-diff:out]`, `[open-diff:err]`) — see merge progress while `run dev`
- File filter/search (press `f` to focus — lives in the sidebar)
- Sidebar toggle (press `b`)
- Unified/Split view toggle (`v`) and line wrap toggle (`w`)
- Lazy load: split the raw diff into per-file chunks, then parse only the selected file
- Status bar showing keyboard hints and the current file
- Help overlay on `?` listing all keyboard shortcuts
- Keyboard: ←/→ or [/] switch file, ↑/↓ or j/k scroll the diff, PageUp/PageDown, f filter, v view, w wrap, b sidebar, t theme, r reload, ? or Shift+/ help, Esc closes menus/blurs the input

Not supported:
- PR diffs exceeding the GitHub API limit
- Binary files

## Execute

### 1. Resolve Source

> Goal: Identify the diff source

1. Read the first argument as the subcommand (`pr`, `git`, `branch`, `file`)
2. Read the `--repo` argument for `pr`/`git`/`branch`
3. If `--repo` is not given for `pr` → use the current repo from `gh repo view --json nameWithOwner`
4. If no subcommand is given → open the app with no default source

### 2. Prepare App Workspace

> Goal: Install and build the `open-diff` app if not present

1. Create a temporary workspace such as `.devin/open-diff-app`
2. Copy the app files from the skill directory (`src/`, `package.json`, `tsconfig.json`, `uno.config.ts`, `vite.config.ts`, `bun.lock`) into the workspace
3. Run `bun install` in the workspace
4. Run `bun run build` to produce `dist/client/` (`_shell.html` + assets which the server serves directly)

### 3. Run And Open

> Goal: Open the diff in a browser

1. Run `bun src/serve.ts <subcommand> [args] [--repo ...]` (or `bun run start -- <subcommand> ...`)
2. Wait for the console to print the URL (`open-diff running at http://localhost:<port>`)
3. The server opens the browser automatically → confirm the tab opened; if not, use `/open-web` or an OS command (Windows: `start`, macOS: `open`, Linux: `xdg-open`)
4. Env vars: `OPEN_DIFF_PORT` sets the port (default random), `OPEN_DIFF_NO_OPEN=1` suppresses auto-opening the browser

### 4. Verify

> Goal: Confirm the app works

1. Check the header shows the correct source
2. Check the top file strip has file cards
3. Check the main area shows the diff with line numbers and +/- markers
4. Try clicking to switch files
5. Try toggling Dark/Light
6. Close the tab and check the terminal shows the prompt or the tab-closed message
7. If there are errors → do `/resolve-errors`

## Rules

### 1. Source Parsing

- `pr <number>` for a GitHub PR
- `git <ref>` for `git diff <ref>..HEAD`
- `branch <base>..<head>` for `git diff <base>..<head>`
- `file <old> <new>` for `git diff --no-index <old> <new>`
- `--repo` takes `owner/repo` for `gh` or a path for `git`

### 2. Workspace Safety

- Install dependencies only in the temporary workspace
- Do not modify the main repo's `package.json`
- Delete the temporary workspace after use unless the user asks to keep it

### 3. Build Requirement

- Bun must be installed
- The `gh` CLI is required for PRs
- `git` is required for git/branch/file diffs
- Install dependencies with `bun install`
- Build with `bun run build` (`bunx vite build`)
- Stack from `package.json`: `@pierre/diffs` ^1.4.1, `shiki` 4.0.0, `unocss` ^66.10.2 + `@unocss/preset-wind4` ^66.10.0, `vite` ^7.1.0, `@tanstack/solid-start` ^1.168.50 (verified 2026-09-12)
- The API lives at `src/server/api.ts` (`handleApi`) — exposed through the server route `src/routes/api.$.ts` (vite dev) and the Bun wrapper `src/serve.ts` (prod)
- `src/serve.ts` serves `dist/client` statics + the `_shell.html` fallback and heartbeat/prompt — do not create `src/server.ts` (Start reserves that name as the custom server entry)

### 4. UX Requirements

- Use UnoCSS `presetWind4` from `@unocss/preset-wind4`
- Use shortcuts (`btn`, `input`, `panel`, `dim`, `file-item`)
- Use CSS variables for the dark/light theme
- Use Shiki for syntax highlighting
- Clearly separate add/del/context by color/background
- Show +/- markers
- Show stats +additions/-deletions/files in the header
- Show PR metadata (title, author avatar, state) when a PR is loaded

### 5. Close Tab Behavior

- The frontend sends a heartbeat to `/api/ping` every 2 seconds
- The frontend sends `/api/close` via `navigator.sendBeacon` on `beforeunload`
- When the tab closes (or pings stop for over 5 seconds), the server shows a terminal prompt to choose:
  - `(r)eopen` → reopen the browser
  - `(q)uit` → shut down the server
  - `(c)ontinue` → keep working
- If not a TTY → the server waits for the next command
- If the user closed a tab but the process is still alive → check whether another tab is open

### 6. Use Existing Skills

- `gh` CLI for PRs
- /follow-lib-unocss for styling
- /follow-create-web (solid-tanstack-router) for the stack
- /open-web for opening a browser
- /report-git-diff for producing a diff report
- /deep-review-codebase for reviewing the diff

## Expected Outcome

- The `open-diff` server runs and opens a browser tab
- The diff source, file list, and diff view are shown
- Line numbers, +/- markers, and syntax highlight are present
- Dark/light can be toggled
- Files can be switched
- Closing the tab makes the terminal show an action prompt
- No new files or dependencies land in the main repo
