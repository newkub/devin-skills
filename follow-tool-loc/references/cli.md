# loc CLI

## Install

```sh
cargo install loc
```

## Version

- Latest: see https://crates.io/crates/loc
- Repository: https://github.com/cgag/loc
- Docs: https://github.com/cgag/loc

## Commands

| commands | description | default | options |
|---|---|---|---|
| `loc [paths]` | Count lines of code in target directory | respects `.gitignore` | `--files`, `--sort`, `--include`, `--exclude`, `-u, -uu`, `--languages` |
| `loc --help` | Show help | — | (none) |

## Options

| Option | Description |
|---|---|---||---|---|---||
| `--files` | Show stats for each file |
| `--sort <column>` | Sort by `Code`, `Blank`, `Comment`, `Lines`, `Files` |
| `--include <regex>` | Include matching files |
| `--exclude <regex>` | Exclude matching files |
| `-u` | Ignore `.gitignore` |
| `-uu` | Ignore `.gitignore` and include hidden files |
| `--languages` | List supported languages |

## Examples

```sh
loc
loc src/
loc --files --sort Code
loc --include 'count' --exclude 'sh'
```
