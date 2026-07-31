# CLI Reference

## Installation Commands

| Command | Description |
|---------|-------------|
| `mise use -g aube` | Install via mise (recommended) |
| `bun install -g @endevco/aube` | Install via bun |
| `brew install endevco/tap/aube` | Install via Homebrew |
| `mise use aube` | Pin aube in project |
| `aube --version` | Check version |

## Package Management

| Command | Description |
|---------|-------------|
| `aube add <pkg>` | Add dependency |
| `aube add -D <pkg>` | Add dev dependency |
| `aube remove <pkg>` | Remove dependency |
| `aube update` | Update dependencies |
| `aube install` | Install all dependencies |
| `aube install --prod` | Production install only |
| `aube install --lockfile-only` | Update lockfile only |
| `aube install -r` | Install in workspace |

## Running Scripts

| Command | Description |
|---------|-------------|
| `aube run <script>` | Run package.json script |
| `aube test` | Run test script (auto-install if stale) |
| `aube build` | Run build script |
| `aube dev` | Run dev script |
| `aube exec <bin>` | Run local binary |
| `aube dlx <pkg>` | Fetch and run one-off tool |

## Shortcuts

| Shortcut | Full Command | Description |
|----------|--------------|-------------|
| `aubr <script>` | `aube run <script>` | Run script with auto-install |
| `aubx <pkg> [args]` | `aube dlx <pkg>` | Run one-off tool |
| `aubx -p <pkg>` | `aube dlx -p <pkg>` | Force package install |

## CI Commands

| Command | Description |
|---------|-------------|
| `aube ci` | Clean frozen install (lockfile as source) |

## Information Commands

| Command | Description |
|---------|-------------|
| `aube list` | List dependencies |
| `aube why <pkg>` | Why is this package installed |
| `aube outdated` | Check for newer versions |
| `aube audit` | Security audit |
| `aube store path` | Show global store path |
| `aube config get registry` | Get registry URL |

## Build Scripts

| Command | Description |
|---------|-------------|
| `aube approve-builds` | Approve lifecycle scripts |
| `aube ignored-builds` | List packages with skipped scripts |

## Flags

| Flag | Description |
|------|-------------|
| `-r` | Run in workspace (recursive) |
| `--filter <pkg>` | Target specific workspace |
| `--prod` | Production dependencies only |
| `--lockfile-only` | Update lockfile without installing |

## Examples

```bash
# Daily workflow
aube add react react-dom
aubr test
aube build

# CI
aube ci

# One-off tools
aubx cowsay "Hello"
aubx -p prettier --check "src/**/*.js"
```