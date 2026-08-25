# loc Reference

## Overview

`loc` is a tool for counting lines of code. It is a Rust implementation of `cloc` but more than 100x faster. It is 2-10x faster than `tokei` depending on file count. Uses parallel processing across all CPU cores and byte-level iteration for high speed.

## Install

```sh
# cargo
cargo install loc

# download pre-built binary
# https://github.com/cgag/loc/releases

# Rust/Cargo prerequisite
# https://www.rustup.rs/
```

## Version

- Latest: `0.4.1`
- License: MIT
- Repository: https://github.com/cgag/loc

## CLI Usage

```sh
loc                          # count lines in current directory
loc src/                     # count lines in specific path
loc ci benches               # count lines in multiple paths
loc --files                  # show per-file statistics
loc --files --sort Lines     # sort by total lines
loc --include '\.ts$'        # only TypeScript files
loc --exclude 'sh$'          # exclude shell scripts
loc -u                       # skip .gitignore
loc -uu                      # include hidden files
```

## CLI Flags

| Flag | Description |
|------|-------------|
| `--files` | Show per-file statistics (default: summary by language) |
| `--sort <COLUMN>` | Sort by column: `Code`, `Comment`, `Blank`, `Lines`, `Language`, `Files` (default: `Code`) |
| `--include <REGEX>` | Include only files matching regex (multiple flags = OR logic) |
| `--exclude <REGEX>` | Exclude files matching regex (multiple flags = OR logic) |
| `-u` / `--unrestricted` | Skip `.gitignore` |
| `-uu` | Skip `.gitignore` and include hidden files |
| `[target]...` | Path or file (default: current directory) |

## Sort Columns

- `Code` (default) — sort by code lines
- `Lines` — sort by total lines
- `Comment` — sort by comment lines
- `Blank` — sort by blank lines
- `Language` — sort by language name (only without `--files`)
- `Files` — sort by file count (only without `--files`)

## Output Format

Summary (default):

```text
--------------------------------------------------------------------------------
 Language             Files        Lines        Blank      Comment         Code
--------------------------------------------------------------------------------
 Rust                     4         1172          111           31         1030
 Markdown                 2          249           39            0          210
--------------------------------------------------------------------------------
 Total                    6         1421         150           31         1240
--------------------------------------------------------------------------------
```

Per-file (`--files`):

```text
--------------------------------------------------------------------------------
 Rust                     2         1028           88           29          911
--------------------------------------------------------------------------------
|src/lib.rs                         677           54           19          604
|src/main.rs                        351           34           10          307
```

- Per-file rows start with `|`
- Results sorted descending by selected `--sort` column

## Regex Syntax

Uses Rust regex syntax. Multiple `--include` or `--exclude` flags use OR logic.

```sh
# TypeScript and TSX files only
loc --include '\.ts$' --include '\.tsx$'

# Exclude node_modules and dist
loc --exclude 'node_modules/' --exclude 'dist/'

# Only files in src/ directory
loc --include 'src/'
```

- Escape dots: `\.ts$` not `.ts$`
- `src/` matches any path containing `src/`

## Performance

- 100x faster than `cloc`
- 2-10x faster than `tokei`
- Parallel processing via worker pool across all CPU cores
- Byte-level iteration for speed
- Use `--include`/`--exclude` before counting to reduce scan time

## Example: Counting DragonflyBSD (~9M lines)

- `loc`: 1.09 seconds
- `tokei`: 5.3 seconds
- `cloc`: 1 minute 50 seconds

## Source

- GitHub: https://github.com/cgag/loc
- Releases: https://github.com/cgag/loc/releases
- README: https://github.com/cgag/loc/blob/master/README.md
