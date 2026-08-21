# CLI Commands

Command-line interface for neovim

## Basic Commands

| Command | Description |
|---------|-------------|
| `nvim` | Open Neovim |
| `nvim file.txt` | Open file |
| `nvim +12 file.txt` | Open file at line 12 |
| `nvim -c "command"` | Execute command on start |
| `nvim --version` | Show version |
| `nvim --help` | Show help |

## Command Options

```bash
# Show help
nvim --help

# Show version
nvim --version

# Start in Ex mode
nvim -e

# Start in improved Ex mode
nvim -E

# Diff mode
nvim -d file1.txt file2.txt

# Read-only mode
nvim -R file.txt

# Clean mode (no plugins)
nvim -u NONE

# Minimal init
nvim --clean
```

## File Operations

```bash
# Open multiple files
nvim file1.txt file2.txt

# Open and go to line
nvim +25 file.txt

# Open and execute command
nvim -c "%s/foo/bar/g" file.txt

# Open and quit
nvim -c "qa" file.txt
```

## Modes

| Option | Description |
|--------|-------------|
| `-e` | Ex mode (line-oriented) |
| `-E` | Improved Ex mode |
| `-s` | Silent mode (no UI) |

## Startup Options

| Option | Description |
|--------|-------------|
| `-c cmd` | Execute command |
| `--cmd cmd` | Execute before config |
| `-i viminfo` | Use custom viminfo |
| `-S session` | Source session file |
| `-u config` | Use custom init |
| `-w script` | Record keys to script |
| `-W script` | Append to script |

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | Error |

## Examples

```bash
# Open current file
nvim .

# Open with line number
nvim +10 main.ts

# Diff two files
nvim -d config.ts config.old.ts

# Silent replace
nvim -es -c '%s/old/new/g' -c 'wq' file.txt

# No plugins
nvim -u NONE

# Minimal setup
nvim --clean
```
