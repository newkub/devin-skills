# Python Toolchain

| key | value |
|-----|-------|
| language | Python 3 (pin `requires-python` to a live-checked supported line) |
| runtime install | `mise use -g python` (fallback: https://www.python.org/downloads/) |
| package manager | `python -m pip` (always `-m pip`, never bare `pip`) |
| official docs | https://docs.python.org/3/ |
| version policy | never pinned here — live-check Python/ruff/pyright state via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `python` / `py -3` | interpreter + REPL | `mise use -g python` |
| `python -m venv` | virtual environments (`.venv/`) | bundled stdlib |
| `python -m pip` | dependency install; `pip freeze` export | bundled |
| `pyproject.toml` | single source of truth: deps, tool config | project file |
| `ruff` | lint + format (replaces flake8/isort/black) | `python -m pip install ruff` |
| `pyright` | strict type check | `python -m pip install pyright` |
| `mypy` | alternate type checker (only if the project chose it) | `python -m pip install mypy` |
| `pytest` | most common test runner (alternative to stdlib `unittest`) | `python -m pip install pytest` |
| `uv` | fast pip/venv replacement worth live-checking as an option | `mise use -g uv` |
| `pydantic` / `dataclasses` | validated / immutable data models | `python -m pip install pydantic` |
