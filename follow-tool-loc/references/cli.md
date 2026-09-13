# loc CLI

## Install

```sh
cargo install loc
```

## Version

- Latest: `0.5.0` (crates.io, verified 2026-09-13) — last release 2018; tool is dormant/stable
- Repository: https://github.com/cgag/loc
- Docs: https://github.com/cgag/loc

## Commands

| commands | description | default | options |
|---|---|---|---|
| `loc [paths]` | Count lines of code in target directory | respects `.gitignore` | `--files`, `--sort`, `--include`, `--exclude`, `-u`, `-uu` |
| `loc --help` | Show help | — | (none) |

## Options

| Option | Description |
|---|---|
| `--files` | Show stats for each file |
| `--sort <column>` | Sort by `Code`, `Blank`, `Comment`, `Lines`, `Files` |
| `--include <regex>` | Include matching files (Rust regex; multiple flags = OR) |
| `--exclude <regex>` | Exclude matching files (multiple flags = OR) |
| `-u` | Ignore `.gitignore` |
| `-uu` | Ignore `.gitignore` and include hidden files |

## Examples

```sh
loc
loc src/
loc --files --sort Code
loc --include 'count' --exclude 'sh'
```
