---
name: follow-tool-repomix
description: Pack codebases into AI-friendly single files with Repomix
argument-hint: "[scope]"
related:
  - save-to-github-temp
  - save-to-github-temp
  - follow-tool-crw
  - follow-tool-gitleaks
  - follow-context-engineering
---

## Goal

Use Repomix to pack a repository or directory into one AI-friendly file for LLM context, review, or sharing — with the right selection, compression, and security settings for the job.

## Scope

Use `follow-tool-repomix` for packing codebases into a single prompt-ready file

- Boundary: use `repomix` to serialize a codebase into one file for an LLM or a handoff — to publish that snapshot to the private GitHub scratch repo use `/save-to-github-temp pack`; to copy real workspace files use `/save-to-github-temp`; to fetch web pages instead of code use `/follow-tool-crw`
- Latest: `repomix` 1.18.1, engines `node >=22.0.0` (verified 2026-10-24)
- Install: `bunx repomix@latest` / `npx repomix@latest` (no install) · `bun add -g repomix` · `npm install -g repomix` · `brew install repomix` · `docker run --rm -v "$PWD":/app ghcr.io/yamadashy/repomix`
- References: [command-line-options](https://repomix.com/guide/command-line-options) | [security](https://repomix.com/guide/security) | [mcp-server](https://repomix.com/guide/mcp-server) | [llms-full](https://repomix.com/llms-full.txt)

## Execute

### 1. Pack A Local Directory

> Goal: Produce one packed file from a directory with the default settings

```bash
bunx repomix@latest
bunx repomix@latest src
bunx repomix@latest . -o packed.xml
```

- Default output is `repomix-output.xml` in the current directory
- Write the output outside the packed tree (OS temp or a parent dir) so re-runs never pack a previous snapshot
- Repomix respects `.gitignore` and `.repomixignore` by default

### 2. Select Files

> Goal: Pack exactly the files the task needs

```bash
bunx repomix@latest . --include "src/**/*.ts,**/*.md"
bunx repomix@latest . -i "**/*.test.ts,**/fixtures/**"
bunx repomix@latest . --stdin < file-list.txt
```

- `--include` and `-i/--ignore` take comma-separated globs
- `--stdin` reads a newline-separated file list — pair it with `git diff --name-only` or `git ls-files`
- `--no-gitignore`, `--no-dot-ignore`, `--no-default-patterns` widen the selection; only use them when the defaults hide files you need
- `--include-empty-directories` keeps the tree shape for empty folders

### 3. Pack A Remote Repository

> Goal: Pack a GitHub-hosted repo without cloning it yourself

```bash
bunx repomix@latest --remote yamadashy/repomix
bunx repomix@latest --remote https://github.com/user/repo --remote-branch main
```

- Accepts `owner/repo`, a full repository URL, or a commit URL
- Remote repository config files are untrusted and are never loaded by default
- `--remote-trust-config` (or `REPOMIX_REMOTE_TRUST_CONFIG=true`) enables it; the trust marker is pinned by content hash under `$TMPDIR/repomix/trusted-remotes/`
- Keep remote configs untrusted unless you have reviewed the repository

### 4. Choose The Output Style

> Goal: Match the format to the consumer

```bash
bunx repomix@latest . --style markdown
bunx repomix@latest . --style json
bunx repomix@latest . --split-output 1mb
```

- Styles: `xml` (default), `markdown`, `json`, `plain`
- `--parsable-style` escapes special characters so the output stays valid inside the chosen format
- `--output-file-path-style target-relative|cwd-relative` controls path headers; keep `target-relative` so no working-directory path leaks
- `--output-show-line-numbers` adds line numbers for review handoffs
- `--split-output <size>` (for example `1mb`, `500kb`) writes numbered parts — use it instead of truncating
- `--no-file-summary`, `--no-directory-structure`, `--no-files` drop sections when the reader only needs code
- `--header-text` and `--instruction-file-path` prepend context or task instructions to the packed file

### 5. Compress And Trim

> Goal: Cut token count without losing the code's meaning

```bash
bunx repomix@latest . --compress
```

- `--compress` uses Tree-sitter to keep signatures and structure, dropping bodies (about 70% smaller)
- `--remove-comments` and `--remove-empty-lines` trim noise
- `--truncate-base64` shortens embedded binary payloads
- Compression is lossy — never compress when the reader must edit or quote the exact code

### 6. Control The Token Budget

> Goal: Know the size before the output reaches a model

```bash
bunx repomix@latest . --token-count-tree 500
bunx repomix@latest . --token-budget 200000
```

- `--token-count-tree [threshold]` prints a per-file token tree, limited to files above the threshold
- `--token-count-encoding o200k_base|cl100k_base` picks the tokenizer
- `--token-budget <number>` fails the run when the total exceeds the budget — the output is still written, so check the exit code
- `--top-files-len` controls how many largest files the summary lists

### 7. Keep The Security Check On

> Goal: No credential leaves the machine inside a packed file

- Secretlint runs by default; files with detected secrets are excluded from the output and reported in the summary
- Binary files contribute their path but not their contents
- `.repomixignore` excludes paths permanently; it is the normal way to drop generated or sensitive directories
- `--no-security-check` disables the gate — never use it on code you will share, commit, or paste into an external model
- Always review the output and the security summary before handing it to an LLM

### 8. Use MCP Mode

> Goal: Let an agent pack and search a codebase through MCP

```bash
repomix --mcp
claude mcp add repomix -- npx -y repomix --mcp
```

- `--sandbox [dir]` confines file tools to a directory: absolute, `~`, `..`, and drive-qualified paths are refused, and remote packing plus skill generation are disabled
- Tools exposed: `pack_codebase` (`directory`, `compress`, `includePatterns`, `ignorePatterns`, `outputPatterns`, `topFilesLength`, `style`), `read_repomix_output`, `grep_repomix_output`, `file_system_read_file`, `file_system_read_directory`

### 9. Generate A Skill From A Repository

> Goal: Turn a repo into an Agent Skill scaffold

```bash
bunx repomix@latest . --skill-generate demo --skill-project-name my-app --skill-output .claude/skills
```

- Writes `<output>/<name>/SKILL.md` plus `references/summary.md`, `project-structure.md`, `files.md`, and `tech-stacks.md`
- `-f/--force` overwrites an existing directory — review before forcing
- Incompatible with `--stdout` and `--copy`
- Treat the generated skill as a draft; verify its claims against the code

### 10. Watch And Configure

> Goal: Re-pack on change and keep settings in one file

```bash
bunx repomix@latest . -w
bunx repomix@latest --init
bunx repomix@latest -c repomix.config.json
```

- `-w/--watch` re-packs on every change; it cannot be combined with `--remote`, `--stdout`, `--stdin`, `--split-output`, `--skill-generate`, or `--copy`
- `--init` writes a config file; `-c/--config <file>` selects one; `--global` uses the home-directory config
- Prefer the config file over long flag lists when a repository is packed repeatedly

## Rules

### 1. Command Selection

- One directory for a prompt or review: `repomix <dir>`
- Only some files: `--include` / `--ignore`, or `--stdin` from `git diff --name-only`
- Hosted repository: `--remote <owner/repo>`
- LLM context: `--style markdown` + `--compress`; tooling input: `--style json`
- Large repository: `--split-output` and `--token-budget` before sending anything
- Agent integration: `--mcp` with `--sandbox`
- Never repack the output directory into the next run

### 2. Security

- Keep Secretlint enabled; a reported file is excluded, not scrubbed
- Never pass `--no-security-check` on material that will be shared or committed
- Leave remote configs untrusted unless the repository has been reviewed
- Exclude `.env*`, keys, certificates, and generated credentials through `.repomixignore`
- Review the packed file before it leaves the machine

### 3. Token Discipline

- Compress first, then measure with `--token-count-tree`, then set `--token-budget`
- Split instead of truncating; a truncated pack hides files the reader may need
- Drop sections with `--no-file-summary` / `--no-directory-structure` when the reader only needs code
- Keep line numbers only when the consumer will cite lines

### 4. Output Hygiene

- Write output outside the repository or add `repomix-output.*` to `.gitignore`
- Use `target-relative` paths so absolute local paths never appear in a handoff
- Treat generated skills as drafts and verify them against the code
- Use `/save-to-github-temp pack` when the packed snapshot must be published
- Use `/follow-tool-gitleaks` and `/check-secrets` for a deeper secret sweep
- Use `/follow-context-engineering` when the packed file is meant to shape an agent's context

## Expected Outcome

- The codebase packs into the format, size, and selection the task needs
- Secretlint reports no credential in the output
- Token count and splits are known before the file reaches a model
- No absolute local path or generated artifact leaks into the packed file
