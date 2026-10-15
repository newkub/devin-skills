---
name: run-install
description: Install dependencies and resolve installation issues
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - update-version-to-latest
  - follow-tool-mise

---

## Goal

Install all dependencies in the project and resolve any issues that arise during installation

## Scope

Use `run-install` for the specific tasks and workflows it covers (install)

## Execute

> Pre-Run: Always run `/deep-review-codebase` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (install)

### 1. Update Dependencies

> Goal: Update Dependencies

1. Run `/update-version-to-latest` to update all dependencies, runtimes, tools, and versioned config to their latest version
3. Check that the update succeeded with no errors

### 2. Determine Package Manager

> Goal: Determine Package Manager

1. Check all lockfiles and manifests:
   - JS/TS: bun.lock, package-lock.json, pnpm-lock.yaml, yarn.lock
   - Rust: Cargo.toml, Cargo.lock
   - Python: requirements.txt, pyproject.toml, poetry.lock
   - Go: go.mod, go.sum
2. Use bun as the default for JS/TS if there is no lockfile
3. Check package.json for the packageManager field
4. Use cargo for Rust projects

### 3. Clean Install (if needed)

> Goal: Clean Install (if needed)

JavaScript/TypeScript:
1. Delete the `node_modules/` directory
2. Delete the lockfile
3. Run `bun pm cache rm` to clear the cache

Rust:
1. Delete the `target/` directory
2. Delete Cargo.lock
3. Run `cargo clean`

Python:
1. Delete the `venv/` or `.venv/` directory
2. Delete the `__pycache__/` directories
3. Delete the *.pyc files

### 4. Install Dependencies

> Goal: Install Dependencies

JavaScript/TypeScript:
1. Run `bun install` or the package manager in use
2. Follow the progress and errors
3. Run postinstall scripts if there are any

Rust:
1. Run `cargo build` or `cargo check` for the dependencies
2. Follow the progress and errors
3. Run `cargo test` if there are test dependencies

Python:
1. Create a venv: `python -m venv .venv`
2. Activate the venv and run `pip install -r requirements.txt` or `poetry install`
3. Follow the progress and errors

### 5. Fix Issues

> Goal: Fix Issues

JavaScript/TypeScript:
1. Resolve dependency conflicts
2. Update incompatible versions
3. Use resolutions/overrides if needed
4. Run install again to confirm

Rust:
1. Resolve dependency conflicts in Cargo.toml
2. Update versions: `cargo update`
3. Use `[patch]` or `[replace]` if needed
4. Run `cargo build` again to confirm

Python:
1. Resolve dependency conflicts
2. Update versions in requirements.txt or pyproject.toml
3. Use pip constraints if needed
4. Run install again to confirm

## Rules

### 1. Package Manager

Use the package manager matching the lockfile or manifest:

JavaScript/TypeScript:
| Manager | Command |
|---------|---------|
| Bun | `bun install` |
| npm | `npm install` |
| pnpm | `pnpm install` |
| yarn | `yarn install` |

Rust:
| Manager | Command |
|---------|---------|
| Cargo | `cargo build` / `cargo check` |

Python:
| Manager | Command |
|---------|---------|
| pip | `pip install -r requirements.txt` |
| Poetry | `poetry install` |
| PDM | `pdm install` |

Go:
| Manager | Command |
|---------|---------|
| Go | `go mod download` |

### 2. Installation Order

JavaScript/TypeScript:
- Update dependencies before installing
- Install root dependencies first
- Install workspace dependencies in order

Rust:
- Install workspace root dependencies first
- Install workspace members in order
- Use `cargo build -p <package>` to build a specific package

Polyglot Projects:
- Install JS/TS dependencies first (frontend/tooling)
- Install Rust dependencies next (native modules)
- Install Python dependencies last (scripts/tools)

### 3. Error Handling

- Check for errors during installation
- Resolve conflicts as soon as they are found
- Do not skip errors or warnings

### 4. Clean Install

JavaScript/TypeScript:
- Use a clean install when there are dependency conflicts
- Clear the cache before installing if needed

Rust:
- Use `cargo clean` when there are compilation errors
- Delete `~/.cargo/registry/cache` if needed

Python:
- Create a fresh venv when there are dependency conflicts
- Clear the pip cache: `pip cache purge`

General:
- Use a clean install when there are cross-language dependency conflicts
- Clear the cache of every package manager before installing

- Use /update-version-to-latest if needed
- Use /follow-tool-mise if needed

## Expected Outcome

JavaScript/TypeScript:
- Dependencies fully installed
- No installation errors
- Postinstall scripts work
- Imports work

Rust:
- Dependencies fully installed
- No compilation errors
- Cargo.lock created or updated

Python:
- Dependencies fully installed
- venv created and activated successfully
- Imports work

All Languages:
- All tests pass
- Build succeeds for every language