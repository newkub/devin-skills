---
name: follow-lang-zig-setup-project
description: Scaffold a new Zig project with zig init, build graph, and quality gates
argument-hint: "[project-name]"
related:
  - follow-lang-zig
  - follow-architecture
  - follow-default-config
  - deep-research
  - resolve-errors
---

## Goal

Create a new Zig project (executable or library) with a version-correct `build.zig`/`build.zig.zon` and build/test/fmt gates green

## Scope

For a fresh Zig project; Zig is pre-1.0 — live-check the installed `zig version` and the current `build.zig.zon`/module API via `/deep-research` before writing build scripts (the build-system API changes between minors) — read `/follow-lang-zig` for the language rules

## Execute

### 1. Pin The Toolchain

1. `mise use -g zig` at the version the live check recommends; verify `zig version`; read the official Zig Guide section matching that version before coding `build.zig`

### 2. Scaffold

1. `zig init` (executable) or the library layout per the live-checked guide: `build.zig`, `build.zig.zon`, `src/` (+ `test/` when integration tests warrant it)
2. Build graph: `b.addExecutable` with `root_module`/`root_source_file`, `b.installArtifact`, plus `run` and `test` steps wired to `-Doptimize`
3. Declare dependencies in `build.zig.zon` (`.dependencies` with URL + `hash`); add with `zig fetch` — never hand-edit the hash

### 3. Quality Gates

1. `zig fmt` is the formatter — no separate style config; config files hold overrides only per `/follow-default-config`
2. Add at least one `test "..."` block in `src/` passing from the first commit
3. Layout for multi-module projects → `/follow-architecture` (Zig has no framework default)

### 4. Verify

1. `zig build` → `zig build test` → `zig fmt --check` all green
2. On failure → run `/resolve-errors`

## Rules

- Cross-compile and optimize selects via `-Dtarget`/`-Doptimize` in `build.zig` — no wrapper scripts unless the project needs them
- Never pin a Zig version or removed-syntax workaround in this workflow — everything resolves from the `/deep-research` check at use time

## Expected Outcome

- New Zig project: pinned toolchain, version-correct build graph, one green test, `zig build`/`test`/`fmt --check` passing from the first commit
