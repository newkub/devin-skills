---
name: check-local-dir
description: List or analyze files in Downloads, Screenshots, or any local dir by pattern or time-window group
argument-hint: "[downloads|screenshots|<path>] [group|list|pattern|time-range]"
related:
  - use-agents-capture
  - analyze-codebase-quality
  - report
  - suggest-next-action
  - run-dev
  - ask-me
allowed-tools:
  - exec
  - grep
  - glob
  - read
  - find_file_by_name
  - ask_user_question
---

## Goal

List or read chosen files from a local directory by pattern, or pull the latest file group by time range and analyze the content/context that occurred together

## Scope

- `source` argument: `downloads` (default), `screenshots`, or any `<path>` the user gives
- `downloads` — images, documents, archives, installers in the Downloads folder
- `screenshots` — captures in the Screenshots folder; analyze groups of images, not a single image
- `group` mode analyzes file groups; `list` mode lists and reads chosen files by pattern
- Never upload or send files outside the environment

## Execute

### 0. Detect Source And Mode

> Goal: pick the target directory and the workflow that fits the argument

1. Resolve `source`: `downloads` → Windows `C:\Users\<username>\Downloads`, macOS/Linux `~/Downloads`; `screenshots` → Windows `%USERPROFILE%\Pictures\Screenshots`, macOS/Linux `~/Pictures/Screenshots`; an explicit path the user gives → use that path; no source argument → default to `downloads`
2. Argument is `list`, a glob pattern, or a filename (e.g. `*.png`, `screenshot*`, `report.pdf`) → `Mode: List`
3. Argument is a time range or count (e.g. `5m`, `30m`, `10`) or empty → `Mode: Group`
4. Unclear → `/ask-me`

### Mode: Group

> Goal: analyze the latest file group that occurred together

1. `Locate files` — `exec` `Get-ChildItem -Path "<dir>" -File | Sort-Object LastWriteTime -Descending` on Windows, `ls -lt <dir>` on macOS/Linux; record name, size, modified date; no files → stop and report
2. `Group by recent window` — use `time-range-or-count` when the user gives it; otherwise default to files within `5 minutes` before the latest, or the `10` closest recent files; filter files whose `LastWriteTime` falls in the same window (no more than 5 minutes apart by default); sort oldest to newest to see the event sequence
3. `Read files` — image (png, jpg, jpeg, gif, webp, bmp, svg) → `read` the image content; text (txt, md, json, csv, yml, yaml, log) → `read`; binary/archive (zip, exe, msi, pdf) → report name, size, type instead of content; more than 20 files → ask the user to confirm before analyzing all, or take the top 20 most recent
4. `Analyze group` — trace the sequence from the first to the last file; files from the same batch usually relate (installer + docs, one asset set); find patterns (same source, versions, file sets, export bundles); summarize the action, intent, and likely outcome
5. For `screenshots` (or image groups): analyze UI/state changes, error messages, and the flow being performed; for IDE/terminal captures → extract the code, commands, and paths that appear; for new captures to compare against, use `/use-agents-capture`
6. `Report` — `/report` with columns `No. | Filename | Timestamp | Type | Key Observations`; summarize the overall context and likely next steps; `/suggest-next-action` if needed; when the analysis shows app behavior to re-check live, route to `/run-dev`

### Mode: List

> Goal: list and read chosen files for other workflows

1. `List files` — `find_file_by_name` with pattern `*` on the resolved directory, or the pattern the user gives (`*.png`, `screenshot*`); sort by file name or last modified; no files → stop and report
2. `Filter and select` — many files → ask the user which files they want; the user names files clearly → pick those files
3. `Read file` — image (png, jpg, jpeg, gif, webp, bmp, svg) → `read`; text (txt, md, json, csv, yml, yaml) → `read`; binary that cannot be read → report its size and type
4. `Report` — `/report` with columns `No. | Name | Size | Type | Modified` for the listing and the chosen files; `/suggest-next-action`

## Rules

### 1. Group Not Single

- In `group` mode, don't analyze just the single latest file unless the user is explicit
- A group needs at least 2 files; if only one is found → report and stop

### 2. Time Window

- Default window: no more than 5 minutes back from the latest file
- If the user gives `time-range-or-count`, use that value
- If files fall outside the window, split them into separate groups and pick the latest group

### 3. Privacy

- Never upload, send, or share files off the machine
- Never copy files elsewhere outside the workspace
- If a file looks sensitive (credentials, personal docs) → ask the user before reading and censor it in the report

### 4. Safety

- Never delete, move, or edit the original files
- Never execute the installers/binaries found — analyze only
- If there are more than 20 files, confirm first

### 5. Quality Follow-up

- If the group shows code/config quality signals → route to `/analyze-codebase-quality` or `/check-correctness` as appropriate

- Use /use-agents-capture if needed
- Use /report if needed
- Use /suggest-next-action if needed
- Use /run-dev if needed
- Use /ask-me if needed
- Use /analyze-codebase-quality if needed

## Expected Outcome

- The requested source directory is resolved correctly (downloads, screenshots, or the given path)
- `group` mode: the latest file group is selected by time window, every file analyzed or the reason reported, with a context summary and a detail table
- `list` mode: the directory listing and the chosen files are read or reported
- No files leave the machine; originals are never modified
- `/suggest-next-action` if applicable
