# CLI Reference

## Lefthook Commands Reference

### Installation Commands

| Command | Description |
|---------|-------------|
| `lefthook install` | Install Git hooks (creates .git/hooks/* files) |
| `lefthook install -b ruby` | Install hooks for Ruby project |
| `lefthook install -b node` | Install hooks for Node.js project |
| `lefthook install -s` | Silent install (no output) |
| `lefthook uninstall` | Remove installed hooks |

### Execution Commands

| Command | Description |
|---------|-------------|
| `lefthook run <hook>` | Run specific hook manually |
| `lefthook run pre-commit` | Run pre-commit hook |
| `lefthook run pre-push` | Run pre-push hook |
| `lefthook run commit-msg` | Run commit-msg hook |

### Run Options

| Option | Description |
|--------|-------------|
| `lefthook run <hook> -v` | Verbose output |
| `lefthook run <hook> --dry-run` | Simulate without executing |
| `lefthook run <hook> --force` | Force execution even if skipped |
| `lefthook run <hook> -c <config>` | Use specific config file |
| `lefthook run <hook> -d <dir>` | Use different root directory |

### Configuration Commands

| Command | Description |
|---------|-------------|
| `lefthook init` | Create empty lefthook.yml |
| `lefthook validate` | Validate lefthook.yml syntax |
| `lefthook dump` | Print merged configuration |
| `lefthook dump -c <file>` | Dump specific config file |

### Utility Commands

| Command | Description |
|---------|-------------|
| `lefthook version` | Show version information |
| `lefthook --help` | Show help message |
| `lefthook add-plugins` | Add recommended plugins |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `LEFTHOOK=0` | Skip all hooks |
| `LEFTHOOK=false` | Skip all hooks (alternative) |
| `SKIP=hook1,hook2` | Skip specific hooks |
| `LEFTHOOK_VERBOSE=1` | Enable verbose output |
| `LEFTHOOK_JSON=1` | JSON output format |
| `LEFTHOOK_CONFIG=file` | Use specific config file |
| `LEFTHOOK_TIMEOUT=300` | Set command timeout (seconds) |

### Examples

```bash
# Install hooks
lefthook install

# Run pre-commit manually
lefthook run pre-commit

# Verbose run
lefthook run pre-commit -v

# Validate config
lefthook validate

# Show config
lefthook dump

# Skip hooks for this commit
LEFTHOOK=0 git commit -m "WIP"

# Use specific config
lefthook run pre-commit -c lefthook.prod.yml

# Check version
lefthook version
```

### npx/bun Commands

```bash
# Install
bun install --save-dev lefthook

# Initialize hooks
npx lefthook install

# Run hooks
npx lefthook run pre-commit

# With bun scripts in package.json
{
  "scripts": {
    "prepare": "lefthook install"
  }
}
```

### Exit Codes

| Code | Description |
|------|-------------|
| `0` | All commands passed |
| `1` | One or more commands failed |
| `2` | Configuration error |
| `3` | Lefthook not installed |
