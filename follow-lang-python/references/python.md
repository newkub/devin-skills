# Python Language, pip, venv, and Best Practices

## Install

Download Python 3.13+ from `https://www.python.org/downloads/`.

Python 3.13 was released on October 7, 2024. It includes a new interactive
interpreter, experimental free-threaded mode (PEP 703), and a JIT compiler
(PEP 744).

```bash
# Linux/macOS: verify installation
python3 --version

# Windows: use the py launcher
py -3 --version
```

## pip

`pip` is the preferred installer program, included by default with Python
binary installers. It installs packages from the Python Package Index (PyPI).

### Basic Commands

```bash
# Install latest version of a package
python -m pip install SomePackage

# Install specific version
python -m pip install SomePackage==1.0.4

# Install minimum version
python -m pip install "SomePackage>=1.0.4"

# Upgrade a package
python -m pip install --upgrade SomePackage

# Uninstall packages
python -m pip uninstall SomePackage

# List installed packages
python -m pip list

# Show package details
python -m pip show requests

# Freeze installed packages to requirements.txt
python -m pip freeze > requirements.txt

# Install from requirements file
python -m pip install -r requirements.txt
```

### Multiple Python Versions

```bash
# POSIX systems
python3    -m pip install SomePackage  # default Python 3
python3.13 -m pip install SomePackage  # specifically Python 3.13

# Windows
py -3    -m pip install SomePackage  # default Python 3
py -3.13 -m pip install SomePackage  # specifically Python 3.13
```

### User-Only Install

```bash
python -m pip install --user SomePackage
```

### Ensure pip Is Installed

```bash
python -m ensurepip --default-pip
```

## venv

`venv` is the standard library module for creating virtual environments.
Recommended since Python 3.5.

### Create a Virtual Environment

```bash
python -m venv .venv
```

### Activate

```bash
# Windows
.venv\Scripts\activate

# Unix or macOS
source .venv/bin/activate
```

### Deactivate

```bash
deactivate
```

### venv CLI Options

```
usage: venv [-h] [--system-site-packages] [--symlinks | --copies] [--clear]
            [--upgrade] [--without-pip] [--prompt PROMPT] [--upgrade-deps]
            [--without-scm-ignore-files]
```

Key flags:
- `--system-site-packages`: Give access to the system site-packages
- `--without-pip`: Skip installing pip in the venv
- `--upgrade-deps`: Upgrade pip and setuptools to latest on PyPI
- `--without-scm-ignore-files`: Skip creating `.gitignore` (added in 3.13)

### Python 3.13 venv Changes

`venv` now creates a `.gitignore` file for Git by default. Use
`--without-scm-ignore-files` to opt out.

## pyproject.toml Configuration

Use `pyproject.toml` as the single source of truth for project configuration.

```toml
[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "pydantic>=2.0",
]

[project.optional-dependencies]
dev = [
    "ruff>=0.1.0",
    "pyright>=1.1.0",
    "pytest>=7.0",
]

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "UP"]

[tool.pyright]
include = ["src"]
typeCheckingMode = "strict"
```

## Best Practices

### Type Hints

```python
from __future__ import annotations

def greet(name: str) -> str:
    return f"Hello, {name}"

async def fetch_data(url: str) -> dict[str, str]:
    ...
```

### Dataclass for Data Models

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class User:
    name: str
    email: str
    age: int
```

### Import Ordering

1. Standard library imports
2. Related third-party imports
3. Local application/library imports

Separate each group with a blank line.

```python
import os
import sys
from pathlib import Path

import pydantic
import requests

from myapp.domain import User
from myapp.adapters import Repository
```

### Forward References

```python
from __future__ import annotations

class TreeNode:
    def __init__(self, value: int, parent: TreeNode | None = None) -> None:
        self.value = value
        self.parent = parent
```

## CLI Commands Summary

| Command | Description |
|---|---|
| `python -m venv .venv` | Create virtual environment |
| `source .venv/bin/activate` | Activate (Unix/macOS) |
| `.venv\Scripts\activate` | Activate (Windows) |
| `deactivate` | Deactivate venv |
| `python -m pip install <pkg>` | Install package |
| `python -m pip install --upgrade <pkg>` | Upgrade package |
| `python -m pip uninstall <pkg>` | Remove package |
| `python -m pip list` | List installed packages |
| `python -m pip freeze > requirements.txt` | Export requirements |
| `python -m pip install -r requirements.txt` | Install from requirements |
| `ruff check .` | Run linter |
| `ruff format .` | Format code |
| `pyright` | Run type checker |

## Source URLs

- Python docs: `https://docs.python.org/3/`
- venv docs: `https://docs.python.org/3/library/venv.html`
- Installing modules: `https://docs.python.org/3/installing/index.html`
- Virtual environments tutorial: `https://docs.python.org/3/tutorial/venv.html`
- What's new in Python 3.13: `https://docs.python.org/3/whatsnew/3.13.html`
- Python Packaging User Guide: `https://packaging.python.org`
