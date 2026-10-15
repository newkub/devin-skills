---
name: open-web-dependencies
description: Open dependency websites from a package manifest
argument-hint: "[manifest]"
related:
  - deep-research
  - list-dependencies
  - run-dev
  - run-install
---

## Goal

Read a package manifest and open the websites of the dependencies used in the project

## Scope

Use `open-web-dependencies` for specific tasks and covering workflows

## Execute

### 1. Read Package Manifest

> Goal: Read the package manifest to identify all dependencies

1. Read package.json, Cargo.toml, or other manifests
2. Identify all dependencies in the project
3. Group them by dependency type

### 2. Open Dependencies Websites

> Goal: Open dependency websites as specified or all of them

1. If no dependencies are specified: open every website
2. If dependencies are specified: open only those
3. Resolve websites in order: the `homepage`/`repository` field in the manifest → the registry page (`https://www.npmjs.com/package/<name>` for npm, `https://crates.io/crates/<name>` for Cargo, `https://pkg.go.dev/<module>` for Go)
4. Open with a native OS command (`start`/`open`/`xdg-open`) or do `/open-web`
5. Look up the needed config, API keys, or environment variables
6. Copy the obtained values into the project

## Rules

1. Must have access to the accounts of the respective services
2. Store secrets securely; never commit them to the repository
3. Use environment variables or secrets management tools
4. Never share secrets with other people

- Use /deep-research dependencies if needed
- Use /follow-tool-madge if needed
- Use /list-dependencies if needed
- Use /run-dev if needed
- Use /run-install if needed

## Expected Outcome

- All dependencies are identified from the package manifest
- Dependency websites open as requested
- The needed config, API keys, or environment variables are obtained
- Dependencies are configured in the project successfully
