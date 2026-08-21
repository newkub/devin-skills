# Install Neovim

## Description

ติดตั้ง Neovim บนระบบต่างๆ

## Steps

### Windows

```powershell
# Using winget
winget install Neovim.Neovim

# Using scoop
scoop install neovim

# Using chocolatey
choco install neovim
```

### macOS

```bash
# Using Homebrew
brew install neovim

# Using MacPorts
sudo port install neovim
```

### Linux

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install neovim
```

#### Fedora
```bash
sudo dnf install neovim
```

#### Arch Linux
```bash
sudo pacman -S neovim
```

## Verify Installation

```bash
nvim --version
```

## Configuration

### Create Config Directory

```bash
# Linux/macOS
mkdir -p ~/.config/nvim

# Windows
mkdir %LOCALAPPDATA%\nvim
```

### Create init.lua

```lua
-- init.lua
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
```

## Best Practices

1. **Use Package Manager**: ใช้ package manager สำหรับ installation
2. **Update Regularly**: Update Neovim เป็นประจำ
3. **Backup Config**: Backup configuration files
4. **Version Check**: Check version หลัง installation
