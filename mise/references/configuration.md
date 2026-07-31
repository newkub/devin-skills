# Configuration

## Config Files

mise uses several config files:

| File | Scope | Description |
|------|-------|-------------|
| `.mise.toml` | project | Project-level config (recommended) |
| `mise.toml` | project | Alternative project config |
| `.tool-versions` | project | asdf-style legacy file |
| `~/.config/mise/config.toml` | global | Global user config |

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `legacy_version_file` | boolean | `true` | Support `.tool-versions` |
| `plugin_autoload` | boolean | `true` | Auto-load plugins |
| `quiet` | boolean | `false` | Suppress output |
| `ci` | boolean | `false` | CI mode |

## Environment

| Variable | Description |
|----------|-------------|
| `MISEt.toml` | Config file path |
| `MISE_DATA_DIR` | Data directory (`~/.local/share/mise`) |
| `MISE_CONFIG_DIR` | Config directory (`~/.config/mise`) |
| `MISE_CACHE_DIR` | Cache directory |
| `MISE_DEBUG` | Enable debug output |

## See Also

- [mise Documentation](https://mise.jdx.dev)
