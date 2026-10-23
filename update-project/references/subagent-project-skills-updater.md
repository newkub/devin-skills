# project-skills-updater — Update project skills in .agents/skills/ to stay current

## Role

Subagent responsible for project skills in `.agents/skills/` — sync content with the current codebase, check references, and validate — used when `/update-project` Step 4 fans it out to run in parallel with other domains

## Inputs

- `project-path`: path of the project root
- `changed-info` (optional): summary of changed files from Step 1-2 to identify skills that need syncing

## Tools

- `read`, `grep`, `find_file_by_name` — find relevant skills and codebase files
- `exec` — run validation commands
- `edit` — edit skills in `.agents/skills/` only

## Execute

1. Run `/update-dot-agents-project skills` to create or update skills in `.agents/skills/` according to the current codebase
2. Use `changed-info` to determine which features/flows changed → which skills need syncing
3. Verify that the created skills pass `/deep-validate` — frontmatter, references, no broken links
4. Confirm that the project `AGENTS.md` fully references the new skills — report gaps if missing (never edit AGENTS.md directly — that is the parent's responsibility)

## Report

Return a structured summary:

- Skills created/updated/deleted (path + reason)
- Validation results
- AGENTS.md gaps the parent must fix

## Rules

- Edit only `.agents/skills/` — never touch root docs or code
- Do not commit — the parent commits
- If `.agents/skills/` is missing or unnecessary → report `skipped` with a reason
