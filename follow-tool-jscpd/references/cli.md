# jscpd CLI

## Install

```sh
bun add -D jscpd
```

## Version

- Latest: see `jscpd` on npm
- Repository: https://github.com/kucherenko/jscpd
- Docs: https://jscpd.dev/getting-started/configuration

## Commands

| commands | description | default | options |
|---|---|---|---|
| `jscpd [paths]` | Detect copy/paste in paths | default threshold `null` | `--min-lines`, `--min-tokens`, `--max-lines`, `--max-size`, `--threshold`, `-c, --config`, `--ignore`, `--reporters`, `--output`, `--mode`, `--pattern`, `--blame`, `--silent`, `--workers`, `--absolute`, `--no-gitignore` |
| `cpd [paths]` | Alias for `jscpd` | — | same as `jscpd` |
| `jscpd --list` | List supported formats | — | (none) |
| `jscpd --help` | Show help | — | (none) |

## Options

| Option | Description | Default |
|---|---|---||---|---|---||---|---|---||
| `--min-lines`, `-l` | Minimum duplicate lines | 5 |
| `--min-tokens`, `-k` | Minimum duplicate tokens | 50 |
| `--max-lines`, `-x` | Max source file lines | 1000 |
| `--max-size`, `-z` | Max source file size | `100kb` |
| `--threshold`, `-t` | Threshold for error exit | `null` |
| `--config`, `-c` | Path to `.jscpd.json` | `null` |
| `--ignore`, `-i` | Glob pattern to ignore | `null` |
| `--reporters`, `-r` | Reporters | `time,console` |
| `--output`, `-o` | Report output dir | `./report/` |
| `--mode`, `-m` | Search mode: `strict`, `mild`, `weak` | `mild` |
| `--pattern`, `-p` | Glob pattern to search | `**/*` |
| `--blame`, `-b` | Blame authors | `false` |
| `--workers`, `-w` | Parallel workers | auto |
| `--no-gitignore` | Ignore `.gitignore` | `false` |

## Examples

```sh
bunx jscpd ./src
bunx jscpd ./src -r html -o ./report
bunx jscpd ./src --threshold 10 --min-tokens 30
```
