---
name: follow-lang-lua-create-module
description: Create a standard Lua module with documentation and tests
related:
  - follow-lang-lua
  - deep-research
---

## Goal

Create a standard-shaped Lua module with docs and tests that pass on the target dialect

## Scope

For adding a module to an existing Lua project; dialect rules per [../../SKILL.md](../../SKILL.md) (`## Rules → Dialect Discipline`)

## Execute

### 1. Name And Place

1. snake_case file name that states intent (`http_client.lua`, `user_manager.lua`); no reserved words; place it under `src/`

### 2. Write The Module

1. Canonical shape: `local M = {}` … public `function M.public_func(param1)` … `return M`
2. Privates stay `local` (faster than global table lookups, no namespace leaks)
3. Error convention at the boundary: return `nil, err` or `error(msg, 2)` — pick one per module and stay consistent

### 3. Document

1. LDoc format on every public function: `---` description, `-- @param`, `-- @return`; module header with `@module`

### 4. Test

1. `spec/<module>_spec.lua` requiring the module; `describe`/`it` per public function; cover edge cases and the error convention
2. Run `busted spec/<module>_spec.lua`; smoke-test interactively with the REPL (`lua`, then `require`)

### 5. Integrate

1. Register paths in `.luarc.json`/`package.path` only if the module resolves outside defaults
2. Add a usage example to the README/docs

## Rules

- Dialect-specific features (integer division, bitwise ops, `goto`, FFI) → verify availability on the target interpreter via `/deep-research` before use

## Expected Outcome

- Standard module: correct pattern, documented public API, `busted` tests green on the target dialect, usage example available
