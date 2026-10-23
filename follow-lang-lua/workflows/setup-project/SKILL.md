---
name: follow-lang-lua-setup-project
description: Scaffold a standard Lua project with tooling, config, and tests
argument-hint: "[project-name]"
related:
  - follow-lang-lua
  - follow-default-config
  - resolve-errors
  - deep-research
  - setup-cicd
---

## Goal

Create a standard Lua project structure with tooling, configuration, and a passing test setup

## Scope

For a new standalone Lua project (not an embedded host plugin); first confirm the dialect/interpreter the project targets (PUC Lua 5.4, LuaJIT, Luau) per [../../SKILL.md](../../SKILL.md) step 1 — live-check current versions via `/deep-research`

## Execute

### 1. Install The Toolchain

> Goal: Install The Toolchain.

1. `mise use -g lua` (or the host's bundled runtime) and LuaRocks; verify `lua -v` / `luajit -v` / `luarocks --version` (see `references/toolchain.md`)
2. Install project tools: `luarocks install luacheck`, `luarocks install busted`; a formatter (e.g. StyLua) per project choice

### 2. Scaffold

> Goal: Scaffold.

1. Create the layout: `src/` source, `spec/` tests, `docs/`, `assets/` as needed
2. Entry `src/main.lua` requires the `config` and `utils` modules and calls `main()`
3. Module pattern in every file: `local M = {}` → public `function M.func()`, private `local function` → `return M`

### 3. Configure

> Goal: Configure.

1. `.luacheckrc`: set `std` to match the chosen dialect (live-checked, not copied from a template); gate unused/undefined globals
2. `.luarc.json` (LuaLS): `runtime.version` matching the dialect, `workspace.library = ["./src"]`; add host globals to `diagnostics.globals` when embedding
3. Keep configs to overrides only per `/follow-default-config`; `.gitignore` for `*.luac`, `tmp/`, logs

### 4. Add A First Test

> Goal: Add A First Test.

1. `spec/main_spec.lua` with `describe`/`it` (busted); name test files `*_spec.lua`
2. Run `busted` — it must pass before any feature work starts

### 5. Verify

> Goal: Verify.

1. `lua src/main.lua` runs; `busted` passes; `luacheck src spec` is clean
2. On failure → run `/resolve-errors`

## Rules

- Module search paths: rely on defaults; set `LUA_PATH`/`package.path` only when modules live outside them
- CI setup → run `/setup-cicd` (luacheck + busted on the pinned dialect)

## Expected Outcome

- Standard Lua project: `src/` + `spec/`, `.luacheckrc` + `.luarc.json` matched to the dialect, first test green
