# hk Reference

## Overview

hk is a fast git hook manager and project linting tool with emphasis on performance. It uses Pkl for type-safe configuration and integrates tightly with linters via read/write file locks for maximum concurrency.

## Install

```sh
# mise (recommended)
mise use -g hk          # global
mise use hk              # project-level

# cargo
cargo install hk

# homebrew
brew install hk
```

## Version

- Latest: `1.56.1`
- License: MIT
- Repository: https://github.com/jdx/hk
- Docs: https://hk.jdx.dev

## CLI Commands

```sh
hk --version             # show version
hk init                  # create hk.pkl scaffold
hk install               # install git hooks per-repo
hk install --global      # install globally (Git 2.54+)
hk uninstall             # remove git hooks
hk run pre-commit        # run pre-commit hook
hk run pre-push          # run pre-push hook
hk run pre-merge-commit  # run pre-merge-commit hook
hk check --all           # run all check steps (CI)
hk fix                   # run fix steps
hk config dump           # show effective config
hk config explain        # explain config resolution
hk builtins              # list built-in linters
hk test                  # test hook configuration
hk validate              # validate config
hk migrate pre-commit    # migrate from pre-commit
```

## Configuration

hk is configured via `hk.pkl` (Pkl language from Apple). Config file search order (first match wins):

1. `hk.local.pkl` — local overrides (not committed)
2. `.config/hk.local.pkl` — local overrides, nested
3. `hk.pkl` — standard project config
4. `.config/hk.pkl` — standard project config, nested

### Example hk.pkl

```pkl
amends "package://github.com/jdx/hk/releases/download/v1.56.1/hk@1.56.1#/Config.pkl"
import "package://github.com/jdx/hk/releases/download/v1.56.1/hk@1.56.1#/Builtins.pkl"

mise = true

local linters = new Mapping<String, Step> {
    ["biome"] {
        glob = List("*.{ts,tsx,js,jsx,vue,json,jsonc,md}")
        exclude = List("**/.agents/**", "**/.devin/**")
        check = "bunx biome check --no-errors-on-unmatched {{files}}"
        fix = "bunx biome check --write --no-errors-on-unmatched {{files}}"
        batch = true
    }
    ["gitleaks"] {
        check = "gitleaks protect --no-banner --redact --config .gitleaks.toml --staged"
    }
}

local checks = new Mapping<String, Step> {
    ["scan"] {
        check = "bun run scan"
        stomp = true
    }
    ["typecheck"] {
        check = "bun run typecheck"
        stomp = true
    }
}

hooks {
    ["pre-commit"] {
        fix = true
        stash = "git"
        steps = linters
    }
    ["pre-push"] {
        steps = checks
    }
    ["pre-merge-commit"] {
        steps {
            ["typecheck"] = checks["typecheck"]
        }
    }
    ["check"] {
        steps {
            ...linters
            ...checks
        }
    }
    ["fix"] {
        fix = true
        steps = linters
    }
}
```

### hk.local.pkl

```pkl
amends "./hk.pkl"
// local overrides only, do not commit
```

## Step Properties

| Property | Description |
|----------|-------------|
| `glob` | File globs to filter staged files |
| `exclude` | List of glob patterns to exclude |
| `check` | Read-only command (no modifications) |
| `fix` | Command that modifies files |
| `batch` | `true` to pass all files in one command |
| `stomp` | `true` for workspace-wide checks (no file lock) |
| `stash` | `"git"`, `"patch-file"`, or `"none"` |
| `depends` | List of step names to run before this step |
| `exclusive` | `true` to run this step alone |
| `stage` | Globs for files to stage after fix |

## Hook Behavior

- `pre-commit`: use `fix = true` to auto-fix, `stash = "git"` to stash unstaged changes
- `pre-push`: run check-only (no fix)
- `pre-merge-commit`: run typecheck only
- Valid hook names: `pre-commit`, `pre-push`, `pre-merge-commit`, `commit-msg`, `post-checkout`, `post-commit`, `post-merge`, `post-rewrite`, `pre-rebase`, `prepare-commit-msg`
- Do NOT use `pre-merge` (not a valid Git hook name)

## mise Integration

```toml
# mise.toml
[tools]
hk = "1.56.1"

[env]
HK_MISE = "1"

[hooks]
postinstall = "hk install"
```

- Set `mise = true` in `hk.pkl` when tools come from mise
- Set `HK_MISE = "1"` in `mise.toml` `[env]`
- Use `mise x -- hk install` in `package.json` `prepare` script

## Built-in Linters

Use `Builtins.<name>` in `hk.pkl` to reference built-in linters:

- `Builtins.prettier`
- `Builtins.gitleaks`
- `Builtins.eslint`
- `Builtins.ruff`
- `Builtins.cocogitto_commit_msg`
- Run `hk builtins` for full list

## Environment Variables

| Variable | Description |
|----------|-------------|
| `HK_MISE` | Set to `1` to enable mise integration |
| `HK_FILE` | Override config file path |
| `HK_PKL_BACKEND` | `pklr` (default) or `pkl` |
| `HK_REPORT_JSON` | Contains timing JSON for report hooks |
| `HK=0` | Disable hk for a single command |

## Source

- Docs: https://hk.jdx.dev
- Configuration: https://hk.jdx.dev/configuration.html
- CLI reference: https://hk.jdx.dev/cli/
- GitHub: https://github.com/jdx/hk
- Releases: https://github.com/jdx/hk/releases
