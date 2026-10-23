---
name: update-project
description: Update root and workspace AGENTS.md by checking git log, syncing project docs/config/rules/tooling
argument-hint: "[scope]"
related:
  - update-config
  - update-dot-agents-project
  - update-docs
  - update-astgrep-rules
  - update-gitignore
  - update-readme-md
  - update-agents-md
  - update-tests
  - update-specs
  - update-version-to-latest
  - use-subagents
  - deep-review
  - update-review-cli
  - run-review

---

## Goal

Update the root project by checking the latest git log of every workspace and syncing all project docs, config, rules, and tooling

## Scope

Use after shipping every workspace — check each workspace's latest git log, restore the information into the root `AGENTS.md` and `README.md`, sync project files, update project skills and GitHub metadata. Do not modify workspace code. If dependencies, runtime, tools, or any versioned config need updating → run `/update-version-to-latest` before updating other config

In a monorepo this covers the root project and every workspace — each workspace's `AGENTS.md` (Step 4) and its drifted config/docs. Submodule workspaces have their own remote and history → report them as `skipped` instead of editing them

Boundary: a quick root sync — for a comprehensive pre-release update with a deep analysis baseline → front-load `/deep-analyze` + `/deep-review` before Step 1
- References: [Target Dispatch](references/target-dispatch.md)

## Execute

### 1. Check Latest Git Log

> Goal: Check the latest git log of every workspace

1. Run `/check-monorepo` to confirm monorepo status and `/follow-monorepo` to sync conventions
2. Run `/follow-tasks` to track the update checklist
3. Run `/all-workspace` to identify every workspace
4. For each workspace:
   - Run `git log --oneline -5` to see the latest commits
   - Run `git diff HEAD~1 --stat` to see changed files
   - Record commit hash, message, and changed files
5. Consolidate data from all workspaces into a summary

### 2. Restore Changed Info

> Goal: Restore the changed information into the root

1. Analyze changed files from every workspace's git log
2. Identify information to restore to the root:
   - Architecture changes → update `### Architecture` in `AGENTS.md`
   - Skills changes → update `### Skills` in `AGENTS.md`
   - Workspaces changes → update `### Workspaces` in `AGENTS.md`
   - Features changes → update the `README.md` features table
3. If a workspace added/removed a dependency → update the root mapping

### 3. Update Project Files

> Goal: Update project docs, config, rules, and tooling to stay consistent

1. Read the root `package.json`
2. Read `AGENTS.md` if present
3. Inspect `docs/`, `rules/`, `.agents/`, `.vscode/`
4. Identify orchestration tools (moon, turbo)
5. Run updates in order:
   - `/deep-review` (must run if the project has CI/CD)
   - `/setup-cicd` (if the CI/CD config drifted or isn't ready)
   - `/update-version-to-latest` (if runtime, deps, tools, or any versioned config need updating to latest)
   - `/update-config` to sync project config, shared config, and the dependencies catalog
   - `/update-dot-agents-project`
   - `/cleanup-project` (if needed)
   - package manifest setup (merged from `/setup-package`) — check required fields + scripts per `references/setup-package.md`
   - `/update-readme-md`
   - `/update-agents-md` for the root `AGENTS.md` (each workspace's `AGENTS.md` → Step 4)
   - `/update-usage-md` to create/update `USAGE.md` at each workspace root
   - `/update-features-md` to create/update `FEATURES.md` at every workspace root
   - `/update-docs` (if there is a `docs/`)
   - `/update-astgrep-rules` (if there are `sgconfig.yml` and `rules/`)
   - `/update-examples` (if there are `examples/` or the public APIs changed)
   - `/update-specs` to create/update `<workspace>/specs/` for test specs
   - `/update-tests` to update the test setup
   - `/update-todo-md` (if there is a `TODO.md`)
   - `/update-references` to sync references
   - `/update-gitignore` to sync `.gitignore`
   - `/update-review-cli` (if the project has or should have a `review/` CLI — `review/package.json` — it owns the analyzer behind every review) then `/run-review` to measure the result
   - `/update-dot-vscode`
   - `/update-contributing`
6. Verify the scripts in `package.json` are consistent

### 4. Update AGENTS.md For Every Workspace

> Goal: Every workspace has a followable `AGENTS.md`

1. Run `/check-monorepo` — not a monorepo → skip to Step 5
2. Monorepo with several workspaces → spawn one `agents-md-updater` subagent per workspace via `/use-subagents` (see `## Subagents`), passing `workspace-path` + `shared-rules`
3. Merge the subagent reports, then write the root `AGENTS.md` last so it lists every workspace and references each workspace `AGENTS.md`
4. Submodule workspace (own remote/history) or a workspace without a manifest → report `skipped`, never edit it

### 5. Update Project Skills

> Goal: Project skills in `.agents/skills/` are current

1. Run `/update-dot-agents-project skills` to create or update skills in `.agents/skills/`
2. Verify the created skills pass `/deep-validate`
3. Confirm the project `AGENTS.md` references all new skills

### 6. Update GitHub Metadata And Settings

> Goal: GitHub repo metadata and branch protection reflect the real project

1. Run `/update-github-metadata` to sync description, homepage, and topics with `README.md` and `package.json`
2. Run `/update-github-metadata` `### 6. Protect Branches (Optional)` to set branch protection on `main` and the integration branch per project conventions (optional); `.github` templates come from `/follow-dot-github` (optional)
3. Confirm metadata and branch protection match project conventions

### 7. Validate And Report

> Goal: The root project passes validation

1. Run `/deep-validate` to check the root structure and references
2. Run `git diff --check`
3. Run project checks such as `bun run scan`, `bun run lint`
4. Run `/report` summarizing:
   - workspace commits found
   - information restored
   - project files updated
   - workspace `AGENTS.md` created or updated
   - project skills created or updated
   - GitHub metadata updated

## Rules

### 1. Git Log First

- Always check every workspace's `git log` first
- Use `git log --oneline -5` and `git diff HEAD~1 --stat` as the baseline
- Record commit hashes and changed files before updating

### 2. Root Docs And Workspace AGENTS.md

- Write only the root docs (`AGENTS.md`, `README.md`), project config, and — in a monorepo — each workspace's `AGENTS.md` plus its drifted config/docs
- Never modify workspace source code
- A submodule workspace (own remote/history) belongs to its own repo → report it instead of editing it
- Workspace docs other than `AGENTS.md` → use `/ship` in that workspace

### 3. No Commit

- `update-project` does not commit changes
- If used standalone → run `/git-commit` after `/update-project`
- If used in a monorepo → run `/ship` per workspace, then `/git-commit` at the root after `/update-project`

### 4. Idempotency

- `update-project` can be re-run without side effects
- Never delete or overwrite without a dry run

### 5. Conditionality

- Run conditional steps as specified
- Skip steps that aren't needed

### 6. Validation

- Run validation after updates
- Never claim a check passed if the command failed

## Merged Details

- setup-package → `references/setup-package.md` — manifest completeness (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) for the root and workspaces

## Subagents

> Goal: independent work that can be spawned in parallel — short profiles in this section, full detail in the links
> Delegate via `/use-subagents` — the parent keeps Step 2 (restore changed info needs the combined context), the Step 4 merge and root `AGENTS.md`, and Step 7 (validate/report) for itself; wait for all structured reports before entering Step 7; subagents must not commit — the parent owns the working rules and final report; `skipped`/`no-changes`/`blocked` reports → show them in the report instead of retrying; workspaces/domains sharing config/deps → run sequentially and pass `shared-rules` to every `project-updater` and `agents-md-updater`

### git-log-collector — Collect git log and diff stat for one workspace (Step 1; 1 agent per workspace)

- `Inputs`: `project-path`, `log-count` (optional, default 5)
- `Tools`: `read`, `exec` (`git log`, `git diff`, `git status`)
- `Execute`: run `git log --oneline -<log-count>` recording hash+message for every commit → run `git diff HEAD~1 --stat` recording changed files → no new commits or not a git repo → report `no-changes`
- `Output`: structured summary — `project-path`, latest commits (hash+message), changed-files list with stats, `no-changes` flag
- `Constraints`: read-only, never modify/create files; work only inside `project-path`; deterministic (same input yields the same report)
- `Full detail`: `references/subagent-git-log-collector.md`

### project-files-updater — Update project files by domain (Step 3; 1 agent per `domain`)

- `Inputs`: `domain` (`config`|`docs`|`rules`|`specs`|`examples`|`gitignore`|`vscode`|`todo`|`contributing`), `changed-info` (optional — summary from Steps 1-2 to prioritize), `root-path` (optional, default cwd)
- `Tools`: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- `Execute`: identify the files in the `domain` (`config`→`package.json`/`tsconfig.json`/`biome.jsonc`/`mise.toml`/`.moon/`; `docs`→`docs/`/`README.md`/`USAGE.md`/`FEATURES.md`/`CHANGELOG.md`; `rules`→`rules/`/`sgconfig.yml`; `specs`→`<workspace>/specs/`; `examples`→`examples/`; `gitignore`→`.gitignore`; `vscode`→`.vscode/`; `todo`→`TODO.md`; `contributing`→`CONTRIBUTING.md`) → run `/update-config`/`/update-docs`/`/update-astgrep-rules`/`/update-specs`/`/update-examples`/`/update-gitignore`/`/update-dot-vscode`/`/update-todo-md`/`/update-contributing` → use `changed-info` to skip files that haven't drifted and never rewrite unchanged files
- `Output`: structured summary — the `domain` handled, files updated (path+reason), skills invoked and their results, blockers/cross-domain conflicts
- `Constraints`: work only inside the given `domain`, never touch other domains; no commits; deterministic; no files/not needed → report `skipped`
- `Full detail`: `references/subagent-project-files-updater.md`

### project-updater — Update one sub-project/workspace (Step 3 per-workspace; 1 agent per `project-path`)

- `Inputs`: `project-path`, `update-scope` (optional, e.g. `deps`/`config`/`docs`), `shared-rules` (optional — reference files from the root that must be synced)
- `Tools`: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- `Execute`: run `git log --oneline -5` + `git diff HEAD~1 --stat` in `project-path` → sync config drift against `shared-rules`/root conventions (tsconfig, lint, format, gitignore) → update docs only where they drifted → if sharing config/deps with other sub-projects → report a warning, don't fix them
- `Output`: structured summary — `project-path`, latest commits (hash+message), config/docs changed (file list+reason), blockers/shared-dependency warnings
- `Constraints`: work only inside `project-path`, never modify the root or other sub-projects; no commits; deterministic; workspaces sharing config/deps → sequential + pass `shared-rules`
- `Full detail`: `references/subagent-project-updater.md`

### agents-md-updater — Write or refresh the `AGENTS.md` of one workspace (Step 4; 1 agent per workspace)

- `Inputs`: `workspace-path`, `shared-rules` (optional — root conventions the workspace must reference instead of duplicating), `changed-info` (optional)
- `Tools`: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- `Execute`: detect the workspace manifest (none → `skipped`) → run `git log --oneline -5` + `git diff HEAD~1 --stat` to find stale sections → run `/update-agents-md` scoped to `workspace-path` (`### Follow Techstack Skills` table from the real manifest, `### Follow Architecture`, `### Ship`, accurate `uses:`) → validate with `/deep-validate`
- `Output`: structured summary — `workspace-path`, sections written/updated with the reason, dependencies mapped, validation result, gaps the parent must fix (root workspace table row)
- `Constraints`: write only `<workspace-path>/AGENTS.md`, never the root/other workspaces/source code; no commits; deterministic; submodule workspace (own remote) or no manifest → report `skipped`
- `Full detail`: `references/subagent-agents-md-updater.md`

### project-skills-updater — Update project skills in .agents/skills/ (Step 5; parallel with the Step 3 domains)

- `Inputs`: `project-path`, `changed-info` (optional — identifies skills that need syncing)
- `Tools`: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- `Execute`: run `/update-dot-agents-project skills` to create/update skills per the codebase → use `changed-info` to map the features/flows that changed → skills needing sync → verify via `/deep-validate` (frontmatter, references, no broken links) → confirm the root `AGENTS.md` references all new skills → report a gap if any are missing
- `Output`: structured summary — skills created/updated/removed (path+reason), validation results, AGENTS.md gaps for the parent to fix
- `Constraints`: modify only `.agents/skills/`, never touch root docs/code (never edit `AGENTS.md` itself — the parent handles it); no commits; `.agents/skills/` missing/not needed → report `skipped`
- `Full detail`: `references/subagent-project-skills-updater.md`

### github-metadata-updater — Sync GitHub repo metadata and branch protection (Step 6; remote-only, never touches local files)

- `Inputs`: `repo` (optional — owner/repo, default detected from the git remote), `check-protection` (optional, default true)
- `Tools`: `exec` (`gh repo view`, `gh api`, `gh repo edit`, `git remote -v`), `read`
- `Execute`: run `/update-github-metadata` to sync description/homepage/topics with `README.md` + `package.json` → if `check-protection` → run `/update-github-metadata` `### 6. Protect Branches (Optional)` to check branch protection on `main`/integration branches → confirm metadata matches project conventions
- `Output`: structured summary — metadata fields changed (before → after), branch protection status, permission errors or blockers (gh auth, repo not found)
- `Constraints`: remote mutations only (`gh api`/`gh repo edit`), never modify local files; no push, no commit (the parent handles it); no remote or gh auth failure → report `blocked`, don't fail
- `Full detail`: `references/subagent-github-metadata-updater.md`

## Expected Outcome

- Every workspace's git log was checked and recorded
- Changed information was restored into the root docs
- Root `AGENTS.md` and `README.md` were updated
- Every workspace has a followable `AGENTS.md`, written 1 subagent per workspace via `/use-subagents`
- Project docs, config, rules, and tooling are in sync
- Project skills in `.agents/skills/` were updated via `/update-dot-agents-project skills`
- GitHub repo metadata was updated via `/update-github-metadata`
- The root project passed `/deep-validate`
- Dependencies and versioned items were updated if `/update-version-to-latest` was chosen
- A complete summary report of workspace commits, project files, workspace `AGENTS.md`, project skills, and GitHub metadata

