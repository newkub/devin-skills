---
name: follow-tool-github-actions
description: Set up GitHub Actions for complete CI/CD
argument-hint: "[scope]"
related:
  - follow-tool-lighthouse
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-dot-github
  - follow-deploy
  - run-deploy
  - follow-tool-renovate
  - follow-tool-release-it
  - follow-tasks
  - follow-monorepo
  - follow-tool-moonrepo
  - follow-tool-turborepo
  - follow-release
  - run-verify
---

## Goal

Set up GitHub Actions for complete CI/CD with security, testing, deployment, monitoring

## Scope

Configure GitHub Actions for projects and repositories

- Boundary: GitHub Actions is a hosted platform (not an installable package) — companion tools are the `gh` CLI (`gh workflow`/`gh run`) and `actionlint` for local validation; secrets go through `/follow-secret-manager`; task names/scripts are owned by `/follow-tasks` — this skill only writes the YAML that calls them
- Versions: never trust pinned numbers — live-check `gh`, `actionlint`, and `actions/*` versions via `/deep-research` before writing YAML (principle: `/follow-up-to-date`)
- References: [cli](references/cli.md) | [apis](references/apis.md)
## Execute

### 1. Pick Workflow

> Goal: dispatch specialized work to the appropriate workflow

| Topic | Workflow |
|-------|----------|
| First-time setup on a project — create `.github/workflows/` + starter | `workflows/setup-github-actions.md` |
| Advanced config — permissions, hardening, production setup | `workflows/configure-github-actions.md` |
| Automation patterns — caching, notifications, scheduled jobs | `workflows/use-github-actions.md` |
| Workflow file structure, triggers, jobs, permissions | `workflows/setup-workflows/SKILL.md` |
| Caching, matrix, concurrency groups, artifact reuse | `workflows/optimize-ci/SKILL.md` |

### 2. Select Workflows

> Goal: pick the fitting workflows

Select workflows by the project's needs:

- Base CI/CD: `ci.yml` (lint, typecheck, test) - every project must have
- Security: `codeql.yml`, `dependabot.yml`, `license-check.yml` - production projects needing security
- Testing: `coverage.yml`, `e2e.yml`, `mutation.yml`, `sonarqube.yml` - projects needing quality assurance
- Performance: `lighthouse.yml`, `bundle-size.yml`, `performance-budget.yml` - web applications needing performance
- Deployment: `deploy-staging.yml`, `deploy-production.yml`, `docker.yml`, `cloudflare-workers.yml`, `cloudflare-pages.yml` - projects needing automated deployment
- Monitoring: `slack-notify.yml`, `discord-notify.yml`, `artifacts.yml` - projects needing notifications
- Advanced: `matrix.yml`, `parallel.yml`, `cache.yml` - projects needing optimization
- Documentation: `deploy-docs.yml`, `changelog.yml`, `docusaurus.yml` - projects with documentation
- Git Ops: `commitlint.yml`, `dependency-review.yml`, `auto-merge.yml` - team projects needing governance
- Release: `release.yml` - tag-triggered, written via `/follow-release`; a release task never lives in the package manifest (`/follow-tasks`)

### 3. Basic Setup

> Goal: set up secrets, dependency updates, and the base CI workflow

1. Run `/follow-secret-manager` to set up CI/CD secrets with OIDC or machine identity
2. Run `/follow-tool-renovate` to set up dependency updates
3. Run `/follow-tool-release-it` to set up automated releases (if a monorepo)
4. Run `/follow-release` to write `release.yml` (tag-triggered) when the project releases
5. Create `.github/workflows/ci.yml` for lint, typecheck, test

### 4. Add Workflows As Needed

> Goal: add workflows by need

- Security: add `codeql.yml`, `dependabot.yml` for production
- Testing: add `coverage.yml`, `e2e.yml` for quality assurance
- Performance: add `lighthouse.yml` for web applications — use `/follow-tool-lighthouse` for the audit setup
- Deployment: add workflows per platform in use (Docker, Cloudflare, Vercel)
- Monitoring: add `slack-notify.yml` for team notifications
- Git Ops: add `commitlint.yml`, `dependency-review.yml` for team collaboration

### 5. Write Workflows

> Goal: write workflow YAML per best practices

1. Run `/deep-analyze` to analyze structure and dependencies
2. Read the `.github/workflows/` directory and analyze existing workflows
3. Identify missing or duplicated workflows
4. Write workflow YAML using the latest `actions/*` (live-checked), caching, and safe permissions
5. Separate CI and CD workflows
6. Use matrix strategy for multiple configurations
7. Set up monitoring and notifications for failures
8. Test syntax with `actionlint` (`mise use -g actionlint` then run `actionlint`) and verify permissions
9. Harden: default `permissions: contents: read` at the top level, least-privilege per job, pin third-party actions to a full commit SHA, never expose secrets to fork PRs (be cautious with `pull_request_target`)

### 6. Monorepo CI

> Goal: one global CI that scopes work through the monorepo orchestrator

1. Detect the orchestrator with `/follow-monorepo` (moon, turbo, pnpm/bun workspaces, nx)
2. Write ONE global `ci.yml` — verify is a task the workflow calls, not a workflow file per workspace; keep task names from `/follow-tasks` (e.g. `bun run verify` → `/run-verify`)
3. moonrepo → delegate to `/follow-tool-moonrepo` and call `moon ci` (affected detection, `runInCI`, sharding; requires full git history — never shallow clone, use `filter: 'blob:none'`)
4. turborepo → delegate to `/follow-tool-turborepo` and call `bunx turbo run build lint test` with remote-cache secrets `TURBO_TOKEN`/`TURBO_TEAM` via `/follow-secret-manager`
5. Split workflow files by concern (`ci.yml`, `release.yml`, `deploy.yml`, `security.yml`) — never one workflow file per workspace
6. If a workspace needs bespoke CI steps → use a reusable workflow (`workflow_call`) + matrix, not a new top-level file
7. Use `paths:` filters only on narrow-scope workflows (e.g. docs) — never on the main `ci.yml` (it would break the orchestrator's affected detection)

### Use Cases

| Scenario | Use case |
|----------|----------|
| PR pipeline: cache, matrix, concurrency, artifacts | `usecases/ci-pipeline-with-cache-and-matrix.md` |
| Reusable `workflow_call` + tag-triggered release | `usecases/reusable-workflow-and-release.md` |

## Rules

- Follow the project conventions and global rules (tool github actions)
- Use the allowed tools only when needed

- Use `/open-web-for-config-secret` when secrets must be created via the web
- Use `/follow-dot-github` for other `.github/` repo config
- Use `/follow-deploy` when deployment guidance is needed
- Use `/run-deploy` to trigger deployment

- See best-practices/ for recommended patterns and pitfalls
- See usecases/ for a complete pipeline and a reusable-workflow release flow

## Expected Outcome

- Workflows fitted to the project are selected
- GitHub Actions fully configured per the requirements
- CI/CD runs automatically
