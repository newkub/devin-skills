---
name: record-video-terminal-with-asciinema
description: Record a terminal session as a video/`.cast` with asciinema for CLI testing
argument-hint: "[scope]"
related:
  - run-dev
  - watch-terminal
  - record-video-web-with-agents-browser
  - resolve-errors
---

## Goal

Record a terminal session with `asciinema` as a `.cast` (text-based) or convert it to a video, for CLI testing, demo, and documentation

## Scope

Use for workflows that need to record terminal sessions, such as `/run-dev`, `/watch-terminal` — `asciinema` is the primary tool; other tools (`vhs`, `terminalizer`, `tuirec`) are alternatives per Rules item 1

## Execute

### 1. Analyze Requirements

> Goal: Analyze Requirements

Analyze the requirements before choosing the output

1. What format is needed: text-based (`.cast`), GIF, or video
2. Automation or manual recording
3. Embed in HTML or a standalone file
4. Use in CI/CD or local only

### 2. Install Asciinema

> Goal: Install Asciinema

Install `asciinema` (primary tool)

1. Install with `cargo install asciinema` or `scoop install asciinema` — not available on npm (verified 2026-09-12)
2. Check with `asciinema --version`
3. If you need GIF/MP4 from `.cast` → install `agg` (asciinema gif generator) with `cargo install agg`

### 3. Record Session

> Goal: Record Session

Record a terminal session with `asciinema`

1. Record with a specified command: `asciinema rec <path>.cast --command "<command>"`
2. Record an interactive session: `asciinema rec <path>.cast`, then type `exit` when done
3. Limit idle periods: add `--idle-time-limit <seconds>` or set the env `ASCIINEMA_IDLE_TIME_LIMIT`
4. Set the terminal size: `--cols <n> --rows <n>` (80x24 or 120x30 recommended)
5. Convert `.cast` to GIF: `agg <path>.cast <path>.gif`

### 4. Verify Recording

> Goal: Verify Recording

Verify the recorded file

1. Check that the file was created at the specified path
2. Play it back with `asciinema play <path>.cast` to confirm the recording
3. Check that the file size is not too large

## Rules

### 1. Tool Selection

- Default/CI/CD/Quick: use `asciinema` — text-based `.cast`, small file, editable, diffable
- Automated recording from config: use `vhs` (`go install github.com/charmbracelet/vhs@latest` or `winget install charmbracelet.vhs` — the npm `vhs` is a different package, verified 2026-09-12)
- Demo that needs style: use `terminalizer` (`bun add -g terminalizer`, `terminalizer@0.12.0`, verified 2026-09-12)
- TUI app that needs a keystroke script: use `tuirec` (`go install github.com/gui-cs/tuirec/cmd/tuirec@latest`)

### 2. File Management

- Store files in `test/recordings/` or `docs/recordings/`
- Name files after the test case, e.g. `cli-help.cast`, `login-flow.gif`
- Delete old files before recording new ones to avoid confusion
- Do not commit large files to git (`.cast` can be kept because it is small)

### 3. Quality Standards

- Set an appropriate terminal size (80x24 or 120x30) with `--cols`/`--rows`
- Use an easy-to-read monospace font
- Avoid recordings that are too long; split into parts if needed
- Use `--idle-time-limit` to trim idle periods

### 4. Integration With Workflows

- Call `/record-video-terminal-with-asciinema` in workflows that need recording
- Use in `/run-dev` to record development sessions
- Use in `/watch-terminal` for monitoring
- Recording a web page → `/record-video-web-with-agents-browser`

### 5. Error Handling

- Call `/resolve-errors` when an error is hit
- Check that the chosen tool is installed before use
- Check disk space before recording
- If a tool does not support Windows, choose another tool

## Expected Outcome

- The terminal session is recorded with `asciinema` successfully
- Files are stored systematically
- An alternative tool is chosen correctly when `asciinema` does not fit
- Integrates smoothly with other workflows
