---
name: follow-tool-ctx-rs
description: Use ctx CLI for agent-history search, code provenance blame, graph impact, and output sift
argument-hint: "[search|blame|graph|sift|setup]"
related:
  - code-search
  - git-search
  - follow-tool-git
  - deep-research
  - learn-from-cli
  - check-reference
  - report
---

## Goal

Use the ctx CLI (ctx.rs) as working memory for prior agent work: search indexed session history, attribute committed code to the session that produced it, inspect code relationships, and compact noisy tool output — ctx retrieves evidence, the agent performs the analysis

## Scope

- Covers `ctx search`, `show`, `locate`, `blame`, `graph`, `sift`, plus setup, health, source, and import commands
- Boundary: ctx search reads indexed agent history, not the working tree — filesystem and AST search live in `/code-search`; git history search lives in `/git-search`
- Any history-backed command needs an initialized index; graph and sift work without history setup
- References: [apis](references/apis.md) · [cli](references/cli.md) · best-practices/
- References: [Blame Readiness And Limits](best-practices/blame-readiness.md), [Evidence Discipline](best-practices/evidence-discipline.md), [History Search Versus Code Search](best-practices/history-vs-code-search.md)

## Execute

### 1. Confirm Availability And Health

> Goal: know whether ctx can answer before relying on it

1. `ctx --version` — not installed → `mise use -g github:ctxrs/ctx@latest` (Windows/macOS/Linux); without mise, Windows: `irm https://ctx.rs/install.ps1 -OutFile $env:TEMP\ctx-install.ps1; & $env:TEMP\ctx-install.ps1`; macOS/Linux: `curl -fsSL https://ctx.rs/install -o /tmp/ctx-install.sh && sh /tmp/ctx-install.sh`
2. `ctx status` and `ctx sources` — confirm the local index is readable and which provider roots exist; history and blame can each be unindexed while graph and sift still work
3. No index yet → `ctx setup`; stale index → `ctx import --all`; first indexing can take time
4. ctx or the required evidence unavailable → state the limit instead of inventing results

### 2. Search Prior Agent Sessions

> Goal: ground the task in earlier decisions, constraints, and failed attempts

1. Start with natural language: `ctx search "<query>"` — lexical BM25 by default
2. Narrow with `--workspace`, `--file`, `--since`, `--session`, `--content-scope transcript|calls|outputs`
3. Broaden with repeated `--term`; use `--events` for dense event hits and `--primary-only` to exclude subagent work
4. Read an existing index without starting or waking a worker: `--refresh off`
5. Direct CLI searches exclude the current session tree when detection is unambiguous — `--include-current-session` restores it

### 3. Inspect Evidence

> Goal: verify a hit before acting on it

1. `ctx show event <ctx-event-id> --window 5` — open the matched event with neighbors
2. `ctx show session <ctx-session-id> --mode lite|full|log` — compact, full, or tool-level transcript
3. `ctx locate event|session <id>` — resolve source identity
4. Cite provider, ctx session ID, and event ID; label any conclusion you derive as your own synthesis

### 4. Trace Code Provenance With Blame

> Goal: connect committed code to the session that produced it

1. `ctx blame file <path> --lines <start>:<end>` — or `ctx blame file <path>` for the whole file
2. `ctx blame commit <sha>` or `ctx blame pr <url>` for a whole change
3. Attribution pending or stale → `ctx import --all` or `ctx setup --wait`, then retry
4. Results name proven production, possible attribution, conflicts, or missing evidence — report which one

### 5. Map Relationships With Graph

> Goal: follow calls and dependencies before changing shared code

1. `ctx graph stats` — confirm an indexed snapshot exists
2. `ctx graph search <symbol>`, `ctx graph callers <symbol>`, `ctx graph impact <symbol>`
3. Refresh with `ctx graph index .` or `ctx graph update` when the task needs current data
4. Potential impact is not proof of runtime behavior; keep unresolved and truncation limits visible

### 6. Compact Output With Sift

> Goal: cut tool-output noise only when the user opted in

1. Run `ctx sift -- PROGRAM ARG...` to execute once and compact, or `ctx sift compact <file>` for existing output
2. Restore a reversible representation with `ctx sift restore --encoding <encoding> <file>`
3. Never rerun a command just to recover output that may repeat side effects

### Use Cases

| Scenario | Use case |
|---|---|
| Resume earlier work without repeating it | `usecases/resume-prior-investigation.md` |
| Attribute a line range to the agent session | `usecases/attribute-lines-to-session.md` |
| Check impact before a refactor | `usecases/impact-check-before-refactor.md` |

## Rules

### 1. Evidence Discipline

- Prefer default text output for reading; use `--format json` for scripts and exact fields
- Open cited events before repeating a claim as fact
- Search and graph results are bounded — never claim exhaustive audits or corpus-wide counts

### 2. Boundaries

- `ctx search --file` filters indexed history metadata, not the working tree — use `/code-search` for files
- Use `/git-search` for pickaxe, `git log -L`, and `git grep`; use ctx blame for agent attribution
- Graph evidence never becomes history attribution
- Use `/follow-tool-git` for git operations that change state

### 3. Privacy And Verification

- Keep transcripts, source paths, and command output private unless sharing reviewed material is authorized
- Never paste secrets or large raw transcripts; summarize instead
- Documented commands and flags drift — verify with `/learn-from-cli` or `/deep-research` when a command fails, then `/check-reference` the tables
- Report findings with `/report` when the result is a table of sessions, events, or attributions

## Expected Outcome

- Prior agent work is recalled from real indexed evidence with ctx IDs cited
- Code provenance comes from `ctx blame` with its confidence and limits stated
- Impact checks use graph evidence and never masquerade as runtime proof
- The boundary between history search, filesystem search, and git search stays explicit
