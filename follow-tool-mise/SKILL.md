---
name: follow-tool-mise
description: Set up and use mise for managing dev tools, env vars, and tasks
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - use-scripts
  - follow-tool-mr-boxington
  - follow-tool-viteplus
---

## Goal

Set up and use mise for managing dev tools, env vars, and tasks per best practices

## Scope

For projects that want to pin tool versions, load environment variables, and define tasks in one file (`mise.toml`)

- Use this skill when managing dev tool versions/env/tasks — if the job is monorepo task orchestration, use `/follow-tool-moonrepo` or `/follow-tool-turborepo` instead
- Vite+ manages the JS toolchain itself (`vp toolchain`, `vp install`) — in a Vite+ project use that for Node/package managers and keep mise for other tools → `/follow-tool-viteplus`
- For the Rust tool option `mr_boxington` (shared Cargo build cache via mise ≥2026.9.2), see `/follow-tool-mr-boxington`
- Latest: `mise@2026.9.14` (CalVer, verified 2026-09-26)
- References: [apis](references/apis.md) | [cli](references/cli.md) | best-practices/
- References: [mise — Best Practices](best-practices/mise.md)

## Execute

### Workflows

| Topic | Workflow |
|-------|----------|
| Install mise, activate shell, `mise doctor` | `workflows/setup-mise/SKILL.md` |
| `mise.toml` — tools, tasks, env | `workflows/config-tools/SKILL.md` |

### 1. Check And Install Mise

> Goal: check and install mise

1. Run `mise --version` to check the installation
2. If missing, install:
   - Unix: `curl https://mise.run -o /tmp/mise-install.sh && sh /tmp/mise-install.sh`
   - Windows: `winget install jdx.mise` or `scoop install mise`
   - Cargo: `cargo install mise`
3. Add mise to shell activation per the OS/shell
4. Run `mise doctor` to check health

### 2. Initialize Mise Configuration

> Goal: create the project's `mise.toml`

1. Create `mise.toml` at the project root
2. Define tools in `[tools]`: `node = "24"`, `python = "3.13"`, `bun = "latest"`, etc.
3. Use `mise use <tool>@<version>` to add a tool to the config automatically
4. Use `mise install` to install every tool in the config
5. Use `mise list` to verify installed tools

### 3. Manage Tool Versions

> Goal: manage tool versions

1. Run `mise use <tool>@<version>` to change a version
2. Run `mise install` to install the new version
3. Run `mise list` to see installed versions
4. Run `mise prune` to remove unused versions
5. Use `mise up` to update every tool to its latest matching version

### 4. Configure Environment Variables

> Goal: set env vars in mise

1. Add an `[env]` section in `mise.toml`
2. Use `_.file = ".env.local"` to load from a .env file
3. Use `_ = { VAR = "value" }` to set values directly
4. Run `mise env` to see the env vars that will be exported
5. Run `mise exec -- <command>` to run a command under the mise env

### 5. Define Tasks

> Goal: create tasks in mise

1. Add `[tasks.<name>]` in `mise.toml`
2. Define `run = "<command>"` for each task
3. Use dependencies: `depends = ["build"]`
4. Use `sources` and `outputs` for caching
5. Run `mise run <task>` or `mise <task>`
6. Run `mise tasks` to list all tasks

### 6. Integrate With Project Scripts

> Goal: connect mise with scripts

1. Use `mise exec -- <script>` to run scripts in the mise env
2. Use `mise run` for task automation
3. Combine with `/use-scripts` when custom scripts are needed
4. Use `mise run <task> -- <args>` to pass arguments to a task

### Use Cases

| Scenario | Use case |
|----------|----------|
| Pin the CI toolchain from `mise.toml` | `usecases/ci-toolchain-pin.md` |
| Replace chained scripts with cached tasks | `usecases/tasks-with-caching.md` |

## Rules

### 1. Configuration File

- `mise.toml` sits at the project root for project config
- `mise.local.toml` for local overrides (not committed)
- `~/.config/mise/config.toml` for the global user config
- Use `mise use <tool>@<version>` instead of hand-editing files when possible
- Commit `mise.toml` to the repo

### 2. Tool Versions

- Pin versions in `mise.toml` for consistency
- Use `latest` only when auto-update is wanted
- Check `mise list` before pushing
- Use `mise up` to update dependencies per version constraints

### 3. Environment

- Never commit secrets into `mise.toml`
- Use `_.file = ".env.local"` or `_.path = ".env"` for non-sensitive env
- If secrets need safe handling → use `/follow-secret-manager`
- Check `mise env` before running important commands

### 4. Tasks

- Name tasks clearly: `build`, `test`, `lint`, `dev`
- Use `depends` for task dependencies
- Use `sources`/`outputs` when caching is wanted
- Don't define tasks that duplicate package-manager scripts without reason

### 5. Global Tools

- Use `mise use -g <tool>@<version>` for global tools per `global_rules`
- Watch that global versions don't collide with project versions
- Check `mise list` for global tools

### 6. Safety

- Run `mise doctor` before tackling complex problems
- Don't delete the `.mise` cache blindly
- Check the exit code of `mise run`

- Use /open-web-for-config-secret if needed (tool mise)
- Use /follow-secret-manager if needed

## Expected Outcome

- `mise.toml` created and correct
- Tools installed at the specified versions
- Env vars load automatically when entering the project directory
- Tasks runnable via `mise run <task>`
- Project setup repeatable on another machine
