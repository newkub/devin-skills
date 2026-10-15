---
name: follow-lang-python
description: Python project guidelines with best practices, ruff, pyright, and Clean Architecture
argument-hint: "[scope]"
related:
  - follow-lang-javascript
  - follow-lang-kotlin
  - follow-best-practice
  - refactor
  - follow-tool-madge
  - setup-cicd
  - use-scripts
  - deep-research

---

## Goal

Develop Python projects with best practices and Clean Architecture

## Scope

For projects developed with a modern Python 3 runtime; single `SKILL.md` package — no `references/`, verify current Python/tool versions via `/deep-research` at use time (official docs: https://docs.python.org/3/)

## Execute

### 1. Check Version And Install

> Goal: install Python and dependencies with live-checked versions

1. Run `/deep-research` to confirm the latest stable Python and the project's `requires-python` before installing
2. Install with `mise use -g python` (or the official installer from https://www.python.org/downloads/); verify with `py -3 --version` (Windows) / `python3 --version`
3. Create a virtual env: `python -m venv .venv`, activate (Windows `.venv\Scripts\activate`, Unix `source .venv/bin/activate`)
4. Install packages with `python -m pip install <pkg>`; export with `python -m pip freeze > requirements.txt` — always `python -m pip`, never bare `pip`
5. Install `ruff` (lint/format) and `pyright` (type check) as dev dependencies

### 2. Configuration

> Goal: keep `pyproject.toml` as the single source of truth

1. Dependencies in `[project.dependencies]`, dev tools in `[project.optional-dependencies] dev`
2. `[tool.ruff]` with `target-version` matching the runtime; `[tool.ruff.lint] select = ["E", "F", "I", "N", "UP"]`
3. `[tool.pyright]` with `typeCheckingMode = "strict"` and `include` scoped to source
4. Avoid floating/unbounded version ranges; pin to stable releases

### 3. Project Structure

> Goal: organize code per Clean Architecture

1. Split into `domain/`, `application/`, `adapters/`, `presentation/`
2. `domain/` holds pure business logic without side effects; `application/` orchestrates use cases
3. `adapters/` owns I/O (DB, HTTP, filesystem); `presentation/` owns entry points (CLI/API/UI)
4. Every package has `__init__.py`; tests live in `tests/`; run `/refactor architecture` for the pattern choice

### 4. Core Principles

> Goal: write Python per best practices

1. Type-hint every function; use `from __future__ import annotations` for forward references
2. Use `@dataclass(frozen=True)` or `pydantic` models for immutable data
3. Use `ruff check .` + `ruff format .` and `pyright` in CI before merge
4. Prefer `pathlib`, context managers, and async (`async def`) for I/O-bound work

### 5. Import Rules

> Goal: keep imports deterministic and sorted

1. Order: stdlib → third-party → local, separated by blank lines (enforced by `ruff` `I` rules)
2. No unused imports (`F401`); no circular imports — check with `/follow-tool-madge` if suspected

## Rules

### 1. Toolchain

- Use the project's `requires-python` (never a stale hardcoded version); `ruff` for lint/format, `pyright` strict for types
- Use `pyproject.toml` as the single source of truth; no secrets in config

### 2. Code Standard

- Type hints on every public function; `dataclass`/`pydantic` for data models
- Clean Architecture layering; side effects only in `adapters/`

### 3. Live Checks

- Verify current Python/ruff/pyright behavior and new stdlib features via `/deep-research` at use time, not from memory

- Use /follow-lang-javascript if needed
- Use /follow-lang-kotlin if needed
- Use /follow-best-practice if needed
- Use /setup-cicd if needed
- Use /use-scripts if needed

## Expected Outcome

- Python project following Clean Architecture
- `pyproject.toml` with ruff and pyright config
- Every function typed; code passes `ruff check` and `pyright` strict
