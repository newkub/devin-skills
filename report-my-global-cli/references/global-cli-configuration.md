# Configuration Reference

## Common Configuration Locations

Most tools follow XDG convention for configuration:
- Global: `~/.config/<tool>/`
- User-specific: `~/.<tool>rc` or `~/.config/<tool>/config.toml`

## Tool-Specific Configuration

### eza (`.config/eza.toml`)

```toml
# eza configuration
icons = true
git = true
header = true
long = true
tree = { depth = 3 }
```

### starship (`.config/starship.toml`)

```toml
# starship configuration
format = """
$directory$git_branch$git_status$nodejs$rust$python$cmd_duration$line_break$character"""

[character]
success_symbol = "[➜](bold green)"
error_symbol = "[✗](bold red)"

[directory]
truncation_length = 3
truncate_to_repo = true
```

### zoxide (via shell integration)

```bash
# Add to shell config
eval "$(zoxide init powershell)"
eval "$(zoxide init bash)"
eval "$(zoxide init zsh)"
```

### gh (`.config/gh/config.yml`)

```yaml
# GitHub CLI configuration
git_protocol: https
editor: vim
prompt: enabled
```

### fzf (`.config/fzf/fzf.env`)

```bash
# FZF_DEFAULT_COMMAND
export FZF_DEFAULT_COMMAND='fd --type f'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_DEFAULT_OPTS='--height 40% --layout=reverse --border'
```

### dprint (`.dprintrc.json`)

```json
{
  "json": {
    "singleQuote": false
  },
  "toml": {
    "sectionBraceStyle": "SameLine"
  },
  "excludes": ["**/*.min.js"],
  "includes": ["**/*.{ts,tsx,js,jsx,json,md}"]
}
```

### mise (`.mise.toml` or `mise.toml`)

```toml
# mise configuration
[tools]
node = ["20.0.0"]
python = ["3.12.0"]
rust = ["stable"]

[settings]
always_keep_download = true
only_known = false
```

### bottom (`.config/bmtop/config.toml`)

```toml
# bottom configuration
theme = "dracula"
default_widget = "cpu"
tree_symbol = "├ "
expand_behavior = "ClickMode"
```

### fastfetch (`.config/fastfetch/config.jsonc`)

```json
{
  "logo": {
    "source": "auto"
  },
  "modules": [
    "title", "break", "os", "host",
    "kernel", "uptime", "packages",
    "shell", "terminal", "cpu", "gpu",
    "memory", "disk", "break",
    "colors"
  ]
}
```

## Environment Variables

| Variable | Tool | Description |
|----------|------|-------------|
| `RUSTC_WRAPPER` | sccache | Enable compiler cache |
| `EDITOR` | gh, helix | Default editor |
| `FZF_DEFAULT_COMMAND` | fzf | Default file finder |
| `FZF_DEFAULT_OPTS` | fzf | Default options |
| `BAT_THEME` | bat | Syntax highlighting theme |
| `RIPGREP_CONFIG_PATH` | ripgrep | Config file location |
| `ZOXIDE_CMD` | zoxide | z command name |

## Shell Integration

### PowerShell

```powershell
# starship
Invoke-Expression (&starship init powershell)

# zoxide
Invoke-Expression (& { (zoxide init powershell | Out-String) })
```

### Bash

```bash
# starship
eval "$(starship init bash)"

# zoxide
eval "$(zoxide init bash)"
```

### Zsh

```zsh
# starship
eval "$(starship init zsh)"

# zoxide
eval "$(zoxide init zsh)"
```
