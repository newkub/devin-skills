---
name: use-scripts
description: Create scripts to automate work with Bun, nushell, pwsh, or ast-grep
argument-hint: "[target]"
related:
  - use-bun-shell
  - use-bun-native-api
  - create-files-in-os-temp
  - use-nu-shell
  - use-pwsh-shell
  - use-astgrep
  - follow-tool-rolldown
  - follow-lib-esm-sh
  - transform
  - run-verify
  - update-references

---

## Goal

Create scripts to automate work and process files with Bun native APIs, nushell, pwsh, or ast-grep as appropriate

## Scope

Use for creating scripts in the workspace with Bun native APIs, nushell, pwsh, or ast-grep — including multi-file edits via scripts (merged `/edit-with-use-scripts`, see `### 5. Edit Files Via Scripts`)

## Execute

### 1. Choose Shell And Type

> Goal: Choose the right shell/script type

1. Default: use this skill or `/use-bun-shell` when:
   - You need Bun native APIs to automate work
   - JS/TS scripts are the default choice
   - You need a JavaScript/TypeScript runtime
   - Working with JSON, HTTP, async/await, npm packages
   - You need Bun native APIs such as `Bun.file`, `Bun.write`, `Bun.$`
   - You need cross-platform scripts in JS/TS
2. Use `/use-nu-shell` when:
   - You need structured data pipelines
   - Reading/processing JSON, CSV, TOML, YAML with built-in commands
   - You need readable cross-platform shell syntax
   - You do not need .NET or Windows-only features
3. Use `/use-pwsh-shell` when:
   - Working on Windows, especially system administration
   - You need to call .NET APIs, registry, WMI, COM
   - You need verbose try-catch error handling
4. Use `ast-grep` when:
   - You need AST-based code search
   - You need code transformation or linting
5. If unsure → default to Bun native APIs, and state the reason if switching to another shell

### 2. Choose Script Location

> Goal: Choose the location for the script

1. Run `/create-files-in-os-temp` to create and manage throwaway scripts in the OS temp directory (never created inside the project)
2. `.devin/scripts/` — permanent scripts (committed, kept for reuse)
3. Do not create `temp/` or `.devin/scripts/temp/` in the project workspace
4. If using Bun native APIs directly → use `os.tmpdir()` or `$env:TEMP` only when the skill is not a fit

### 3. Create Script

> Goal: Write the script to standards

1. Write it composable: `createScript()` returns state + actions
2. Use Bun native APIs for `.ts` scripts without Node.js libraries unless there is no alternative (see `/use-bun-shell`, `/use-bun-native-api`)
3. Use `nu` for `.nu` scripts when processing structured data
4. Use `pwsh` for `.ps1` scripts when Windows-specific
5. Use CDN imports for external dependencies that Bun native APIs do not cover: `https://esm.sh/<name>`
6. Use `eta` via `https://esm.sh/eta@4.6.0` for template/render in Bun scripts (eta `4.6.0 (verified 2026-09-26)` — see `/follow-lib-esm-sh` for the CDN convention)
7. If you need fast JS/TS AST parsing → use `oxc-parser` via `https://esm.sh/oxc-parser` or `bun add oxc-parser` (`0.149.0 (verified 2026-09-26)`)
8. If you need fast bundling → use `rolldown` per `/follow-tool-rolldown` (`1.2.11 (verified 2026-09-26)`, uses the same `oxc` parser)
9. Add a `dryRun` option for testing

### 4. Test And Execute

> Goal: Test and run the script safely

1. Run the script in dry run mode to see the result
2. Fix errors before the real run
3. Run:
   - `bun run <script>.ts` for Bun scripts
   - `nu <script>.nu` for Nushell scripts
   - `pwsh <script>.ps1` for PowerShell scripts
   - `ast-grep scan` for AST operations
4. Delete scripts from OS temp once done, or let `/create-files-in-os-temp` handle cleanup

### 5. Edit Files Via Scripts

> Goal: Edit multiple files through a reproducible, auditable script (merged `/edit-with-use-scripts`)

Use when the task is a complex file edit, several files must be changed at once, or you need reproducibility and an audit trail — not for simple single-file edits (`/edit-only`), config files (`/edit-manual`), or AST-pattern edits (`/use-astgrep rewrite`)

1. Identify: take the file list + changes from the user — run `/scan-codebase` to find related files and patterns, plan minimal changes with `/dont-over-engineer`
2. Script requirements (all mandatory):
   - dry run mode by default — execute for real only after preview + user confirm
   - backup mode: copy the original files before editing
   - validate file structure after editing (JSON/YAML/TS syntax)
   - summary report: files changed, number of changes, errors if any
   - keep it in OS temp only, never commit into the repo
3. AST edit logic in the script → use ast-grep via `Bun.$`/napi per `/use-astgrep-programmatic`, or delegate the whole flow to `/use-astgrep rewrite`
4. Dry run → check output → fix the script → dry run again until correct → ask for user confirmation → execute
5. After executing: run `/run-verify` (lint/typecheck/scan) → on failure fix with `/resolve-errors` (max 3 attempts → rollback from backup + report) → run `/update-references`
6. Cleanup: delete scripts from temp + delete backups once all validation passes — keep the script/output as an audit trail if needed

## Rules

### 1. Script Type Selection

- `/use-bun-shell` — JS/TS, JSON, HTTP, async, cross-platform
- `/use-nu-shell` — structured data, pipelines, cross-platform shell
- `/use-pwsh-shell` — Windows system admin, .NET, COM, WMI
- `ast-grep` — AST-based code search/transformation

### 2. File Locations

- Run `/create-files-in-os-temp` for throwaway scripts (OS temp directory, never inside the project)
- `.devin/scripts/` — permanent scripts (committed)
- Use `.ts` for Bun, `.nu` for Nushell, `.ps1` for PowerShell

### 3. Edit Scripts Safety

- A file-editing script must always have a dry run mode before real execution and must create a backup before editing
- If validation fails → roll back from the backup and report
- Never execute for real without user confirmation after a dry run
- The script must produce the same result when run with the same input — no side effects beyond the intended file edits

### 4. Bun Native API Preference

- When using Bun, use only Bun native APIs for `.ts` scripts without Node.js libraries unless there is no alternative
- `Bun.Glob` instead of `fast-glob`, `Bun.$` instead of `execa`, `Bun.file()` + `Bun.write()` instead of `fs-extra`
- Do not import `node:fs` directly if `Bun.file`/`Bun.write` can do the job
- If you need fast JS/TS AST parsing → prefer `oxc-parser` over `acorn` or `babel`
- If you need fast bundling → use `rolldown` per `/follow-tool-rolldown`

### 5. CDN Libraries

```typescript
import { z } from "https://esm.sh/zod"
import { glob } from "https://esm.sh/glob"
import { render } from "https://esm.sh/eta@4.6.0"
```

- CLI: `zod`, `cac`, `consola`, `@clack/prompts`, `picocolors`
- Parsing: `yaml`, `gray-matter`, `jsonc-parser`
- JS/TS AST: `oxc-parser` for fast JS/TS parsing/transformation
- Bundling: `rolldown` for bundling with the `oxc` parser (see `/follow-tool-rolldown`)
- File System: `pretty-bytes`, `env-paths`, `semver`
- Async: `p-limit`, `p-queue`, `p-map`
- Template: `eta` for generating text/files from templates

### 6. Decision Records

- State the reason every time a particular shell is chosen
- Record the reason in the script's comment or docstring
- When falling back from one shell to another, state the reason

## Expected Outcome

- Scripts run successfully with Bun, nushell, pwsh, or ast-grep
- Shell selection has clear reasons
- Dependencies come via CDN (no install needed)
- `eta` can be used for template/render in Bun scripts
- Scripts are in the correct location per Rules
- Temp scripts in `$env:TEMP` are deleted after use, permanent scripts are kept for reuse
- Dry run mode for testing before real execution
- /use-pwsh-shell /use-bun-shell /use-astgrep (programmatic workflow) can be used as appropriate

