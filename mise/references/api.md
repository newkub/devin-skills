# Programmatic API

## Shell Activation

```bash
# Bash/Zsh
eval "$(mise activate bash)"

# Fish
eval (mise activate fish)

# PowerShell
Invoke-Expression (&mise activate powershell)
```

## Environment Variables

```bash
# Get mise environment for a project
mise env

# Output for eval
eval "$(mise env)"
```

## exec Command

```bash
# Run command with mise environment
mise exec -- node --version

# With specific tool
mise exec -- python script.py
```

## CI Integration

```bash
# Install mise
curl https://mise.run | sh

# Install all tools from .mise.toml
mise install

# Run with specific tools
mise run -- bun test
```

## See Also

- [mise Documentation](https://mise.jdx.dev)
