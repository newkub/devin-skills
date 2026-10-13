---
name: update-devin-global-subagents
description: Create, update, and orchestrate global subagents via AGENT.md and job roles
argument-hint: "[agent-name]"
related:
  - update-devin
  - list-devin
  - review-devin-global-harness
  - follow-agents-md
  - update-docs
  - use-subagents
  - deep-review
  - deep-review-then-fix
  - deep-validate
  - ship
  - report
  - ask-me

---

## Goal

Create or update `AGENT.md` for Devin subagents so they are correct, complete, practically usable, and aligned with standard skills — frontmatter, sections, line count, style, safety (merged review dims from: review-devin-global-subagents)

## Scope

Use when creating a new agent or editing an agent in `~/.config/devin/agents/`, `.devin/agents/`, `.agents/agents/`, or `%APPDATA%\devin\agents\`, including orchestrating subagents for complex work

Review-only → `/review-devin-global-harness` (layer `subagents`)

See also: /follow-agents-md, /update-agents-md

## Execute

### 1. Identify Target Subagent

> Goal: identify the subagent to create or update

1. Take the agent name and role from the user
2. Run `/list-devin-global-subagents` to confirm whether the agent exists
3. Determine the target directory: `<agents-root>/<agent-name>/`
4. If the name is duplicated or unclear → run `/ask-me`

### 2. Select Archetype

> Goal: choose the right permission structure for the role

1. Read-only auditor: `reviewer`, `verifyer`, `security-auditor` — deny `write`, `edit`
2. Builder/Implementer: `fixer`, `improver`, `refactorer`, `code-simplifier` — allow `edit`, `write`, `exec` for test/lint/build
3. Planner/Designer: `architect`, `api-designer`, `uxui-designer` — may be allowed to write spec/design docs but not modify main source
4. Executor/Operator: `test-runner`, `release`, `deployment-specialist` — allow running the relevant commands

### 3. Write Frontmatter

> Goal: frontmatter conforms to the Devin spec

1. `name`: lowercase, separated by `-`, matching the directory name
2. `description`: concise, ≤100 characters
3. `model`: `sonnet` by default
4. `allowed-tools`: only the tools actually needed, e.g. `read`, `grep`, `find_file_by_name`, `code_search`, `exec`, `edit`, `write`
5. `permissions`:
   - `allow`: safe commands such as `Exec(bun run test)`, `Exec(bun run lint)`, `Exec(bun run typecheck)`, `Exec(bun run build)`
   - `deny`: `write`, `edit` for read-only; or `exec` if terminal execution is not wanted

### 4. Write Prompt Body

> Goal: prompt consistent with the role and spec

1. `## Goal`: one clear sentence
2. `## Scope`: work boundaries and focus areas
3. `## Execute`: broken into at most 10 steps using `### N. Step Name`, `> Goal:`, and numbered lists
4. `## Rules`: 3-5 role-specific rules
5. `## Expected Outcome`: what must be delivered
6. Use backticks for `tools`, `commands`, `paths`, `agent-name`
7. Never use `**` bold markers

### 5. Validate

> Goal: AGENT.md is ready to use

1. Check that the frontmatter `---` delimiters are complete on both sides
2. Check required fields: `name`, `description`, `model`, `allowed-tools`
3. Check required sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
4. Count lines; it must not exceed 250 lines
5. Look for markers indicating incomplete content
6. Check that `name` matches the directory name and doesn't duplicate another agent
7. If there are issues → fix and revalidate until it passes

### 6. Orchestrate Subagents In Complex Tasks

> Goal: use multiple subagents by role working in parallel

1. If the work spans independent areas → read [references/orchestrate-subagents.md](references/orchestrate-subagents.md)
2. Run `/list-devin-global-subagents` to pick roles
3. Use `/use-subagents` to spawn subagents in parallel
4. Merge results, resolve conflicts with `/resolve-errors`, then `/deep-review-then-fix`
5. If any subtask has a complex workflow → run `/deep-review`
6. Run `/report` summarizing what each subagent did

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

### 2. Permissions

- Read-only agents must have `deny: [write, edit]`
- Builder agents may have `edit`, `write`, and `exec` for check/test
- Release/deploy agents must ask before remote side effects

### 3. Tool Selection

- `allowed-tools` must be sufficient for the role, not excessive
- Don't add `glob` if the runtime doesn't support it; use `find_file_by_name` instead

### 4. Format

- Use English headings in Title Case or per the project convention
- Use Thai-language lists for details
- Files must not exceed 250 lines

### 5. Safety

- If overwriting an existing `AGENT.md` → do a dry run and get user confirmation first
- Don't modify other agents unnecessarily
- If the directory name changes → update the frontmatter `name` to match

- Use /review-devin-global-harness (layer `subagents`) for review-only
- Use /follow-create-plugins (devin) if needed
- Use /update-devin if needed
- Use /update-docs if needed


## Expected Outcome

- A new or updated `AGENT.md` at `<agents-root>/<agent-name>/AGENT.md`
- Frontmatter complete and correct
- Prompt body has `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
- File is under 250 lines with no markers of incomplete content
- Agent name matches the directory name and is unique
- `permissions` fit the role
- References fully updated


