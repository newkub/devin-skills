---
name: save-session-to-desktop
description: Save coding sessions as Desktop launchers that open a terminal and resume them
argument-hint: "[harness] [bundle|one-per-session] [limit | session-id ...]"
related:
  - check-agents-session
  - use-devin-cli
  - follow-tool-qoder-cli
  - open-in
  - ask-me
  - report
---

## Goal

Turn coding sessions from the harness in use into clickable Desktop launchers so one click opens a terminal in the session's working directory and resumes that exact session

## Scope

- Harnesses with a verified store and resume flag: Devin CLI (`devin -r <id>`) and Qoder CLI (`qoder -r <id>`)
- Two shapes: one launcher per session, or one bundle launcher that opens every chosen session as a Windows Terminal tab
- Read-only on every session store; the only artifacts written are launchers on the Desktop
- Boundary: list or search sessions without launching → `/check-agents-session`; open a folder or a terminal directly → `/open-in explorer` / `/open-in wezterm`

## Execute

### 1. Resolve The Target

> Goal: know the harness, the Desktop path, and the launcher shape before writing anything

1. Harness argument `devin` or `qoder` → use it; no argument → pick the harness whose store was modified most recently (the one in use); tie or none → `/ask-me`
2. A harness whose CLI errors on `--help` is unusable (a broken shim) → skip it and say so
3. Desktop path: `powershell -NoProfile -Command "[Environment]::GetFolderPath('Desktop')"` — never hardcode a profile path, OneDrive moves the real Desktop
4. Shape argument `bundle` → one launcher that opens all chosen sessions as tabs; `one-per-session` → one launcher each; no argument → `bundle` when `wt` is on `PATH` and more than one session is chosen, otherwise `one-per-session`
5. Default limit 10 sessions, newest activity first; an explicit limit or session-id argument overrides it
6. Session facts: `check-agents-session` (Devin query), `use-devin-cli` (`devin -c` / `devin -r <id>`), `follow-tool-qoder-cli` (`qoder -c` / `qoder -r [id]`)

### 2. Read Sessions Readonly

> Goal: get id, working directory, title, and last activity per session without touching the store

1. Devin CLI: open `%APPDATA%\devin\cli\sessions.db` `readonly` with `bun:sqlite`, then
   ```sql
   SELECT id, title, working_directory,
          datetime(last_activity_at, 'unixepoch', 'localtime') AS last_activity
   FROM sessions WHERE hidden = 0
   ORDER BY last_activity_at DESC LIMIT ?
   ```
2. Qoder CLI: enumerate `%USERPROFILE%\.qoder\projects\<encoded-cwd>\<session-id>.jsonl`; the file stem is the session id and the file mtime is the last activity
3. Qoder working directory: read `<session-id>/state.json` `workspaceDirectories[0]`; missing or empty → do not reconstruct it from the encoded folder name, skip the session and say why
4. Unreadable source (locked database, missing folder) → report the error and continue with the other harness

### 3. Choose Sessions

> Goal: save what the user asked for, not everything by default

1. Session ids in the argument → use exactly those
2. No ids → show the newest `limit` rows as a `/report` table (No., Harness, Session, Title, Working Dir, Last Activity) and ask with `/ask-me` (multi-select) which to save
3. Working directory missing on disk → keep the row but mark it, and confirm before saving; a launcher with a gone cwd fails on click
4. A session with no id or no cwd is refused, with the reason stated

### 4. Dry Run

> Goal: show every path before anything lands on the Desktop

1. Build the exact file list: one `<desktop>\<name>.cmd`, plus a `.lnk` only when icons were requested
2. Name it `resume-<harness>-<slug>-<id8>.cmd`; slug comes from the title with `\/:*?"<>|` and control characters removed, trimmed to 40 characters, `untitled` when empty
3. Path already exists → append `-2`, `-3`, ...; never overwrite silently
4. Print the list and get explicit confirmation before writing

### 5. Write Launchers

> Goal: one click resumes the session in its own working directory

1. One-per-session `.cmd`:
   ```bat
   @echo off
   cd /d "<working_directory>"
   <resume command>
   ```
2. Bundle `.cmd` when `wt` is on `PATH`:
   ```bat
   @echo off
   wt -d "<dir1>" cmd /k <resume1> ; new-tab -d "<dir2>" cmd /k <resume2>
   ```
3. Bundle fallback without `wt`: one `start "" "<launcher>.cmd"` line per session
4. Resume command: `devin -r <id>` for Devin CLI, `qoder -r <id>` for Qoder CLI; an unknown harness → stop, never guess a flag
5. Escape `%` as `%%` inside the file; write UTF-8 without BOM so Thai titles and paths survive
6. Optional `.lnk` when icons are requested: PowerShell `WScript.Shell` `CreateShortcut` with `TargetPath` = the `.cmd`, `WorkingDirectory` = the session cwd, `IconLocation` = the harness binary
7. A launcher carries a cwd and a resume command only — no tokens, no credential-bearing URLs, no session content

### 6. Verify And Report

> Goal: prove the click works, then report what was saved

1. Show the created files with `/open-in explorer` on the Desktop when the user wants to see them
2. Run a launcher only when asked — starting a session is a visible action; never batch-launch unrequested
3. Report with `/report`: No., Launcher, Harness, Session, Working Dir, Shape
4. Close with the count saved and the path of the bundle launcher when one was written

## Rules

- Every session store is read-only; never create, edit, hide, or delete a session
- The Desktop path comes from the OS lookup, never a hardcoded profile path
- Dry run plus confirmation before writing; overwriting never happens silently
- A resume flag is verified against `--help` or its owner skill before use; never guessed
- Launchers hold only a working directory and a resume command; no secrets, no session content
- Do not launch a session without an explicit request
- Windows-first: `.cmd` launchers and Windows Terminal tabs; another platform → ask, never assume
- No `**` bold; backticks for paths, commands, and skill names

## Expected Outcome

- Clickable Desktop launchers: one per session, or one bundle that opens every chosen session as a tab
- Each launcher opens a terminal in the session's working directory and resumes that exact session
- Session stores untouched; every written path shown and confirmed before it exists
- A report table naming the launcher, harness, session, working directory, and shape
