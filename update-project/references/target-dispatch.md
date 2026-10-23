# Target Dispatch

Use when updating a target other than the root project — map the target type to the appropriate `update-*` skill

## Target Type Dispatch

| No. | Target Type | Skill |
|-----|-------------|-------|
| 1 | `root-project` | `/update-project` (this skill) |
| 2 | `skill` in global skills | `/update-agents-skills-global <skill-name>` |
| 3 | `all` global skills | `/update-agents-skills-global` |
| 4 | `config` | `/update-config` |
| 5 | `versions` (runtime, deps, tools, CI, Docker) | `/update-version-to-latest` |
| 6 | `project-docs` | `/update-readme-md`, `/update-agents-md`, `/update-usage-md`, `/update-features-md` |
| 7 | `rules` | `/update-astgrep-rules` |
| 8 | `skills` in the project | `/update-dot-agents-project skills` |
| 9 | `examples` | `/update-examples` |
| 10 | `tests` | `/update-tests` |
| 11 | `todo` | `/update-todo-md` |
| 12 | `gitignore` | `/update-gitignore` |
| 13 | `vscode` | `/update-dot-vscode` |
| 14 | `github-metadata` | `/update-github-metadata` |
| 15 | `codebase` | `/implement-to-production` along the critical path |

After updating every target, run `/update-references` to sync all references

In a monorepo, `/update-project` covers the root and every workspace — for the workspace `AGENTS.md` files it spawns 1 `agents-md-updater` subagent per workspace (see `## Subagents` in `/update-project`); submodule workspaces are reported as `skipped`, not edited

## Rules

- Always determine the target type first — if unclear → run `/ask-me`
- Use `update-*` skills per target type; do not do work that `update-*` skills already do themselves
- If the target matches no skill → use `/implement-to-production` for code changes
- Safe to re-run without side effects — skip steps that are not needed
- Must pass `/deep-validate` and `/run-verify` before being considered done
