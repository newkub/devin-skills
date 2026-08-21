# Installation

## Installation Methods

### Package Manager (Recommended)

```bash
# macOS (Homebrew)
brew install neovim

# Linux (apt)
sudo apt install neovim

# Linux (pacman)
sudo pacman -S neovim

# Windows (scoop)
scoop install neovim
```

### Pre-built Binaries

```bash
# Download from GitHub releases
# https://github.com/neovim/neovim/releases

# Linux
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux64.tar.gz
tar xzf nvim-linux64.tar.gz
./nvim-linux64/bin/nvim
```

### Build from Source

```bash
# Dependencies
# Node.js (for building)
# Python (for remote plugins)

# Clone and build
git clone https://github.com/neovim/neovim.git
cd neovim
make CMAKE_BUILD_TYPE=Release
sudo make install
```

## Verify Installation

```bash
# Check version
nvim --version

# Should show:
# NVIM v0.10.0 or higher
```

## Add to PATH (optional)

```bash
# Linux/macOS - add to ~/.bashrc or ~/.zshrc
export PATH="$PATH:/path/to/nvim"
```

## Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| OS | Linux, macOS, Windows | Linux, macOS, Windows |
| Memory | 100MB | 200MB |
| Terminal | 256 colors | True color |

## Editor Integration

### VS Code Neovim Extension

```json
{
  "vscode-neovim.neovimPath": "/usr/bin/nvim"
}
```

### IntelliJ IdeaVim

```
:set rcplugin Neovim
:NVIM
```

## See Also

- [Configuration](./configuration.md) - Configuration guide
- [Modal Editing](../key-concepts/modal-editing.md) - Learn modes