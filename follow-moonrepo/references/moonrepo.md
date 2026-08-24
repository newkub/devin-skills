# moonrepo Reference

> A task runner and monorepo management tool for the web ecosystem, written in Rust.

## Install

### Bun

```sh
bun install --dev @moonrepo/cli
```

### npm / pnpm / yarn

```sh
npm install --save-dev @moonrepo/cli
pnpm add --save-dev @moonrepo/cli
yarn add --dev @moonrepo/cli
```

### Windows (PowerShell)

```powershell
irm https://moonrepo.dev/install/moon.ps1 | iex
```

### Linux / macOS / WSL

```sh
bash <(curl -fsSL https://moonrepo.dev/install/moon.sh)
```

### proto

```sh
proto install moon
```

## Version

- Latest: moon v2.x
- License: MIT
- npm package: `@moonrepo/cli`
- Single binary, no external dependencies required

## Workspace Setup

Initialize moon in a repository:

```sh
moon init
```

This creates a `.moon` folder with `.moon/workspace.*` configuration and appends ignore patterns to `.gitignore`.

Use `moon init --minimal` for quick prototyping.

### Migrate from Turborepo

```sh
moon ext migrate-turborepo
```

### Migrate from Nx

```sh
moon ext migrate-nx
```

## `.moon/workspace.yml`

Required file configuring projects and workspace settings:

```yaml
vcs:
  client: 'git'
  defaultBranch: 'master'

projects:
  - 'apps/*'
  - 'packages/*'
```

### Using a Map

```yaml
projects:
  admin: 'apps/admin'
  apiClients: 'packages/api-clients'
  designSystem: 'packages/design-system'
  web: 'apps/web'
```

### Using Globs and Map

```yaml
projects:
  globs:
    - 'apps/*'
    - 'packages/*'
  sources:
    www: 'www'
```

### VCS Configuration

```yaml
vcs:
  client: 'git'
  defaultBranch: 'master'
```

## Tasks

Tasks are commands run in the context of a project. Configured per-project via `moon.yml` or shared via `.moon/tasks/**/*`.

### Task Types

- **Build** — generates artifacts (derived from `outputs` setting)
- **Run** — long-running or one-off process (derived from `options.persistent`)
- **Test** — asserts code correctness (default type)

### Task Configuration in `moon.yml`

```yaml
tasks:
  build:
    command: 'tsc'
    outputs:
      - 'dist'
  test:
    command: 'vitest'
  dev:
    command: 'start-dev-server'
    preset: 'server'
  lint:
    command: 'eslint'
    args: ['src', '--fix']
```

### Command vs Script

A task is either a `command` or `script`, not both:

```yaml
tasks:
  # Command: single binary execution
  build:
    command: 'tsc'
    args: ['--outDir', 'dist']

  # Script: shell execution with pipes/redirects
  deploy:
    script: 'npm run build && npm run deploy'
```

### Persistent Tasks

```yaml
tasks:
  dev:
    command: 'start-dev-server'
    options:
      persistent: true
```

Or use preset:

```yaml
tasks:
  dev:
    command: 'start-dev-server'
    preset: 'server'
```

### Interactive Tasks

```yaml
tasks:
  init:
    command: 'init-app'
    options:
      interactive: true
```

### Internal Tasks

```yaml
tasks:
  prepare:
    command: 'intermediate-step'
    options:
      internal: true
```

### Task Dependencies

```yaml
tasks:
  build:
    command: 'tsc'
    deps:
      - '^build'
    outputs:
      - 'dist'
```

- `^task` — run task in dependencies first
- `task` — run task in same project first

## Shared Task Config (`.moon/tasks/`)

Create `.moon/tasks/all.yml` for shared task configuration across all projects:

```yaml
fileGroups:
  configs:
    - '*.config.ts'
    - 'tsconfig*.json'

tasks:
  lint:
    command: 'eslint'
    args: ['--fix']
    inputs:
      - '@group(configs)'
      - 'src/**/*'
```

## CLI Commands

```sh
moon init                    # Initialize workspace
moon run <target>            # Run a task (e.g., moon run :build)
moon run <project>:<task>    # Run task in specific project
moon check                   # Run all check-like tasks
moon run :build              # Run build in all projects
moon run :test               # Run test in all projects
moon task                    # List all tasks
moon upgrade                 # Upgrade moon binary
```

## Source

- Docs: https://moonrepo.dev/docs
- GitHub: https://github.com/moonrepo/moon
- npm: https://www.npmjs.com/package/@moonrepo/cli
