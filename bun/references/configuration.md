# Configuration Reference - Bun

## bunfig.toml

Bun configuration file for customizing behavior.

## Location

### Local Configuration

- `bunfig.toml` - Project root
- `package.json` - Embedded in package.json

### Global Configuration

- `$HOME/.bunfig.toml`
- `$XDG_CONFIG_HOME/.bunfig.toml`

## Runtime Configuration

```toml
[preload]
# Scripts to run before bun run
preload = ["./preload.ts"]

[jsx]
# JSX configuration
jsx = "react"
jsxFactory = "h"
jsxFragment = "Fragment"
jsxImportSource = "react"

[smol]
# Reduce memory usage at cost of performance
smol = true

[logLevel]
# Logging level: "debug" | "warn" | "error"
logLevel = "debug"

[define]
# Replace environment variables
"process.env.bagel" = "'lox'"

[loader]
# File loader configuration
".bagel" = "tsx"

[telemetry]
# Disable telemetry
telemetry = false

[env]
# Disable .env loading
file = false

[console]
# Console depth
depth = 3
```

## Package Manager Configuration

```toml
[install]
# Optional dependencies
optional = true

# Dev dependencies
dev = true

# Peer dependencies
peer = true

# Production dependencies
production = true

# Exact versions
exact = true

# Ignore scripts
ignoreScripts = ["preinstall"]

# Concurrent scripts
concurrentScripts = true

# Save text lockfile
saveTextLockfile = true

# Auto install
auto = "bun"

# Prefer Bun packages
prefer = "bun"

# Frozen lockfile
frozenLockfile = true

# Dry run
dryRun = true

# Global directory
globalDir = "~/.bun/install/global"

# Global bin directory
globalBinDir = "~/.bun/bin"

# Registry
registry = "https://registry.bunjs.org"

# Link workspace packages
linkWorkspacePackages = true

[install.scopes]
# Scope-specific registry
"@myorg/" = "https://registry.example.com"

[install.cache]
# Cache directory
cache = "~/.bun/cache"

[install.lockfile]
# Lockfile path
lockfile = "bun.lockb"

[install.linker]
# Linker type
linker = "posix"

[install.globalStore]
# Global store
globalStore = "~/.bun/install/global"

[install.publicHoistPattern]
# Public hoist pattern
publicHoistPattern = "*"

[install.hoistPattern]
# Hoist pattern
hoistPattern = "*"

[install.logLevel]
# Log level
logLevel = "debug"

[install.security.scanner]
# Security scanner
security.scanner = true
```

## Test Configuration

```toml
[test]
# Test root directory
root = "tests"

# Preload scripts
preload = ["./test-setup.ts"]

# Path ignore patterns
pathIgnorePatterns = ["node_modules", "dist"]

# Smol mode
smol = true

# Coverage
coverage = true
coverageThreshold = 0.8
coverageSkipTestFiles = true
coverageIgnoreSourcemaps = true
coveragePathIgnorePatterns = ["node_modules"]
coverageReporter = "lcov"
coverageDir = "coverage"

# Randomize tests
randomize = true
seed = 12345

# Rerun each
rerunEach = 3

# Retry
retry = 2

# Concurrent test glob
concurrentTestGlob = "*.test.ts"

# Only failures
onlyFailures = true

# Reporter
reporter = "dot"
```

## bun run Configuration

```toml
[run]
# Shell type
shell = "system"

# Auto alias node to bun
bun = true

# Silent mode
silent = true

# Elide lines
elide-lines = 100

# No orphans
noOrphans = true
```

## Serve Configuration

```toml
[serve]
# Default port
port = 3000

# Hostname
hostname = "localhost"
```

---

**See also:**
- [Official bunfig.toml Docs](https://bun.sh/docs/runtime/bunfig)
- [Test Configuration](https://bun.sh/docs/test/configuration)
- [Runtime Configuration](https://bun.sh/docs/runtime/configuration)
