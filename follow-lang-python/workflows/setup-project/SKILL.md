---
name: follow-lang-python-setup-project
description: Scaffold a new Python project with venv, pyproject, ruff, and pyright
argument-hint: "[project-name]"
related:
  - follow-lang-python
  - follow-default-config
  - resolve-errors
  - deep-research
  - setup-cicd
---

## Goal

Create a new Python project with a pinned runtime, `pyproject.toml` as the single source of truth, and lint/type/test tooling green

## Scope

For a fresh Python project; live-check the current stable Python and tool behavior via `/deep-research` first — read `/follow-lang-python` for the language rules

## Execute

### 1. Pin The Runtime

1. `mise use -g python` (or the official installer); verify `py -3 --version` / `python3 --version`
2. Create the venv: `python -m venv .venv`; activate (Windows `.venv\Scripts\activate`, Unix `source .venv/bin/activate`)

### 2. Scaffold

1. Layout per Clean Architecture: `domain/`, `application/`, `adapters/`, `presentation/` packages (every package has `__init__.py`), `tests/` at root
2. `pyproject.toml`: `[project]` with `name`, `requires-python` (the live-checked line, never a stale pin), `[project.dependencies]`, `[project.optional-dependencies] dev`

### 3. Install Dev Tools

1. `python -m pip install -e ".[dev]"` after adding `ruff` (lint/format) and `pyright` (type check) to dev deps — always `python -m pip`, never bare `pip`
2. `[tool.ruff]` with `target-version` matching the runtime and `[tool.ruff.lint] select = ["E", "F", "I", "N", "UP"]`; `[tool.pyright]` with `typeCheckingMode = "strict"` and `include` scoped to source — overrides only per `/follow-default-config`

### 4. First Test

1. Add a failing-then-passing smoke test under `tests/` (run with the project's chosen runner — check the current recommendation via `/deep-research`)
2. Export pinned deps with `python -m pip freeze > requirements.txt` only if the project locks that way; prefer `pyproject.toml` ranges pinned to stable releases

### 5. Verify

1. `ruff check .` + `ruff format --check .` clean; `pyright` green; tests pass; entry module imports without side effects
2. On failure → run `/resolve-errors`

## Rules

- `.gitignore` covers `.venv/`, `__pycache__/`, `*.pyc`, `dist/`, `coverage`; CI → `/setup-cicd`

## Expected Outcome

- New Python project: pinned runtime, strict ruff + pyright config in `pyproject.toml`, Clean Architecture layout, green checks
