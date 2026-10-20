---
name: use-my-packages-on-registry
description: List packages owned by the user on a registry and install them into the project
argument-hint: "[scope]"
related:
  - list-my-npm-packages
  - deep-review
  - use-bun-native-api
  - use-scripts
  - suggest-next-action
  - report
  - ask-me

---

## Goal

Review the packages the user published on the registry and pick which ones to install into the project

## Scope

Use with projects that have a package manager (npm/bun, cargo, python) to list and install packages the user owns

## Execute

### 1. Detect Registry And Package Manager

> Goal: Identify the project's registry and package manager

1. Read `package.json` → use the npm/bun registry
2. Read `Cargo.toml` → use crates.io
3. Read `pyproject.toml` → use PyPI
4. If both `package.json` and `Cargo.toml` exist → let the user choose, or follow the main manifest
5. If there is no manifest → run `/ask-me` to identify the registry

### 2. List My Packages

> Goal: List the packages the user owns

1. npm/bun → run `/list-my-npm-packages` (or `https://registry.npmjs.org/-/v1/search?text=maintainer:<user>`)
2. cargo → use `https://crates.io/api/v1/crates?user_id=<id>` if you can find the user id (`cargo search` looks up by name, not by owner)
3. python → use `https://pypi.org/pypi/<pkg>/json` for package names you know (`pip index versions <pkg>` is experimental and only views a single package's versions)
4. Present the results with `/report` using the columns `No.`, `Package`, `Version`, `Registry`, `Description`

### 3. Select Packages

> Goal: Select the packages to install

1. Run `/ask-me`, or pick from `/report`, to decide which packages to install
2. Use `/deep-review` to check whether each selected package fits the tech stack
3. Mark whether it belongs in `dependencies`, `devDependencies`, or `peerDependencies`
4. If there are several package managers → follow the order the user picks

### 4. Install Packages

> Goal: Install the selected packages into the project

1. Bun/Node:
   - `bun add <pkg>` for dependencies
   - `bun add -d <pkg>` for dev dependencies
   - If the project primarily uses npm: use the npm install command with the package name
2. cargo:
   - `cargo add <pkg>`
   - `cargo add --dev <pkg>` for dev dependencies
3. python:
   - `pip install <pkg>`
   - Save it into `requirements.txt` or `pyproject.toml`
4. Update the lockfile with `bun install`, `cargo update`, `pip freeze`

### 5. Verify

> Goal: Confirm the installation succeeded

1. Check the manifest for the installed package
2. Run the project's test/build
3. Verify that the imports work
4. Run `/suggest-next-action`

## Rules

### 1. Registry Detection

- Rely primarily on the project's manifest
- If it's unclear → run `/ask-me`
- Never assume the registry

### 2. Package Selection

- Use `/deep-review` to check compatibility
- Don't duplicate dependencies that already exist
- If there are several package managers → let the user choose

### 3. Security

- Don't expose tokens, credentials, or secrets
- Use `bun add` for Bun/Node projects at the project level
- Use `cargo add` for Rust

### 4. Scripts And Temp

- If you need to process complex data → run `/use-scripts`
- Use `/create-files-in-os-temp` for temp files or throwaway reports

- Use /use-bun-native-api if needed

## Expected Outcome

- A list of registry packages owned by the user
- Packages installed into the project via the detected package manager
- The manifest and lockfile updated
- No broken references
