# CLI Reference

## Common Commands

This file provides an overview of common commands. See individual tool guides for detailed documentation.

## File Operations

### fd (find alternative)

```bash
fd [OPTIONS] [PATTERN] [PATH]
fd -e md -e txt
fd --type f --exec cat
```

### eza (ls alternative)

```bash
eza -la --icons
eza --tree --level 2
eza --git
```

### bat (cat alternative)

```bash
bat file.md
bat --style=numbers --theme=Dracula
bat --diff
```

### yazi (file manager)

```bash
yazi
yazi /path/to/directory
```

## Search

### ripgrep

```bash
rg "pattern"
rg -i "pattern"
rg -g "*.md" "pattern"
rg -C 3 "pattern"
```

### fzf

```bash
fzf
fd | fzf --preview 'bat {}'
history | fzf
```

### sad (search and replace)

```bash
sad 'old' 'new' file.txt
sad 'old' 'new' --regex *.txt
```

### sd (sed alternative)

```bash
sd 'old' 'new' file.txt
sd 'regex' 'replacement' file.txt
```

## System Tools

### bottom

```bash
btm
btm --process-filter "node|python"
btm --default_widget cpu
```

### fastfetch

```bash
fastfetch
fastfetch --config /path/to/config.json
fastfetch list
```

### tokei

```bash
tokei
tokei src/
tokei --sort lines
```

### dua (disk usage)

```bash
dua interactive
dua aggregate
dua disk-usage
```

### duf (disk usage)

```bash
duf
duf /home
duf --only local
```

## Development Tools

### mise

```bash
mise install node@20 python@3.12
mise use node@20
mise ls
mise run build
```

### task

```bash
task build
task test
task lint
task --list
```

### starship

```bash
starship init powershell > $PROFILE
starship config
```

### hyperfine

```bash
hyperfine 'command1' 'command2'
hyperfine --warmup 3 'command'
hyperfine --min-runs 10 'command'
```

### zoxide

```bash
z project-name
zi
zoxide import --from zsh-history
```

### sccache

```bash
RUSTC_WRAPPER=sccache cargo build
sccache --start-server
sccache --show-stats
```

### uv

```bash
uv pip install package
uv pip install -r requirements.txt
uv venv
uv sync
```

## Git Tools

### gh

```bash
gh auth login
gh repo clone user/repo
gh pr create
gh issue list
```

### gitui

```bash
gitui
gitui -d /path/to/repo
```

### lefthook

```bash
lefthook install
lefthook run pre-commit
lefthook run test
```

## Formatters & Editors

### dprint

```bash
dprint fmt
dprint check
dprint config
```

### helix

```bash
hx file.txt
hx --health rust
```

### glow

```bash
glow README.md
glow -p README.md
```

### chezmoi

```bash
chezmoi init
chezmoi add ~/.bashrc
chezmoi apply
chezmoi edit ~/.bashrc
```
