# mise Reference

## Overview

mise (mise-en-place) is a dev tools, env vars, and tasks manager. It pins tool versions, loads environment variables, and defines tasks in a single `mise.toml` file. Compatible with `.tool-versions` (asdf) and npm.

## Install

```sh
# Unix (curl)
curl https://mise.run | sh

# Windows
winget install mise
scoop install mise

# cargo
cargo install mise

# npm
npm install -g mise
```

## Version

- Latest: `2026.8.12`
- License: MIT
- Repository: https://github.com/jdx/mise
- Docs: https://mise.jdx.dev

## CLI Commands

```sh
mise --version              # show version
mise doctor                 # check installation health
mise install                # install all tools from config
mise install node@20        # install specific version
mise use node@24            # add tool to config and install
mise use -g node@24         # add global tool
mise list                   # list installed tools
mise list --current         # list active tools
mise latest node            # show latest available version
mise prune                  # remove unused versions
mise up                     # update all tools to latest matching
mise env                    # show env vars
mise set KEY=value          # set env var in config
mise unset KEY              # remove env var
mise exec -- <command>      # run command in mise env
mise run <task>             # run a task
mise run                    # list available tasks
mise tasks ls               # list tasks
mise tasks add <name>       # add a task
mise config                 # show loaded config files
mise cfg                    # alias for config
```

## Configuration File

`mise.toml` at project root. Hierarchical — walks up directory tree, more specific overrides broader.

### Config File Paths (precedence high to low)

1. `mise.local.toml` — local overrides (not committed)
2. `mise.toml`
3. `mise/config.toml`
4. `.mise/config.toml`
5. `.config/mise.toml`
6. `.config/mise/config.toml`
7. `~/.config/mise/config.toml` — global user config

### Example mise.toml

```toml
[tools]
node = '24'
python = '3.13'
bun = '1.3.14'

[env]
NODE_ENV = 'development'
_.file = '.env.local'

[tasks.dev]
run = 'npm run dev'

[tasks.build]
description = 'Build the project'
run = 'cargo build'
alias = 'b'

[tasks.test]
description = 'Run tests'
run = ['cargo test', './scripts/test-e2e.sh']
depends = ['build']
sources = ['Cargo.toml', 'src/**/*.rs']
outputs = ['target/debug/mycli']

[tasks.lint]
description = 'Lint with clippy'
env = { RUST_BACKTRACE = '1' }
run = '''
#!/usr/bin/env bash
cargo clippy
'''

[tasks.ci]
description = 'Run CI tasks'
depends = ['build', 'lint', 'test']
```

## [tools] Section

```toml
[tools]
node = '24'
python = '3.12'
bun = 'latest'

# with postinstall
node = { version = "22", postinstall = "corepack enable" }
```

- Pin versions for consistency
- Use `latest` only when auto-update is desired
- `mise use <tool>@<version>` writes to config automatically

## [env] Section

```toml
[env]
NODE_ENV = 'production'
_.file = '.env.local'           # load from .env file
_.path = ['{{env.GEM_HOME}}/bin']  # add to PATH

# default value (keeps existing non-empty)
NODE_ENV = { default = "development" }

# unset a variable
NODE_ENV = false

# required variable
DATABASE_URL = { required = true }

# redacted variable
SECRET = { value = "my_secret", redact = true }
```

## [tasks] Section

| Property | Description |
|----------|-------------|
| `run` | Command or list of commands (run in series) |
| `run_windows` | Alternate command for Windows |
| `depends` | List of task names to run first |
| `description` | Task description |
| `alias` | Short alias for `mise run` |
| `hide` | `true` to hide from task list |
| `dir` | Working directory (`"{{cwd}}"` for user's cwd) |
| `env` | Task-specific env vars |
| `sources` | Files to watch for caching |
| `outputs` | Output files for caching |
| `confirm` | Confirmation message before running |
| `shell` | Shell command (e.g. `bash -c`) |
| `file` | External script file to execute |

### Trivial Tasks

```toml
[tasks]
build = "cargo build"
test = "cargo test"
lint = "cargo clippy"
```

## Shell Activation

```sh
# bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc

# zsh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc

# fish
echo 'mise activate fish | source' >> ~/.config/fish/config.fish
```

## Global Tools

```sh
mise use -g node@24       # global tool
mise use -g hk            # global tool (latest)
mise list                 # check installed tools
```

## Environment-Specific Config

Set `MISE_ENV=development` to load `mise.development.toml`. Platform-specific: `mise.windows.toml`, `mise.macos-arm64.toml`.

## Source

- Docs: https://mise.jdx.dev
- Configuration: https://mise.jdx.dev/configuration.html
- Tasks: https://mise.jdx.dev/tasks/toml-tasks.html
- Environments: https://mise.jdx.dev/environments/
- CLI: https://mise.jdx.dev/cli/
- GitHub: https://github.com/jdx/mise
