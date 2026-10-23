---
name: check-downloads-dir
description: List or read files from Downloads by pattern, or analyze the latest file group in a time window
argument-hint: "[time-range-or-count | list | pattern]"
related:
  - check-screenshots-dir
  - use-agents-capture
  - analyze-codebase-quality
  - report
  - suggest-next-action
allowed-tools:
  - exec
  - grep
  - glob
  - read
  - find_file_by_name
  - ask_user_question
---

## Goal

List or read chosen files from `Downloads` by pattern, or pull the latest file group by time range and analyze the content/context that occurred together

## Scope

- For files saved in `Downloads` — images, documents, archives, installers
- `group` mode analyzes file groups, not a single file; `list` mode lists and reads chosen files by pattern
- Never upload or send files outside the environment

## Execute

### 0. Detect Mode

> Goal: pick the workflow that fits the argument

1. Argument is `list`, a glob pattern, or a filename (e.g. `*.png`, `screenshot*`, `report.pdf`) → `Mode: List`
2. Argument is a time range or count (e.g. `5m`, `30m`, `10`) or empty → `Mode: Group`
3. Unclear → `/ask-me`

### Mode: Group

> Goal: analyze the latest file group that occurred together

1. `Locate Downloads` — `exec` `Get-ChildItem -Path "$env:USERPROFILE\Downloads" -File | Sort-Object LastWriteTime -Descending` on Windows, `ls -lt ~/Downloads` on macOS/Linux, or a path the user gives; record name, size, modified date; no files → stop and report
2. `Group by recent window` — use `time-range-or-count` when the user gives it; otherwise default to files within `5 minutes` before the latest, or the `10` closest recent files; filter files whose `LastWriteTime` falls in the same window (no more than 5 minutes apart by default); sort oldest to newest to see the event sequence
3. `Read files` — image (png, jpg, jpeg, gif, webp, bmp, svg) → `read` the image content; text (txt, md, json, csv, yml, yaml, log) → `read`; binary/archive (zip, exe, msi, pdf) → report name, size, type instead of content; more than 20 files → ask the user to confirm before analyzing all, or take the top 20 most recent
4. `Analyze group` — trace the sequence from the first to the last file; files from the same download batch usually relate (installer + docs, one asset set); find patterns (same source, versions, file sets, export bundles); summarize the action, intent, and likely outcome — e.g. setting up a tool, exporting work, saving references; images → analyze the content like `/check-screenshots-dir`
5. `Report` — `/report` with columns `No. | Filename | Timestamp | Type | Key Observations`; summarize the overall context and likely next steps; `/suggest-next-action` if needed

### Mode: List

> Goal: list and read chosen files from Downloads for other workflows

1. `Resolve Downloads path` — Windows `C:\Users\<username>\Downloads`; macOS/Linux `~/Downloads`; a path the user gives → use that one
2. `List files` — `find_file_by_name` with pattern `*` on the Downloads path, or the pattern the user gives (`*.png`, `screenshot*`); sort by file name or last modified; no files → stop and report
3. `Filter and select` — many files → ask the user which files they want; the user names files clearly → pick those files
4. `Read file` — image (png, jpg, jpeg, gif, webp, bmp, svg) → `read`; text (txt, md, json, csv, yml, yaml) → `read`; binary that cannot be read → report its size and type
5. `Report` — `/report` with columns `No. | Name | Size | Type | Modified` for the listing and the chosen files; `/suggest-next-action`

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

- Use /check-screenshots-dir if needed
- Use /report if needed
- Use `/use-agents-capture` if needed
- Use `/analyze-codebase-quality` if needed

## Expected Outcome

- `group` mode: the latest file group is selected by time window
- Every file in the group is analyzed, or the reason it wasn't is reported
- A summary of the context/events that occurred
- A table of details for each file
- `list` mode: the Downloads listing and the chosen files are read or reported
- `/suggest-next-action` if applicable
