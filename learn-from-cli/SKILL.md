---
name: learn-from-cli
description: Learn a CLI tool from --help, subcommands, machine-readable output; summarize capability
argument-hint: "[cli-command]"
related:
  - learn
  - learn-from-web
  - check-types-definition
  - check-my-global-cli
  - use-scripts
  - check-reference
  - report
---

## Goal

Learn and extract the knowledge of a CLI tool from the real binary — `--help`, subcommands, flags, machine-readable output — then summarize its capabilities, commands and usable usage

## Scope

Use when learning a CLI tool installed on the machine or in the project:

- Explore the CLI's command tree, subcommands, options, flags
- Confirm the real version and output formats before writing docs or how-tos
- Fill the CLI reference of the skill bound to that tool

Not learning from web docs (use `/learn-from-web`) or a TypeScript API surface (use `/check-types-definition`)

## Execute

### 1. Identify CLI Target

> Goal: know what the CLI is and that it's actually installed

1. Take the CLI name or binary path from the user
2. Verify the CLI is really installed — `<cli> --version` or `where <cli>` (Windows) / `which <cli>`
3. If not on the machine → check `check-my-global-cli/references/global-cli-commands.md` or run `/check-my-global-cli`; if it needs installing → tell the user first
4. If it's a subcommand of a larger tool → start from the root command

### 2. Discover Command Surface

> Goal: map every subcommand, option, flag

Follow [references/cli-discovery.md](references/cli-discovery.md) — `--version` → `--help` → `help <subcommand>` → `<subcommand> --help` → machine-readable metadata (`agent-context`, `completion`)

### 3. Extract Knowledge

> Goal: extract knowledge from real output

1. Record command groups and hierarchy
2. Record the important options/flags with default values and argument types
3. Record exit codes, output formats (text/json/table) and the env vars the CLI uses
4. Actually run common commands to observe real output
5. Record edge cases and common pitfalls found from running

### 4. Write Content Or CLI Reference

> Goal: the knowledge is recorded completely

1. If learning for yourself → summarize in chat per `/report`
2. If invoked for a skill's dependency → write the real `references/<dep>/cli.md` per `update-devin-global-skills` (`## Conventions → Write References`) (mandatory, never skip)
3. Use the real output from running — never guess flags or options
4. If writing >10 files → run `/use-scripts`
5. Run `/check-reference` against the commands written

## Rules

### 1. Run Real Commands

- Every claim must come from real output of `<cli> --help` or actual runs — no guessing
- If the output is large → summarize only the parts relevant to the use case

### 2. Source Priority

- The real CLI binary (`--help`, `--version`, subcommand help) is the primary source
- Web docs are the fallback when the CLI can't be used — continue with `/learn-from-web`

### 3. Content Quality

- Use backticks for `commands`, `flags`, `paths`
- No TODO/MOCK/placeholder — every example must have actually been run
- No more than 250 lines per file

## Expected Outcome

- Full knowledge of the CLI's command surface from the real binary, not guessed from docs
- A summary or `references/<dep>/cli.md` with real commands, flags, output formats
- If invoked for a skill dependency → a real reference file with no placeholders
