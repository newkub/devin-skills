---
name: update-use-wrikka-project
description: Create or refresh use-wrikka-* skills for Wrikka packages; install via registry or pkg
argument-hint: "[repo|package]"
allowed-tools:
  - exec
  - read
related:
  - new-skills
  - update-agents-skills-global
  - update-wrikka-vite-devtools
  - use-wrikka-vite-devtools
  - use-my-packages-on-registry
  - follow-tool-pkg-new
  - list-github-repo
  - check-my-global-cli
  - update-references
  - git-commit-and-push
---

## Goal

Keep exactly one `use-wrikka-<package>` skill per consumable Wrikka package — create the missing ones, refresh the changed ones — and install those packages into a target project from the npm registry when published, otherwise from a pkg.pr.new preview, never via `bun link`

## Scope

- In: repos of the `wrikka` GitHub org and the local checkouts holding their packages (`D:/newkub/wpackages/bun-packages` incl. the nested `packages/lib/solid-ui` repo, `D:/newkub/agents-sdk`, `D:/product-saas/cloud`); skills named `use-wrikka-*` in `%APPDATA%\devin\skills`
- Out: each package's own source and build → `/update-wrikka-vite-devtools` or that repo's `update-*` skill; non-Wrikka packages → `/use-my-packages-on-registry`
- The generated `use-wrikka-*` skill owns its own consumption steps; this skill only discovers, writes, refreshes, and installs

## Execute

### 1. Discover The Org Surface

> Goal: the real package list at run time, never a remembered one

1. `gh repo list wrikka --limit 100 --json name,description,isArchived,visibility,primaryLanguage`; drop archived repos and private apps/services that are not consumed as packages
2. Per repo with a local checkout, list tracked manifests only: `git -C <root> ls-files | grep -E '(^|/)(package\.json|Cargo\.toml|pyproject\.toml)$'` — never a recursive `find`
3. A manifest inside a nested git repo (`git -C <dir> rev-parse --show-toplevel` differs from `<root>`) is a separate surface, enumerated from that repo's root — `solid-ui` alone owns `@wrikka/solid-ui`, `hooks`, `animation`, `chart`, `graph`
4. `argument-hint` names a repo or package → analyze only that surface; no hint → the whole org
5. A repo without a checkout → `/ask-me` before cloning; never clone silently

### 2. Inventory Existing Use Skills

> Goal: create only what is missing, update only what changed

1. List `use-wrikka-*` directories under `%APPDATA%\devin\skills`
2. Build a table `No. | Package | Repo | Skill | State` with states create / update / link-only
3. A package with a dedicated skill plus its own `update-*` flow (e.g. `use-wrikka-vite-devtools`) is link-only — never rewrite it here
4. Two skills covering the same package → merge into one per `/new-skills` `## Rules`

### 3. Resolve The Install Source

> Goal: registry first, preview second, workspace last — recorded per package

1. Registry: `npm view <name> version --json`; crates.io `curl -s https://crates.io/api/v1/crates/<name>`; PyPI `curl -s https://pypi.org/pypi/<name>/json` — a published version wins
2. Unpublished → pkg.pr.new: `curl -sI https://pkg.pr.new/<owner>/<repo>/<name>@<sha>`; HTTP 200 → pin that sha
3. Neither → internal package: `workspace:*`, `file:`, or a source path mapping; record it as consumed-from-workspace
4. pkg.pr.new 404 → report the missing GitHub App `pkg-pr-new` and `.github/workflows/publish.yml`; ask before adding the workflow, never bypass with a link
5. Every package gets a resolved source + version/sha before step 4 runs

### 4. Write Or Update Use Skills

> Goal: each skill is the one place that says how to consume its package

1. New skill per `/new-skills`: `name: use-wrikka-<pkg>` (kebab-case = directory), description ≤100 chars, full `related`, `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
2. Content: install command per source, entrypoints/exports read from the manifest (`exports`, `bin`, `main`), peer deps, one minimal usage snippet, one verify command
3. Existing skill → update only the changed surface (install source, version claim, exports, peers) and keep its anchors stable
4. Package needs a build or preview step → state it; never restate another package's internals
5. `/follow-lib-*` or `/follow-tool-*` already covers the package → extend that skill and point `related` at it instead of a second one

### 5. Install In The Target Project

> Goal: real package resolution with no link

1. Registry → `bun add <name>@<version>` (or `cargo add`, `pip install`) with the resolved version recorded in the manifest
2. Preview → `bun add <name>@https://pkg.pr.new/<owner>/<repo>/<name>@<sha>`
3. Internal → `workspace:*` / `file:`; drop any `vite.config` alias or `tsconfig` path that exists only to reach the package source
4. Never leave `bun link`, `npm link`, or a source alias as the final state; a link-era workaround is removed in the same change
5. Config stays per `/follow-default-config` — no override the package already ships

### 6. Verify

> Goal: the install and the skills both hold

1. `/run-check` in the consumer (typecheck + lint) plus one import smoke test through each changed entrypoint
2. `bun pm ls --all | grep wrikka` (or the ecosystem equivalent) shows the versions resolved in step 3
3. A 404 preview URL or an unresolvable version → stop and report; never invent a fallback
4. `/deep-validate` on every created or edited `use-wrikka-*` skill

### 7. Sync And Report

> Goal: references and counts stay true

1. `/update-references`; sync `dot-agents/skills/AGENTS.md` skill counts and the `update-*` family entry
2. `/report` with `No. | Repo | Package | Source | Version/SHA | Skill | Action | Installed`
3. Commit or push only when the user asks; never clobber a dirty skills repo or consumer repo

## Rules

1. No Link — a package is consumed as a dependency: registry version, pkg.pr.new preview pinned to a sha, or `workspace:`/`file:`; `bun link`, `npm link`, and source aliases are never the final state
2. Source Order — registry → pkg.pr.new → workspace/file; a preview requires the App plus publish workflow, otherwise the gap is reported
3. One Skill Per Package — `use-wrikka-<pkg>`, updated in place; a package owned by a dedicated `update-*` flow is linked, never rewritten
4. Discover, Never Hardcode — repos and packages come from `gh repo list` plus tracked manifests at run time; versions are read from the registry or manifest, never typed from memory
5. Consent — cloning a missing repo, adding a CI workflow, and any commit or push need explicit confirmation; a pkg.pr.new 404 is reported, not worked around
6. Skill Content Standard — English, `name` = directory, description ≤100 chars, no bold markdown, no TODO or placeholder, ≤250 lines; `D:/dot-agents/skills` is the source of truth and `%APPDATA%\devin\skills` the client mirror

## Expected Outcome

- Every consumable Wrikka package has exactly one current `use-wrikka-*` skill, or a recorded reason it has none
- Consuming apps install Wrikka packages from the registry or a sha-pinned pkg.pr.new preview; no link or source alias remains
- The discovered inventory, resolved sources, and installed versions are reported with evidence
- `AGENTS.md` counts and references match the repo; `/deep-validate` passes for every touched skill
