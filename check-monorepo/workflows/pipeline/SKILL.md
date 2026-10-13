---
name: check-monorepo-pipeline
description: Check monorepo task pipeline consistency: every project has required tasks, no orphans
argument-hint: "[workspace-or-package]"
related:
  - follow-tool-moonrepo
  - follow-tool-turborepo
  - list-workspaces
  - report
---

## Goal

Check the monorepo task pipeline — every project has the required tasks (`build`, `test`, `lint`, `typecheck`), the task graph has no orphans or cycles, and cache config is consistent.

## Scope

- Use when `/check-monorepo` dispatches to `pipeline`/`tasks`, or call it standalone
- Supports Moonrepo (`.moon/tasks.yml`, `moon.yml`), Turborepo (`turbo.json`), Nx (`nx.json`), and pnpm scripts
- Read-only: report only — do not change task config

## Execute

### 1. Inventory Tasks Per Project

> Goal: Know which tasks each project has

1. Use `/list-workspaces` to find all projects
2. Collect tasks per project: `moon.yml`/`package.json` scripts/`project.json`
3. Build a project × task coverage table

### 2. Check Coverage And Orphans

> Goal: Find projects the task graph does not cover

1. Flag projects missing required tasks (`build`, `test`, `lint`, `typecheck`) without reason
2. Flag orphan projects — with no tasks at all, or not referenced in workspace config
3. Flag task deps pointing at nonexistent tasks/projects (dangling `dependsOn`)

### 3. Check Pipeline Config

> Goal: Cache and ordering are consistent

1. Check the `turbo.json` pipeline/`tasks` — outputs, cache, and dependsOn (`^build`) are correct
2. Check that `.moon/tasks.yml` shared tasks do not conflict with project-level overrides
3. Flag non-cacheable tasks that are being cached (side effects such as deploy or publish)

### 4. Report

> Goal: Summarize pipeline health

1. Use `/report` with columns: `No.`, `Project`, `Issue`, `Severity`, `Fix`
2. Recommend: add missing tasks, fix dangling deps, correct cache flags

## Rules

- Every finding needs evidence (project path, task name, config file)
- Distinguish "intentionally task-free" (e.g. a docs package with no test) from genuinely missing tasks
- Dangling `dependsOn` = High; missing task = Medium; cache misconfig = Medium

## Expected Outcome

- Task coverage matrix for every project with gaps
- List of orphan projects and dangling task deps
