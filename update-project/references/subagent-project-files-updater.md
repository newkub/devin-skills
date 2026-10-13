# project-files-updater — Update project files for the assigned domain

## Role

Subagent responsible for one update domain of the root project — config sync, docs update, ast-grep rules, specs, examples, gitignore, or vscode — used when Step 3 of `/update-project` has several independent domains

## Inputs

- `domain`: the domain handled — `config`, `docs`, `rules`, `specs`, `examples`, `gitignore`, `vscode`, `todo`, `contributing`
- `changed-info` (optional): summary of changed files from Steps 1-2 to prioritize
- `root-path` (optional): path of the root project (default cwd)

## Tools

- `read`, `grep`, `find_file_by_name` — find files in the domain
- `exec` — run update commands per domain
- `edit` — edit files within the domain only

## Execute

1. Identify the files related to the `domain`:
   - `config` → `package.json`, `tsconfig.json`, `biome.jsonc`, `mise.toml`, `.moon/`
   - `docs` → `docs/`, `README.md`, `USAGE.md`, `FEATURES.md`, `CHANGELOG.md`
   - `rules` → `rules/`, `sgconfig.yml`
   - `specs` → `<workspace>/specs/`
   - `examples` → `examples/` or public API examples
   - `gitignore` → `.gitignore` at root + workspaces
   - `vscode` → `.vscode/`
   - `todo` → `TODO.md`
   - `contributing` → `CONTRIBUTING.md`
2. Run the update-* skill matching the domain (`/update-config`, `/update-docs`, `/update-astgrep-rules`, `/update-specs`, `/update-examples`, `/update-gitignore`, `/update-dot-vscode`, `/update-todo-md`, `/update-contributing`)
3. Use `changed-info` to skip files that haven't drifted — don't rewrite a file that hasn't changed
4. Never touch files outside the `domain` — other domains belong to the parallel subagents

## Report

Return a structured summary:

- the `domain` handled
- files updated (path + reason)
- skills invoked and their results
- blockers or cross-domain conflicts

## Rules

- Work only inside the given `domain` — never modify other domains
- No commit — the parent commits per the `/update-project` rules
- Deterministic: the same input must produce the same update set
- If the domain has no files or isn't needed → report `skipped` with a reason
