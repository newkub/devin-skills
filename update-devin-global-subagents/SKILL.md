---
name: update-devin-global-subagents
description: Create, update, and orchestrate global subagents via AGENT.md and job roles
argument-hint: "[agent-name]"
related:
  - update-devin
  - review-devin-global-harness
  - follow-agents-md
  - update-docs
  - use-subagents
  - deep-review
  - deep-validate
  - ship
  - report
  - ask-me
---

## Goal

Create or update `AGENT.md` for Devin subagents so they are correct, complete, practically usable, and aligned with standard skills — frontmatter, sections, line count, style, safety (merged review dims from: review-devin-global-subagents); this is a single-file package, every validation criterion is inlined below (no `references/`)

## Scope

Use when creating a new agent or editing an agent in `~/.config/devin/agents/`, `.devin/agents/`, `.agents/agents/`, or `%APPDATA%\devin\agents\`, including orchestrating subagents for complex work

Review-only → `/review-devin-global-harness` (layer `subagents`)

See also: /follow-agents-md, /update-agents-md

## Execute

### 1. Identify Target Subagent

> Goal: know the target `AGENT.md` and its current state before editing

1. Take the agent name and role from the user
2. Run `/list-devin-global-subagents` to confirm whether the agent exists (not found + creating → proceed; not found + editing → Critical, stop and report)
3. Determine the target directory: `<agents-root>/<agent-name>/`
4. If the agent exists → read the current `AGENT.md` to identify what needs changing; record name + directory
5. If the name is duplicated or unclear → run `/ask-me`

### 2. Select Archetype

> Goal: choose the right permission structure for the role

1. Read-only auditor: `reviewer`, `verifyer`, `security-auditor` — deny `write`, `edit`
2. Builder/Implementer: `fixer`, `improver`, `refactorer`, `code-simplifier` — allow `edit`, `write`, `exec` for test/lint/build
3. Planner/Designer: `architect`, `api-designer`, `uxui-designer` — may write spec/design docs but not modify main source
4. Executor/Operator: `test-runner`, `release`, `deployment-specialist` — allow running the relevant commands

### 3. Write Frontmatter

> Goal: frontmatter conforms to the Devin spec

1. Required fields (all four): `name`, `description`, `model`, `allowed-tools`; plus `permissions`
2. `name`: lowercase kebab-case, matches the directory name, no spaces/special characters
3. `description`: ≤100 characters, clearly states the responsibility (Thai or English)
4. `model`: `sonnet` by default; must not be empty
5. `allowed-tools`: only the tools actually needed (`read`, `grep`, `find_file_by_name`, `code_search`, `exec`, `edit`, `write`), backticks for names, must fit scope — never `*`/`all`, never `exec` when commands aren't needed
6. `permissions`:
   - `allow`: safe commands such as `Exec(bun run test)`, `Exec(bun run lint)`, `Exec(bun run typecheck)`, `Exec(bun run build)`
   - `deny`: `write`, `edit` for read-only; or `exec` when terminal execution isn't wanted; always `deny` risky system paths (see `## Rules → 2. Safety And Permissions`)

### 4. Write Prompt Body

> Goal: prompt consistent with the role and spec

1. Section order is fixed: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome` (never swap, skip, or add a section)
2. `## Goal`: one clear sentence; `## Scope`: work boundaries and focus areas
3. `## Execute`: at most 10 steps using `### N. Step Name` + `> Goal:` + numbered lists
4. `## Rules`: 3-5 role-specific rules; `## Expected Outcome`: what must be delivered
5. Style: backticks for `tools`, `commands`, `paths`, `skill-name` (never for general prose); never `**` bold; English headings in Title Case (never ALL CAPS/all-lowercase); English body content
6. No `TODO`/`MOCK`/placeholder text (`lorem ipsum`, `xxx`, `foo bar`)

### 5. Validate And Score

> Goal: `AGENT.md` passes every check and is ready to use

1. Frontmatter: both `---` delimiters present; required fields `name`, `description`, `model`, `allowed-tools` complete; `permissions` with `deny` present
2. Sections: required order intact; file ≤250 lines (count frontmatter + content); `name` matches the directory and is unique
3. Style/safety: backticks for identifiers, no `**` bold, Title Case headings; no hardcoded secrets; `allowed-tools` not overly broad
4. Severity weights — Critical 0, High 25, Medium 50, Low 75, Info 100; review score = sum(weights) / count(findings); grade A ≥90, B ≥80, C ≥70, D ≥60, F <60
5. Severity mapping: missing required field / `name` ≠ directory / hardcoded secrets = Critical; missing `permissions`/`deny` or uncovered risky paths / missing section / wrong order / >250 lines = High; overly broad `allowed-tools` / `**` bold / placeholder = Medium; `description` >100 chars / heading not Title Case = Low
6. Score <70 → fix via `/update-devin-global-subagents` before proceeding; ≥70 → passes review
7. Report via `/report table` (columns: Category, Severity, Finding, Evidence, Action); every finding needs evidence — `AGENT.md` path + line/field + actual value + recommended action
8. Issues found → fix and revalidate until green

### 6. Orchestrate Subagents In Complex Tasks

> Goal: split complex work into subtasks and run subagents by role in parallel, then merge and deliver

1. Decompose the task into independent subtasks by layer (frontend, backend, qa, devops, security, architecture); each subtask has clear input, expected output, success criteria; order dependent subtasks
2. Run `/list-devin-global-subagents` to pick roles matching each subtask; a needed role that doesn't exist → `/use-related-skills` or create a new `AGENT.md` here
3. Use `/use-subagents` to spawn subagents in parallel; pass complete context (task, constraints, files, expected output); one role per subagent, never overlapping/duplicate subtasks
4. Merge every subagent's output into a single deliverable before finalizing (never ship one subagent's output as final); resolve conflicts with `/resolve-errors`; call out contradictory recommendations that were excluded
5. Run `/deep-review then-fix` on the merged output; a subtask with a complex workflow → extra `/deep-review`; gaps → spawn more subagents
6. Run `/deep-validate`, then `/ship` if there are changes, then `/report` summarizing what each subagent did

### 7. Update References

> Goal: keep consistency with the catalog

1. If other agents are involved → update `related` or cross-references
2. If a skill the agent should use exists → add it to `## Execute` or `## Rules`
3. Run `/update-references` if any names changed
4. Run `/suggest-next-action` when done

### 8. Ship

> Goal: deliver the work

1. Run `/deep-validate`
2. Run `/ship`
3. If `ship` fails → report the status

## Rules

### 1. Agent Identity

- `name` must reflect a specific role, not something generic like `helper` or `expert`
- Never duplicate an existing agent
- If the directory name changes → update the frontmatter `name` to match

### 2. Safety And Permissions

- Least privilege: `allowed-tools` must be sufficient for the role, not excessive; never `*`/`all`; never `exec` unless the agent runs commands
- Read-only agents must have `deny: [write, edit]`; builders may have `edit`, `write`, and `exec` for check/test
- `permissions` must `deny` risky system paths: `%APPDATA%` (outside scope), `C:\Windows`, `C:\Program Files`, `C:\Program Files (x86)`, `/etc`, `/usr`, `/bin`, `~/.ssh`, `~/.aws`
- No hardcoded secrets in `AGENT.md`: API keys, passwords, tokens, private keys, connection strings, or values that look like base64/long hex
- Release/deploy agents must ask before remote side effects
- If overwriting an existing `AGENT.md` → dry run and get user confirmation first; don't modify other agents unnecessarily

### 3. Format And Tools

- Don't add `glob` if the runtime doesn't support it; use `find_file_by_name` instead
- Use English headings in Title Case; English lists for details
- Every file must not exceed 250 lines

### 4. Checklist (per dimension)

- Frontmatter: `name` matches the dir, `description` clear, tools declared, model/permissions valid
- Prompt quality: single responsibility clear, input/output contract stated, no overlap with other agents, scope boundaries stated
- Safety: least-privilege tools, destructive ops gated, secrets handled, failure/report behavior defined
- Integration: referenced skills/rules exist, `AGENTS.md`/registry consistent, related links valid
- Score each item: pass = 1, warning = 0.5, fail = 0 → grade A (90+), B (80+), C (70+), D (60+), F (<60)

- Use /review-devin-global-harness (layer `subagents`) for review-only
- Use /follow-create-plugins (devin) if needed
- Use /update-devin if needed
- Use /update-docs if needed

## Expected Outcome

- A new or updated `AGENT.md` at `<agents-root>/<agent-name>/AGENT.md`
- Frontmatter complete: required fields present and valid, `permissions` fit the role and `deny` risky paths, no secrets
- Prompt body has `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome` in the fixed order
- File is under 250 lines, `name` matches the directory and is unique, with no markers of incomplete content
- Style conventions followed (backticks for identifiers, no `**` bold, Title Case headings)
- Review score ≥70 (or fixed until it is); references fully updated
