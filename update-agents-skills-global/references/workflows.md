# Workflows And Subagents

> Where content goes, how workflows are named, and how subagent profiles are declared. Cited as `update-agents-skills-global` `## Conventions → Workflows And Subagents` — keep the section name stable.

## Decision Matrix

| Content | Goes to |
|---------|---------|
| Read by the parent as context/lookup (docs, checklists, snapshots) | `references/` |
| Separately invocable workflow with its own Goal/Execute | `workflows/` |
| Independent work needing separate context, parallelism, or custom tools/model | `workflows/` with `subagent: true`/`agent:` or `SKILL.md ## Subagents` |
| Mechanical/deterministic work | `scripts/` |

## Workflows

`workflows/<name>/SKILL.md` follows the same spec as a normal skill, `name` = `<parent>-<name>`; the runtime does not register them as `/command` — the parent dispatches via `argument-hint` + dispatch table; self-contained work → `subagent: true`/`agent:`

## Lifecycle Prefixes

Use when there really are multiple lifecycles — a single workflow/knowledge item → `references/`:

- `setup-` first-time install/config
- `config-` edit config without clobbering
- `follow-` best practices for a sub-domain
- `optimize-` measure baseline before/after
- `improve-` raise quality, preserve behavior
- `update-` minimal diff, idempotent
- `deploy-` deploy until live + verified
- `migrate-` move with rollback
- `integrate-` bridge/pipeline
- `verify-` post-action check for a domain
- `check-` read-only domain check (parent `check-*` → bare name)
- `report-` special report format
- ~~`fix-`~~ retired → `### 7. Fix` (`deep-review-codebase-everything/SKILL.md`)

## Consolidation

Several top-level skills doing the same work in one domain → move them to `parent/workflows/<domain>/`, the parent becomes the dispatcher, bulk-update callers `/old` → `/parent` + verify no dangling refs before deleting the old dir; conversely, a workflow intended as standalone → promote to `<parent>-<domain>`, and a workflow that is really a general convention owned by no single parent → promote to a top-level skill dispatched from the parent (`refactor/workflows/architecture/` → `follow-architecture`, dispatched from `/refactor` `### 3`); never use `workflows/` for pure knowledge → `references/`; never duplicate content across both `references/`+`workflows/`; merged skills' workflows go to `workflows/`, not `references/`; always `/update-references` after a move

## Subagents

No `subagents/` folder — profiles stay inline under `## Subagents` in the parent's `SKILL.md` (one `### <role>` per profile: `Inputs`/`Tools`/`Execute`/`Output`/`Constraints`) and enforce `SKILL.md` ≤250 lines; a profile too detailed → keep the full version at `references/subagent-<name>.md` and link from that block; the runtime doesn't register these profiles directly — they must be materialized as agents via `/update-devin-global-subagents` into `.devin/agents/`, `.agents/agents/`, `~/.config/devin/agents/` or `%APPDATA%\devin\agents\`; a role already exists (`reviewer`, `qa`, `security-auditor`) → reference `agent:` directly, never create a new one; permission/model/tool semantics go in `Constraints`/`Tools` instead of frontmatter

## Profile skill-updater

Profile `skill-updater` (bulk update):

- Inputs: `skill`, `instructions`, `conventions`, `references?`
- Tools: read/write/edit/exec/grep
- Execute: read the package → apply instructions with minimal diff → check callers (referenced sites need follow-up, don't fix them yourself) → validate frontmatter+≤250+no-placeholder
- Output: return a per-file result table + summary
- Constraints: change only your own skill, never touch `AGENTS.md`/`global_rules.md`, no commit, don't guess content
