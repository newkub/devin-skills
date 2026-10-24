# Package Structure

> Package layout, split rules, and `src/` placement. Cited as `update-agents-skills-global` `## Conventions → Directory Structure` / `→ When To Split` / `→ Src` — keep the section names stable.

## Directory Structure

```text
<skill>/ SKILL.md (entry — workflow + dispatch) · references/ (passive knowledge, flat) ·
best-practices/ (recommended patterns + pitfalls — required for follow-lib-*/follow-tool-*) ·
usecases/<scenario>.md (scenario recipes — required for follow-lib-*/follow-tool-*) ·
workflows/<name>/SKILL.md (invocable child) ·
templates/ examples/ scripts/ src/ guide/
```

- Start with a single `SKILL.md` — add subdirs only when truly needed
- every file ≤250 lines with clear SRP
- `references/` flat — nested → `/flatten-directory --mode refs`
- `## Execute` mentioning CLI/web/MCP → `src/` (`### Src` below)

### Package Shapes

- `review-*` package = a single `SKILL.md` + `templates/` (the output skeleton the skill fills — findings table, confirm line, fix-route block; one file per artifact, named `<artifact>.md`, pointed at from `SKILL.md`) for each of the nine assessors (`review`, `review-issues`, `review-gaps`, `review-test`, `review-use-lib-effective`, `review-dot-agents-global-and-fix`, `review-github-pr`, `review-github-issue`, `review-by-all-stakeholder`) and each of the eleven deep-inside preset doors (`review-refactor` … `review-a11y`, owned by the preset map)
  - the per-label dimensions are rows in `deep-review-codebase-everything/references/review.md`, not skills
  - exceptions with real assets: `review-github-pr` has `workflows/`, `review-by-all-stakeholder` has role catalogs in `references/`, `review-dot-agents-global-and-fix`/`update-review-cli` carry `src/`/`scripts/`
  - every domain review delegates to `/deep-review`, dispatched per the artifact-seeded rows in `deep-review-codebase-everything/references/review.md` `## Dimension Matrix` (no inline domain catalog in its `SKILL.md`)
  - `review-dot-agents-global-and-fix` = the tooling-package exception (has real `src/`/`scripts/`/`workflows/`)
- `report-*` package = `SKILL.md` + `templates/<artifact>.md` — the deliverable skeleton the skill fills in (table header with its own real columns, one example row, fill rules); a report skill without `templates/` is incomplete, and `SKILL.md` must point at the file it uses
- knowledge other skills read cross-cuttingly (living docs, catalogs, boilerplate) → the `references/` of the canonical owner skill, or inline in the owner's SKILL.md (e.g. `deep-review-codebase-everything/SKILL.md`, `follow-my-techstack/references/`) — there is no `shared/` at the repo root
- `follow-create-*` packages = a single `SKILL.md` only — no `references/`
- `follow-lib-*`/`follow-tool-*` packages = `SKILL.md` entry + `references/apis.md` (+ `cli.md` for a real CLI) + `best-practices/` + `usecases/` — the SKILL.md points at all three
- `follow-lang-*` packages = `SKILL.md` entry + `references/` (at least `toolchain.md` — ecosystem-tool table: tool | role | command/install, no version pins) + `workflows/` (at least `setup-project/SKILL.md` — first-time project scaffold; the SKILL.md dispatches to them by argument)
- version pins/doc links are never pinned in the file (goes stale fast — principle: `/follow-up-to-date`) — Execute must have a "run /deep-research + /follow-best-practice" step to live-check the latest versions/practices before every implement; necessary file structures/command patterns may be inlined in SKILL.md or `references/`

### Package Shapes For Review, Design, Refactor, Architecture, And Production

- `deep-review` family packages = `SKILL.md` + `templates/` for the general `/deep-review` dispatcher, the `deep-review-codebase-everything` engine, and the eleven `review-*` doors — the matrix, ledger, report, and fix routing stay in `deep-review-codebase-everything`, a door only narrows labels + owns its fix route + ships its own output skeleton in `templates/`; the family's tier/labels/fix-route map is `deep-review-codebase-everything/references/presets.md` (`## Preset Map`), validated by `scripts/verify-matrix.ts`
- `design-*` packages = a single `SKILL.md`, with `references/` only when a spec is too large for the body (e.g. `design-web-prototype/references/cli-explorer-spec.md`)
- `refactor` package = a single `SKILL.md` (file-level refactor scopes: verify before → plan → refactor → update references → verify after) — no `workflows/`, no `references/`
- architecture knowledge lives in the top-level `follow-architecture` package = `SKILL.md` (pattern selection + `## Monorepo Architecture` + `## File Structure By Workspace Type`) + `references/clean-arch.md` and `references/layered-arch.md` (the two pattern guides — file structure, layer table, rules), dispatched from `/refactor` for architecture scopes; the event-driven detail file was deleted by owner decision — messaging work routes to `/improve {events,queues,realtime}`
- `implement-to-production` = a single `SKILL.md` likewise — its `references/tdd.md`, `references/input-flows.md`, and `workflows/setup-coverage/` are merged inline as `## TDD Loop`, `## Input Flows`, and `## Setup Coverage` (the `setup-coverage` argument routes to the inline section via `## Scope`)

## When To Split

1. `SKILL.md` >250 → move detailed content to `references/<topic>.md`, leaving the high-level workflow + pointer; multiple responsibilities → split into `references/`; multiple execute patterns → `templates/`; content duplicating another skill → merge; very different goals → `workflows/` or `SKILL.md ## Subagents` per the matrix
2. How: identify the excess/duplicated part → create the sub-file → replace with a short pointer → update internal links → `/review-dot-agents-global-and-fix` + `/deep-validate`

## Src

CLI/terminal/web/browser/MCP → create `src/`: CLI → `/follow-create-cli` (Rust or Bun/TS); web → `/deep-review` first + `/visualize-in-web` HTML entry; MCP → `/follow-create-mcp` (try Rust) + update `mcp_config.json`; test dev/build/run per stack; helper scripts → `/use-scripts`; has `src/` → `/convert-git-submodules` + `/ship` after validation
