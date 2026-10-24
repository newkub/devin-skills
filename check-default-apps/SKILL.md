---
name: check-default-apps
description: Read Windows default apps (browser, mail, file types) and fall back to the most-used app
argument-hint: "[browser|mail|editor|all|<ext>] [--json] [--record <exe>]"
related:
  - check-system-env
  - open-files-in-web
  - open-in
  - follow-tool-playwright
  - use-agent-browser
  - maintain-computer
  - record-video-web-with-agents-browser
allowed-tools:
  - exec
  - read
  - grep
  - glob
  - find_file_by_name
---

## Goal

Report how the user's Windows default applications are actually configured — read the real `UserChoice` association, name the executable behind it, flag a default that points at a deleted or uninstalled app — and when nothing usable is set, fall back to the app the user opens most often

## Scope

Use when a skill or the user must know which app will open a URL, a file type, or a mail link before launching anything:

- a skill is about to open a browser, editor, or terminal and must not hardcode `chrome`/`code`/`explorer` — resolve the user's real app first
- the user says "links open the wrong browser" or "the default is not what I use" → read the association and show the exe behind it (use with `/check-system-env`)
- nothing is set, or the set default points at a removed app → fall back to frequency: the app the user launches most, tracked in `%APPDATA%\devin\default-apps.json`
- needs a candidate list of installed browsers before `/follow-tool-playwright`, `/use-agent-browser`, or `/record-video-web-with-agents-browser` picks a channel
- machine-health context for `/maintain-computer` and inventory context for `/list-program-in-computer`

Windows only — macOS `open` and Linux `xdg-open` already resolve the default at call time, so there is nothing to inspect.

Not for listing every installed program (use `/list-program-in-computer`), OS/shell/PATH inspection (use `/check-system-env`), or actually launching the app (use `/open-in`, `/open-web`, `/open-files-in-web`)

## Execute

### 1. Resolve Associations

> Goal: Read the real default app for each target, read-only

1. Run the resolver: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/resolve-default-apps.ps1 -Target <targets> [-Json]`
2. Targets: `browser` (`http`,`https`), `mail` (`mailto`), `editor` (`.txt`,`.md`), `all`, or an explicit extension `ts`, `.ts`, `json`, `pdf`
3. Add `-IncludeRecent` for the Windows search `RecentApps` warm-start signal, `-Record <exe>` to bump the usage counter
4. Read the whole table, not just the first row — `http` and `https` can point at different apps
5. Resolution order, status semantics, and the counter schema: `references/resolution-order.md`

### 2. Interpret Status

> Goal: Separate "set" from "set but broken"

1. `set` → usable; carry `exe` and `appName` forward to the caller
2. `stale` → `UserChoice` points at a ProgId whose executable no longer exists — report it as the root cause of wrong-app launches
3. `missing` → no `UserChoice` key at all
4. `unresolved` → ProgId exists but has no `shell\open\command` (UWP/AppX app) — report the ProgId and treat the app as usable but unlaunchable from a path
5. Never rewrite `UserChoice` — Windows hash-protects it; a registry write is ignored or reset. Changes go through Settings (step 4)

### 3. Resolve The Fallback App

> Goal: Pick the app the user actually uses when the default is unusable

1. Read the counter for the target's category: `browser` → `browser|`, `mail` → `mail|`, `editor` → `editor|`
2. Highest count wins; on a tie prefer the app that is also installed and whose exe exists
3. Counter empty → use the resolver's `installedBrowsers` list for `browser`
4. Still empty → the resolver prints `ask` in the `Fallback` column; use `/ask-me` with the installed candidates, never guess
5. Report which rule decided the answer (`userchoice`, `counter`, `installed`, `ask`) — the caller must be able to justify the launch

### 4. Change A Default

> Goal: Hand default changes to the only place Windows honours

1. Print the current value and the requested app, then ask for confirmation
2. Open Settings: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/resolve-default-apps.ps1 -OpenSettings` (`ms-settings:defaultapps`)
3. Tell the user the exact target to change (`http`, `https`, `mailto`, `.ts`); never claim the default changed — confirm by re-running step 1 after they set it

### 5. Record Usage

> Goal: Keep the frequency signal honest

1. Callers that launch an app record it: `--record <exe>` with `-Category <browser|mail|editor>`
2. Record only real launches, once per launch — no backfilling, no synthetic counts
3. The counter file is the only thing this skill writes; the directory is `%APPDATA%\devin\`

### 6. Report

> Goal: One `No.`-first table

Report per `/report` with columns `No.` | `Target` | `App` | `Exe` | `Status` | `Source` | `Fallback` | `Note`

1. One row per resolved target; `-` for any unknown cell
2. `Source` is the rule that decided the value (`userchoice`/`counter`/`installed`/`ask`)
3. `Note` carries the fix: `stale` → open Settings and pick the real app; `missing` → set one; `unresolved` → AppX, launch by name
4. Hand the resolved `exe` back to the caller skill; do not open anything from this skill

## Rules

- Read-only on the registry — no writes to `UserChoice`, `ProgId`, or `HKCR`; the hash makes them ineffective anyway
- Never change the OS default silently, and never report a default as changed without re-reading it
- The frequency counter is a fallback, not a preference: a real `UserChoice` always wins over the counter
- `stale` means the exe is gone — verify with `Test-Path` before claiming it, and never treat a bare ProgId string as proof
- Report evidence for every row (`ProgId`, `exe`, registry path in `references/windows-associations.md`); `-` when unknown
- Do not install, uninstall, or move apps while resolving — that is `/download-program` or `/list-program-in-computer` territory
- Ask before opening Settings or writing the counter when the user did not request it

## Expected Outcome

- A table with one row per target: the real default app, its executable, and whether that executable still exists
- A defensible fallback chain (Windows default → usage counter → installed list → ask) when the default is unusable
- A clear action for the broken cases: open `ms-settings:defaultapps` with the exact target named
- A resolved `exe`/`appName` other skills can launch without hardcoding a browser or editor
