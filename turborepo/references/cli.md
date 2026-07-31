# CLI Reference

## turbo run

Run tasks in monorepo.

```bash
turbo run <task> [options]
```

### Options

| Flag | Description |
|------|-------------|
| `--filter` | Filter packages by name |
| `--concurrency` | Limit concurrent tasks |
| `--dry` | Preview without executing |
| `--force` | Ignore cache, run all tasks |
| `--graph` | Generate task graph visualization |
| `--cache` | Enable/disable local cache |
| `--cache-dir` | Cache directory path |
| `--output-logs` | Log output mode |
| `--summarize` | Generate run summary |
| `--affected` | Run only affected tasks |
| `--ui` | Terminal UI mode |
| `--env-mode` | Environment variable mode |

### Examples

```bash
# Run build task
turbo run build

# Run multiple tasks
turbo run build test lint

# With filter
turbo run build --filter=web
turbo run build --filter=web...
turbo run build --filter=!docs

# Dry run
turbo run build --dry

# Force rebuild
turbo run build --force

# Limit concurrency
turbo run build --concurrency=5
```

## turbo login

Login to Vercel for remote cache.

```bash
turbo login [options]
```

### Options

| Flag | Description |
|------|-------------|
| `--token` | Specify login token directly |
| `--name` | Team name |
| `--no-git` | Skip git remote detection |

## turbo link

Link repository to Vercel.

```bash
turbo link [options]
```

### Options

| Flag | Description |
|------|-------------|
| `--no-git` | Skip git remote detection |

## turbo logout

Logout from Vercel.

```bash
turbo logout
```

## turbo prune

Create a pruned monorepo for CI.

```bash
turbo prune --out-dir <dir> <package>
```

### Options

| Flag | Description |
|------|-------------|
| `--out-dir` | Output directory |
| `--scope` | Package to prune |

### Example

```bash
# Create pruned monorepo for web app
turbo prune --out-dir /out web
```

## turbo unlink

Unlink repository from Vercel.

```bash
turbo unlink
```

## Global Flags

| Flag | Description |
|------|-------------|
| `--version` | Show version |
| `--help` | Show help |
| `--color` | Enable colors |
| `--cwd` | Set working directory |
| `--no-update-notifier` | Disable update check |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TURBO_TOKEN` | Authentication token |
| `TURBO_TEAM` | Team slug |
| `TURBO_REMOTE_CACHE` | Remote cache URL |
| `TURBO_FORCE` | Force run all tasks |