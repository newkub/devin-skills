---
name: record-video-web-with-agents-browser
description: Record WebM/MP4 video from a web page with the `agent-browser record` CLI
argument-hint: "[url]"
related:
  - use-agent-browser
  - record-video-terminal-with-asciinema
  - use-agents-capture
  - resolve-errors
---

## Goal

Record WebM or MP4 video from a web page with `agent-browser record` for debugging, CI evidence, product walkthroughs, and repro reports — per https://agent-browser.dev/recording

## Scope

Use to record video of web page usage, demos, and test scenarios with the `agent-browser` CLI (recording pipes frames into `ffmpeg` — the rest of `agent-browser` does not need ffmpeg)

Boundary: video recording is only possible with `agent-browser` — `chrome-devtools-mcp` has no record tool (inspect/screenshot/perf trace only; see `/use-chrome-devtools` `## Tool Selection`)

## Execute

### 1. Install And Verify

> Goal: agent-browser + ffmpeg ready to use

1. Install/check `agent-browser` per `/use-agent-browser` item 1 — if not present: `bun add -g agent-browser` then `agent-browser install`
2. Check `ffmpeg` on `PATH` with `agent-browser doctor` — the encoder report under "Recording" must include `libvpx` and `libx264`
3. If ffmpeg is missing → install it with the OS package manager (e.g. `winget install ffmpeg`, `scoop install ffmpeg`, `brew install ffmpeg`, `sudo apt install ffmpeg`)

### 2. Choose Output Format

> Goal: Choose the container per use case

1. `.webm` — VP8 via libvpx (default for web evidence)
2. `.mp4` — H.264 via libx264 (shareable and playable in any player)
3. other extensions (`.mkv`, `.mov`) — handed to ffmpeg as H.264 in that container
4. a path with no extension → `record start` rejects immediately because ffmpeg cannot choose a container

### 3. Open And Start Recording

> Goal: Start recording on the desired tab

1. Open the browser: `agent-browser open <url> --headed`, then wait with `agent-browser wait --load networkidle`
2. Start recording: `agent-browser record start <path>.webm` — records the active page as-is (hydrated state, session/cookies preserved)
3. Or start with navigation: `agent-browser open`, then `agent-browser record start <path>.webm <url>` — the current tab navigates first, and recording starts when the page is loaded
4. Record in a separate tab: `agent-browser tab new <url>`, then `agent-browser record start <path>.webm`
5. extra options (per Rules items 2-3): `--fps <1-60>`, `--cursor`, `--contact-sheet [--contact-sheet-threshold <0-1>]`

### 4. Perform Actions

> Goal: Perform the actions to record

1. Use `agent-browser snapshot -i` to see interactive elements and refs
2. Use `agent-browser click @e1`, `agent-browser fill @e2 "text"`, `agent-browser scroll down 500`
3. Use `agent-browser wait <ms>` to delay between actions so the video is easy to read (demo for humans → wait 500ms between steps)
4. Use `agent-browser screenshot <path>.png` alongside — screenshots capture still state precisely, while video shows timing/transitions/overlays

### 5. Stop Recording

> Goal: Stop and flush the file before closing the session

1. Use `agent-browser record stop` — reports the `frames` written to the file and `capturedFrames` from Chrome
2. `record stop` must always be done before `close` so the file is fully flushed
3. Record again immediately: `agent-browser record restart <path>.webm [url] [options]` — stops the old one and starts a new one
4. Close the browser with `agent-browser close`, then report the file path

## Rules

### 1. Video Format

- Always set an explicit extension (`.webm` or `.mp4`) — a path without an extension is rejected
- Store in `test/recordings/` or `docs/recordings/`; name after the scenario, e.g. `login-flow.webm`
- Do not commit large video files to git

### 2. Frame Rate And Options

| Option | When |
|--------|----------|
| `--fps 60` | drag/animation/scroll polish — short clips that need per-frame evidence (bitrate ~2x that of 30) |
| `--fps 30` (default) | flows, CI evidence, general walkthroughs |
| `--fps 1-15` | soak/long sessions where the video is more timeline than motion |
| `--cursor` | walkthrough — animated pointer + click ripple (overlay inert, hidden from the a11y snapshot, removed on stop; screenshots during record are also included) |
| `--contact-sheet` | need timestamped PNGs that highlight changes (up to 100 frames) |
| `--contact-sheet-threshold <0-1>` | default 0.05 — selects a frame when pixels change beyond the threshold; implies `--contact-sheet` |

### 3. Recording Workflow

- `record start` records the active page as-is — does not create a new tab/context; cookies/localStorage are preserved
- The actual fps is capped by the page's repaint rate — a page rendering < 60 fps yields a video < 60 fps
- The latest Chrome frame is held between repaints, so the duration matches wall clock
- The viewport follows the current browser settings — set it before recording with `agent-browser set viewport <w> <h>`

### 4. CI Evidence Pattern

```bash
#!/bin/bash
set -e
cleanup() {
  agent-browser record stop 2>/dev/null || true
  agent-browser close 2>/dev/null || true
}
trap cleanup EXIT

agent-browser open https://app.example.com/login
agent-browser record start "./artifacts/login-flow.webm"
agent-browser snapshot -i
agent-browser fill @e1 "demo@example.com"
agent-browser click @e3
agent-browser wait --url "**/dashboard"
```

- Store recordings as CI artifacts when browser failures cannot be diagnosed from text output
- Use `trap cleanup EXIT` to always flush the file

### 5. Limitations And Errors

- recording adds overhead to automation — the higher the fps the heavier; long clips consume disk (60 fps ≈ 2x bitrate)
- A restricted headless environment may lack codecs/GPU — `agent-browser doctor` reports the available encoders
- ffmpeg built without `libvpx`/`libx264` → cannot write that format
- `agent-browser` not installed → `/use-agent-browser` fallback; other errors → `/resolve-errors`
- Check disk space before a long recording

## Expected Outcome

- A WebM/MP4 video records all the desired web page actions
- The file is fully flushed before closing the session and stored systematically
- fps/options (`--cursor`, `--contact-sheet`) chosen to match the use case
- The CI evidence pattern is reproducibly usable
