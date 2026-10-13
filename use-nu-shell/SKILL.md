---
name: use-nu-shell
description: Use Nushell for shell commands, structured data pipelines, and scripting
argument-hint: "[command]"
related:
  - deep-research
  - use-bun-shell
  - use-pwsh-shell
  - follow-best-practice
  - use-scripts

---

## Goal

Use `nushell` (`nu`) for shell commands, structured data pipelines, and cross-platform scripting

## Scope

Use it for tasks that need to read/process structured data, file operations, or cross-platform shell commands with `nu`. For other shells, refer to `/use-bun-shell` or `/use-pwsh-shell`; create automation scripts with `/use-scripts`, and use `/follow-best-practice` for domain-specific best practices

## Execute

### 1. Deep Research Current Nu

> Goal: Confirm the current version/syntax from the official docs before using it — syntax changes often across minor releases

1. Run `/deep-research` against `https://www.nushell.sh/book/` and `https://github.com/nushell/nushell/releases` when writing a complex pipeline/script, or when `references/package-manifest.md` is older than 30 days
2. Verify the commands/flags you plan to use via `help <command>` in the actually installed version — the changelog moves often
3. If you find a new breaking change → update `references/package-manifest.md`, then carry on

### 2. Check Nushell Installation

> Goal: Check for and install `nu`

1. Run `nu --version` — latest `0.115.1 (verified 2026-09-12)` (0.115 reworks YAML, adds the `$ans` REPL variable, and Helix-style editing)
2. If it's missing, install it:
   - Windows: `winget install nushell` or `winget install --id Nushell.Nushell`
   - macOS/Linux: `brew install nushell`
   - Rust: `cargo install nu`
3. If you can't install it → fall back to `pwsh` or `powershell`, then report it
4. Never fall back to `cmd` automatically

### 2. Run Commands With Nushell

> Goal: Run commands with `nu`

1. Single command: `nu -c '<command>'`
2. Script: `nu script.nu`
3. Use the built-in file operations: `ls`, `cp`, `mv`, `rm`, `mkdir`, `touch`
4. Read/write structured data: `open <file>`, `save <file>`
5. Use `^<command>` for external binaries, e.g. `^git status`
6. View help: `help <command>` or `<command> --help`

### 3. Use Pipelines And Filters

> Goal: Use `nu` pipelines and filters

1. pipeline: `<input> | <filter> | <output>`, e.g. `ls | where size > 10kb | sort-by size`
2. `$in` for the pipeline input
3. `get`, `select`, `where`, `sort-by`, `reverse` for tables/records
4. `each`, `par-each`, `for` for iteration
5. `describe` to see the output's type

### 4. Write Nushell Scripts

> Goal: Write scripts for automation

1. Use `def` for custom commands
2. Use `let` for immutable variables and `mut` for mutable ones
3. Use `print` for side-effect logging
4. Handle the data types: int, float, string, bool, list, record, table, filesize, duration
5. Use `into <type>` to convert data, e.g. `into int`, `into string`, `into datetime` — `into filesize`/`into duration` were removed, so use literals such as `10kb`, `5min` or `into value` instead
6. Keep scripts in `.devin/scripts/` when they're reusable, or in `$env:TEMP` when they're temporary, per `/use-scripts`

### 5. Integrate With Use Scripts

> Goal: Connect with `/use-scripts`

1. Use `nu` for structured data pipelines
2. Set a `dryRun` option in every script
3. State your reason when you choose `nu` over another shell
4. Refer to `/use-scripts` for shell-selection decisions

## Rules

### 1. When To Use Nushell

- Processing structured data (JSON, CSV, TOML, YAML)
- Readable cross-platform shell commands
- File operations with the built-ins
- When you don't need .NET or Windows-only features

### 2. Data Types And Pipelines

- Know the types: int, float, string, bool, date, duration, filesize, list, record, table
- Use `open`/`save` for structured files
- Use `get`, `select`, `where`, `sort-by` for table operations
- Use `describe` to see the type

### 3. External Commands

- Use `^<command>` when it collides with a `nu` internal
- Use `lines` to split external output into lines
- Use the `spread operator` `...$list` for external arguments, e.g. `^git ...$args`

### 4. Fallback

- Fall back to `pwsh` when `nu` isn't supported or isn't installed
- Don't use `cmd` by default
- State the reason every time you fall back

### 5. Avoid File Creation

Try to run commands without creating temporary files:

- Use `nu -c` for one-off commands
- Don't create a `.nu` file just to run a temporary command
- If a command has side effects, dry-run it with `print` or preview it with `first`/`take` first
- If you must write a file, check the path with `path expand` first

### 6. Script Location

- Use `.devin/scripts/` for permanent scripts
- Use `$env:TEMP` for throwaway scripts (the OS temp directory; don't create them in the project)
- Use `.nu` for Nushell scripts
- alias stub: `/use-nushell` — forwards to this skill

## Expected Outcome

- `nu` installed and working
- Commands run correctly with `nu`
- Scripts in the right location
- Making use of `nu`'s structured data pipelines
- Fallbacks with a clear reason
