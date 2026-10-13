---
name: update-project
description: Update the root project by checking git log and sync project docs/config/rules/tooling
argument-hint: "[scope]"
related:
  - follow-tasks
  - follow-monorepo
  - update-config
  - update-dot-devin
  - update-docs
  - update-astgrep-rules
  - update-gitignore
  - update-readme-md
  - update-agents-md
  - update-tests
  - update-specs
  - update-examples
  - update-project-skills
  - update-github-metadata
  - update-version-to-latest
  - keepup-source-code
  - use-subagents
  - deep-review

---

## Goal

Update the root project by checking the latest git log of every workspace and syncing all project docs, config, rules, and tooling

## Scope

Use after shipping every workspace — check each workspace's latest git log, restore the information into the root `AGENTS.md` and `README.md`, sync project files, update project skills and GitHub metadata. Do not modify workspace code. If dependencies, runtime, tools, or any versioned config need updating → run `/update-version-to-latest` before updating other config

Boundary: a quick root sync — for a comprehensive pre-release update with a deep analysis baseline → front-load `/deep-analyze` + `/deep-review` before Step 1

## Execute

### 1. Check Latest Git Log

> Goal: Check the latest git log of every workspace

1. Run `/check-monorepo` to confirm monorepo status and `/follow-monorepo` to sync conventions
2. Run `/follow-tasks` to track the update checklist
3. Run `/all-workspace` to identify every workspace
3. For each workspace:
   - Run `git log --oneline -5` to see the latest commits
   - Run `git diff HEAD~1 --stat` to see changed files
   - Record commit hash, message, and changed files
4. Consolidate data from all workspaces into a summary

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
3. Inspect `docs/`, `rules/`, `.devin/`, `.vscode/`
4. Identify orchestration tools (moon, turbo)
5. Run updates in order:
   - `/deep-review` (must run if the project has CI/CD)
   - `/setup-cicd` (if the CI/CD config drifted or isn't ready)
   - `/update-version-to-latest` (if all workspaces' dependencies need updating to latest)
   - `/update-version-to-latest` (if runtime, deps, tools, and all versioned config need updating to latest)
   - `/follow-config` to validate and sync config files per conventions
   - `/update-config` to sync project config, shared config, and the dependencies catalog
   - `/update-dot-devin`
   - `/cleanup-files-in-project` (if needed)
   - package manifest setup (merged `/setup-package`) — check required fields + scripts per `### setup-package` in `## Merged Details`
   - `/update-readme-md`
   - `/update-agents-md`
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
   - `/deep-review` (if there is a `tools/review-codebase/`)
   - `/update-dot-vscode`
   - `/update-contributing`
6. Run `/deep-review` to sync all config
7. Run `/follow-gitignore` to sync `.gitignore`
8. Verify the scripts in `package.json` are consistent

### 4. Update Project Skills

> Goal: Project skills in `.devin/skills/` are current

1. Run `/update-project-skills` to create or update skills in `.devin/skills/`
2. Verify the created skills pass `/deep-validate`
3. Confirm the project `AGENTS.md` references all new skills

### 5. Update GitHub Metadata And Settings

> Goal: GitHub repo metadata and branch protection reflect the real project

1. Run `/update-github-metadata` to sync description, homepage, and topics with `README.md` and `package.json`
2. Run `/follow-github` to set branch protection on `main` and the integration branch per project conventions and `.github` templates (optional)
3. Confirm metadata and branch protection match project conventions

### 6. Validate And Report

> Goal: The root project passes validation

1. Run `/deep-validate` to check the root structure and references
2. Run `git diff --check`
3. Run project checks such as `bun run scan`, `bun run lint`
4. Run `/report` summarizing:
   - workspace commits found
   - information restored
   - project files updated
   - project skills created or updated
   - GitHub metadata updated

## Rules

### 1. Git Log First

- Always check every workspace's `git log` first
- Use `git log --oneline -5` and `git diff HEAD~1 --stat` as the baseline
- Record commit hashes and changed files before updating

### 2. Root Only

- Modify only root docs (`AGENTS.md`, `README.md`) and project config
- Do not modify workspace code or workspace docs
- If workspace docs need changes → use `/ship` in that workspace

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

- Use /update-project if needed

## Merged Details

### setup-package

Package manifest setup (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) — used once at project start or when the manifest isn't publish-ready — merged from `/setup-package`

1. Detect ecosystems from manifest files — several ecosystems → handle one at a time; none → skip
2. Required fields per ecosystem:
   - Node/Bun `package.json`: `name`, `version`, `description`, `license`, `repository`, `homepage`, `files` (state what is published, e.g. `dist`, `README.md`, `LICENSE`), `exports`/`main` pointing at build output; if `private: true` → ask the user whether to release publicly
   - Rust `Cargo.toml`: `package.name`, `version`, `description`, `license`, `repository`, `categories`, `keywords`, `edition`, `rust-version`; `[[bin]]`/`[lib]` per project type; monorepo → `workspace` + `/follow-monorepo`
   - Python `pyproject.toml`: `project.name`, `version`, `description`, `license`, `readme`, `requires-python`, `classifiers`, `build-system` (setuptools/hatchling/flit), `project.scripts` if there is a CLI
   - Go `go.mod`: `module` path, `go` version; no `LICENSE`/`README.md` → recommend adding them
3. Scripts: must have `build`, `test:all`, `verify` (`verify` = `check && test` or `lint && typecheck && test`) — never add a `release` script (release goes through the `/setup-cicd` workflow or `/follow-tool-*`)
4. Missing field → have the user fill it in or use the project's defaults; run `/follow-tasks` to complete the scripts
5. Validate: `/deep-review` the manifest + `/run-verify` — fail → fix and retry ≤3
6. Monorepo: `/follow-monorepo` first; workspace packages don't need `private: false` if publishing happens at the root
7. Never publish yourself — publish via `/publish-package-to-registry` or `/run-release`

## Subagents

> Goal: independent work that can be spawned in parallel — short profiles in this section, full detail in the links
> Delegate via `/use-subagents` — the parent keeps Step 2 (restore changed info needs the combined context) and Step 6 (validate/report) for itself; wait for all structured reports before entering Step 6; subagents must not commit — the parent owns the working rules and final report; `skipped`/`no-changes`/`blocked` reports → show them in the report instead of retrying; workspaces/domains sharing config/deps → run sequentially and pass `shared-rules` to every `project-updater`

### git-log-collector — Collect git log and diff stat for one workspace (Step 1; 1 agent per workspace)

- **Inputs**: `project-path`, `log-count` (optional, default 5)
- **Tools**: `read`, `exec` (`git log`, `git diff`, `git status`)
- **Execute**: run `git log --oneline -<log-count>` recording hash+message for every commit → run `git diff HEAD~1 --stat` recording changed files → no new commits or not a git repo → report `no-changes`
- **Output**: structured summary — `project-path`, latest commits (hash+message), changed-files list with stats, `no-changes` flag
- **Constraints**: read-only, never modify/create files; work only inside `project-path`; deterministic (same input yields the same report)
- **Full detail**: `references/subagent-git-log-collector.md`

### project-files-updater — Update project files by domain (Step 3; 1 agent per `domain`)

- **Inputs**: `domain` (`config`|`docs`|`rules`|`specs`|`examples`|`gitignore`|`vscode`|`todo`|`contributing`), `changed-info` (optional — summary from Steps 1-2 to prioritize), `root-path` (optional, default cwd)
- **Tools**: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- **Execute**: identify the files in the `domain` (`config`→`package.json`/`tsconfig.json`/`biome.jsonc`/`mise.toml`/`.moon/`; `docs`→`docs/`/`README.md`/`USAGE.md`/`FEATURES.md`/`CHANGELOG.md`; `rules`→`rules/`/`sgconfig.yml`; `specs`→`<workspace>/specs/`; `examples`→`examples/`; `gitignore`→`.gitignore`; `vscode`→`.vscode/`; `todo`→`TODO.md`; `contributing`→`CONTRIBUTING.md`) → run `/update-config`/`/update-docs`/`/update-astgrep-rules`/`/update-specs`/`/update-examples`/`/update-gitignore`/`/update-dot-vscode`/`/update-todo-md`/`/update-contributing` → use `changed-info` to skip files that haven't drifted and never rewrite unchanged files
- **Output**: structured summary — the `domain` handled, files updated (path+reason), skills invoked and their results, blockers/cross-domain conflicts
- **Constraints**: work only inside the given `domain`, never touch other domains; no commits; deterministic; no files/not needed → report `skipped`
- **Full detail**: `references/subagent-project-files-updater.md`

### project-updater — Update one sub-project/workspace (Step 3 per-workspace; 1 agent per `project-path`)

- **Inputs**: `project-path`, `update-scope` (optional, e.g. `deps`/`config`/`docs`), `shared-rules` (optional — reference files from the root that must be synced)
- **Tools**: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- **Execute**: run `git log --oneline -5` + `git diff HEAD~1 --stat` in `project-path` → sync config drift against `shared-rules`/root conventions (tsconfig, lint, format, gitignore) → update docs only where they drifted → if sharing config/deps with other sub-projects → report a warning, don't fix them
- **Output**: structured summary — `project-path`, latest commits (hash+message), config/docs changed (file list+reason), blockers/shared-dependency warnings
- **Constraints**: work only inside `project-path`, never modify the root or other sub-projects; no commits; deterministic; workspaces sharing config/deps → sequential + pass `shared-rules`
- **Full detail**: `references/subagent-project-updater.md`

### project-skills-updater — Update project skills in .devin/skills/ (Step 4; parallel with the Step 3 domains)

- **Inputs**: `project-path`, `changed-info` (optional — identifies skills that need syncing)
- **Tools**: `read`, `grep`, `find_file_by_name`, `exec`, `edit`
- **Execute**: run `/update-project-skills` to create/update skills per the codebase → use `changed-info` to map the features/flows that changed → skills needing sync → verify via `/deep-validate` (frontmatter, references, no broken links) → confirm the root `AGENTS.md` references all new skills → report a gap if any are missing
- **Output**: structured summary — skills created/updated/removed (path+reason), validation results, AGENTS.md gaps for the parent to fix
- **Constraints**: modify only `.devin/skills/`, never touch root docs/code (never edit `AGENTS.md` itself — the parent handles it); no commits; `.devin/skills/` missing/not needed → report `skipped`
- **Full detail**: `references/subagent-project-skills-updater.md`

### github-metadata-updater — Sync GitHub repo metadata and branch protection (Step 5; remote-only, never touches local files)

- **Inputs**: `repo` (optional — owner/repo, default detected from the git remote), `check-protection` (optional, default true)
- **Tools**: `exec` (`gh repo view`, `gh api`, `gh repo edit`, `git remote -v`), `read`
- **Execute**: run `/update-github-metadata` to sync description/homepage/topics with `README.md` + `package.json` → if `check-protection` → run `/follow-github` to check branch protection on `main`/integration branches → confirm metadata matches project conventions
- **Output**: structured summary — metadata fields changed (before → after), branch protection status, permission errors or blockers (gh auth, repo not found)
- **Constraints**: remote mutations only (`gh api`/`gh repo edit`), never modify local files; no push, no commit (the parent handles it); no remote or gh auth failure → report `blocked`, don't fail
- **Full detail**: `references/subagent-github-metadata-updater.md`

## Expected Outcome

- Every workspace's git log was checked and recorded
- Changed information was restored into the root docs
- Root `AGENTS.md` and `README.md` were updated
- Project docs, config, rules, and tooling are in sync
- Project skills in `.devin/skills/` were updated via `/update-project-skills`
- GitHub repo metadata was updated via `/update-github-metadata`
- The root project passed `/deep-validate`
- Dependencies and versioned items were updated if `/update-version-to-latest` was chosen
- A complete summary report of workspace commits, project files, project skills, and GitHub metadata

