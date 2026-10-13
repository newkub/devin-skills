---
name: deep-build
description: Run deep builds covering many targets, platforms, bundle analysis, and performance smoke tests
argument-hint: "[target]"
related:
  - deep-thinking
  - deep-analyze
  - run-build
  - run-check
  - run-verify
  - run-test
  - deep-review
  - resolve-errors
  - deep-validate
  - report
---

## Goal

Build the project thoroughly, covering every necessary target, and uncover hidden build-time issues

## Scope

- Use for projects that have a build step
- Supports many ecosystems: Node/bun, Rust, Go, Python, Docker
- Not just `bun run build` — must verify outputs and performance impact

- See also: /run-verify

## Execute

### 1. Detect Build Targets

> Goal: know what needs to be built

1. Run `/deep-thinking` to analyze build goals, previously seen issues, and acceptance criteria before starting
2. Read `package.json`, `Cargo.toml`, `Dockerfile`, or the relevant build config
3. Identify targets: dev, prod, ssr, static, docker, mobile, desktop
4. If unclear → run `/ask-me`

### 2. Clean Build

> Goal: start the build from a clean state

1. Run `/run-clean` if available
2. Run `bun install` or the package manager install to keep the lockfile fresh
3. Delete `dist/`, `build/`, `.next/`, `target/` when necessary

### 3. Run Build

> Goal: build every target

1. Run `/run-build` for the default target
2. If there is a production build → run `bun run build:prod` or equivalent
3. If there is SSR / SSG → run that target
4. If there is Docker → run `/run-build` then a `docker build` dry-run
5. If there is Rust → run `cargo build --release`

### 4. Analyze Output

> Goal: find build-time issues

1. Check output size / bundle size
2. Check source maps, assets, chunks
3. Check warnings / errors the build may have skipped
4. Use `/deep-review` if the bundle is large, or `/deep-optimize` if there are performance issues
5. Use `/deep-review` if needed

### 5. Smoke Test

> Goal: confirm the build works

1. Run `/run-test` or `/deep-test e2e` if available
2. If the build is unusable → run `/resolve-errors`
3. Run `/run-check` for lint/typecheck

### 6. Report

> Goal: summarize the build result

1. Run `/report` with targets, outputs, issues, bundle size
2. Run `/deep-validate`
3. Run `/suggest-next-action`

## Rules

- Always start with `/deep-thinking`
- The summary must keep evidence from the real build output in the `/deep-analyze` style (size, warnings, errors); never guess
- Always clean build before running
- Do not ignore build warnings
- Always smoke test after build
- With multiple targets, build all the targets the user specifies
- Use `/resolve-errors` if the build fails

## Expected Outcome

- Build passes for every target
- Bundle / output is analyzed
- No hidden build-time issues
- A build report with a next action
