# Stryker Mutator CLI

## Install

```sh
bun add -D stryker-cli
```

## Version

- Latest: see `stryker-cli` on npm
- Repository: https://github.com/stryker-mutator/stryker-js
- Docs: https://stryker-mutator.io/docs/stryker-js/usage/

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `stryker run [config]` | Run mutation testing; look for `stryker.config.*` in cwd | `--configFile`, `--mutate`, `--reporters`, `--testRunner`, `--coverageAnalysis`, `--concurrency`, `--buildCommand`, `--checkers`, `--disableBail`, `--allowEmpty` |
| `stryker init` | Initialize Stryker config and install packages | (none) |
| `stryker --help` | Show help | (none) |

## Options

| Option | Description |
|---|---|---||---|---|---||
| `--configFile`, `-f` | Path to config file |
| `--mutate`, `-m` | Files to mutate |
| `--reporters`, `-r` | Reporters |
| `--testRunner`, `-t` | Test runner (`jest`, `mocha`, `karma`, etc.) |
| `--coverageAnalysis` | Coverage analysis mode: `perTest`, `all`, `off` |
| `--concurrency` | Number of workers or percentage |
| `--buildCommand`, `-b` | Build command to run before tests |
| `--checkers` | Checkers to run (`typescript`) |
| `--disableBail` | Do not stop on first surviving mutant |
| `--allowEmpty` | Allow no mutants |

## Examples

```sh
bunx stryker init
bunx stryker run
bunx stryker run --reporters html,dashboard
bunx stryker run --concurrency 4 --disableBail
```
