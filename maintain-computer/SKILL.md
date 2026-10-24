---
name: maintain-computer
description: Inspect computer health across 15 areas, score it, and delegate fixes to owner skills
argument-hint: "[report|deep|fix|disk|os-updates|security|network|power|dev|<area>]"
related:
  - check-system-env
  - check-shell-profile
  - check-open-ports
  - check-orphan-programdata
  - check-uncommit
  - check-unpush
  - check-secrets
  - cleanup-disk-computer
  - cleanup-artifact
  - cleanup-docker
  - delete-temp
  - update-all-program-in-computer
  - ask-me
  - report
  - follow-single-of-source
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
---

## Goal

Give one read-only health pass over the machine — disk, OS, security, network, power, and dev hygiene — then route every finding to the skill that already owns the fix

## Scope

- Cross-platform: Windows, macOS, and Linux resolved at runtime
- Inspects 15 dimensions defined in `references/dimensions.md`
- Each dimension names one owner skill; this skill never reimplements that logic
- Owns only the dimensions with no existing owner: OS patch state, disk health, network, backup, scheduled tasks, time sync, power
- Delegates the rest to their owner: `/check-orphan-programdata`, `/cleanup-docker`, `/check-update`, `/check-open-ports`, `/check-system-env`, `/check-shell-profile`, `/check-uncommit`, `/check-unpush`
- Follows `/follow-single-of-source`: every fix stays in the skill that already owns it
- Uses `/ask-me` at every real decision point: an ambiguous mode or area, a probe blocked by elevation, and which findings to fix next
- Modes:
  - `report` (default) — read-only, all 15 dimensions with fast probes
  - `deep` — read-only, same dimensions plus slow probes (S.M.A.R.T. extended, `DISM /ScanHealth`, full `sfc /verifyonly`, large-tree scans)
  - `<area>` — one dimension only: `disk`, `leftover`, `docker`, `temp`, `programs`, `os-updates`, `security`, `network`, `disk-health`, `backup`, `startup`, `env`, `tasks`, `power`, `dev`
  - `fix` — run `report` first, then delegate confirmed fixes to owner skills
- Not for: installing software (`/download-program`), uninstalling (`/uninstall-program-in-computer`), project cleanup (`/cleanup-project`), or a full security audit (`/scan-security`)

## Execute

### 1. Resolve Mode And Platform

> Goal: fix the mode, the OS, and the exact command set before probing anything

1. Parse the argument; no argument → `report`
2. Ambiguous argument (a vendor name, `disk` vs `disk-health`, a partial path) → `/ask-me` with the valid modes; an unknown argument → list the valid modes and stop
3. Detect the OS and shell: Windows runs PowerShell, macOS and Linux run bash
4. Load `references/platform-checks.md` for the resolved OS only
5. State in one line: mode, OS, and that the run is read-only unless mode is `fix`
6. Run `/check-system-env` when the shell, PATH, or root paths are unclear
7. If the machine is remote or the shell cannot reach a probe → record the dimension as `unknown`, do not install tools to enable it

### 2. Collect Evidence

> Goal: one probe per dimension, with a recorded raw result

1. Walk the 15 rows of `references/dimensions.md` in order (1 → 15) or only the selected area
2. Run each probe exactly as written for the resolved OS
3. Capture for every row: `status` (`pass` / `warn` / `fail` / `unknown`), a one-line `evidence` (a number, a path, or the failing check), and the `impact` in plain words
4. Never upgrade a `status` on intuition — a row with no successful probe stays `unknown`
5. When a probe is blocked by elevation (`Access denied`, an unstarted service, a command the shell cannot run) → `/ask-me` with two options: keep the row `unknown` (recommended) or re-run that one probe elevated; no answer → `unknown`
6. Cap total probe time: skip slow probes in `report` mode and note them as `deferred`; run them in `deep` mode
7. Never pipe full command output into the conversation; keep only the lines the threshold needs

### 3. Score And Rank

> Goal: convert evidence into one number and a stable order

1. Score with `references/health-score.md` — 0–100, fixed deductions per rule
2. Sort rows by severity (`fail` → `warn` → `unknown` → `pass`), then by reclaimed size or impact
3. Compute the reclaimable total across disk-related rows
4. Report the score band and the top three rows that would raise it most
5. Same machine state and mode → the same score and the same order

### 4. Report

> Goal: one table the user can act on, with no action taken yet

1. Emit the table with columns `No.` `Area` `Status` `Evidence` `Impact` `Action` `Owner skill` `Risk`
2. `No.` is the first column, numbered 1..n in the sorted order
3. `Action` is a proposal: `none`, `review`, `clean`, `update`, `enable`, `confirm`. Never a ready-to-run destructive command as the first step
4. `Risk` is `low` / `medium` / `high` — a change that touches boot, login, security policy, or partitions is `high`
5. Add the health score line and the four-part summary:
   - ผ่าน (pass) — what is already healthy
   - ควรทำ (should do) — safe, reversible fixes
   - ต้อง confirm — changes that need explicit approval
   - ตรวจไม่ได้ (not verifiable) — `unknown` rows and the reason
6. Keep the chat report in Thai with short bullets; use `/report` when a structured artifact is requested
7. Close with one `/ask-me` that offers the next action: safe fixes only, a named subset of the `No.` rows, a single row in `/deep`, or nothing; the answer decides what runs next, and `fix` starts only after that answer

### 5. Delegate Fixes

> Goal: only when mode is `fix`, and only after confirmation

1. Do not run this step for `report`, `deep`, or area modes
2. Group rows by owner skill and hand each group to that skill with the exact evidence row
3. Ask once per group with `/ask-me`, multi-select over that group's findings, and list every command that mutates state next to its option; a group with no selection is skipped
4. Route destructive or broad groups to their owner: disk cleanup → `/cleanup-disk-computer`, artifacts → `/cleanup-artifact`, containers → `/cleanup-docker`, temp → `/delete-temp`, packages → `/update-all-program-in-computer`
5. Re-run only the affected dimensions after the fixes and report the before/after score
6. Stop on the first owner skill that refuses or reports an unresolved risk; do not work around it
7. If an answer is unclear or a group's risk is `high`, re-ask with the exact paths and sizes before any command runs

## Rules

### 1. Read-Only By Default

- `report`, `deep`, and every area mode never delete, move, update, or change a setting
- Only mode `fix` may mutate state, and only through an owner skill

### 2. Confirm Before Every Change

- Any delete, service change, boot/login change, security policy change, partition action, or restore-point operation requires a dry run plus explicit confirmation
- A confirmed fix from a previous run does not authorize the same fix in a later run

### 3. Evidence Before Verdict

- Every row needs a probe result; no probe → `unknown`, never `pass`
- A `fail` must quote the failing value or path in `evidence`
- Never infer a problem from a folder name, an age, or a size alone

### 4. Single Source Of Truth

- Delegate to the owner skill listed in `references/dimensions.md`; never duplicate its commands here
- If an owner skill is missing → use the nearest skill in the same family and say so in the report
- If two dimensions overlap → report both rows and note the overlap instead of merging them

### 5. Untouched Surfaces

- Never edit the registry directly, create or delete restore points silently, disable a security control, or change `hosts` without showing the diff first
- Never read secret values into the report; redact and route to `/check-secrets`
- Never install a probe tool to complete a row — record `unknown` instead

### 6. Deterministic

- Thresholds live in `references/dimensions.md` and the point conversion in `references/health-score.md`; do not tune them per run
- Fixed order: dimensions 1 → 15, then severity sort
- Report the probe command and the OS in the header so a reader can reproduce the result

### 7. Ask Instead Of Guessing

- `/ask-me` owns three decisions: an ambiguous mode or area, a probe blocked by elevation, and which findings to fix after the report
- Never ask what a probe can answer — run the probe first, ask only when the answer changes what runs next
- Every ask carries a recommended option and concrete choices (`No.` rows or area names), never open-ended prose
- In a `/dont-ask-me` session, follow `/follow-your-suggestion` with the safe default: keep the row `unknown`, take the recommended option, and mutate nothing

## Expected Outcome

- One table covering the selected dimensions, every row backed by a probe result
- A 0–100 health score with the band, the top deductions, and the reclaimable size
- A four-part summary separating healthy, safe-to-do, needs-confirmation, and not-verifiable items
- Every real decision point answered through `/ask-me`, with the recommendation stated
- Zero changes in read-only modes; in `fix` mode, every change confirmed, owned by another skill, and re-verified
