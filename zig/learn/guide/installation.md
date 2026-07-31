# Installation

## Install Zig

### Windows (Recommended)

#### Direct Download

1. Download from https://ziglang.org/download/
2. Extract to a directory (e.g., `C:\zig`)
3. Add to PATH

```powershell
# System-wide (admin PowerShell)
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\zig",
    "Machine"
)

# User-level (PowerShell)
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\zig",
    "User"
)
```

#### Package Managers

```powershell
# Winget
winget install -e --id zig.zig

# Chocolatey
choco install zig

# Scoop
scoop install zig
```

### macOS

```bash
# Homebrew (recommended)
brew install zig

# MacPorts
sudo port install zig
```

### Linux

```bash
# Ubuntu/Debian
sudo apt install zig

# Arch Linux
sudo pacman -S zig

# Fedora
sudo dnf install zig

# Or use the official binary
curl -L https://ziglang.org/download/0.16.0/zig-linux-x86_64-0.16.0.tar.xz | tar xJ
export PATH=$PATH:~/path/to/zig
```

## Verify Installation

```bash
zig version
zig build --help
```

## Zig Language Server (ZLS)

ZLS provides IDE support for Zig.

### Installation

```bash
# Via package manager
scoop install zls  # Windows Scoop

# Build from source
git clone https://github.com/zigtools/zls.git
cd zls
zig build -Drelease-safe=true
```

### VS Code Setup

1. Install "Zig" extension by Zig Software Foundation
2. Configure ZLS path in settings:

```json
{
    "zig.path": "C:\\zig\\zig.exe",
    "zig.zls.path": "C:\\zig\\zls.exe"
}
```

### Neovim Setup

```lua
-- Using lazy.nvim
{
    "zigtools/zig-tools.nvim",
    requires = { "neovim/nvim-lspconfig" },
    config = function()
        require("lspconfig").zls.setup({})
    end
}
```

### Zed Setup

```json
// ~/.config/zed/settings.json
{
    "language_zig": {
        "zls_path": "/path/to/zls"
    }
}
```

## Zig Init - Create New Project

```bash
mkdir my-project
cd my-project
zig init
```

Output:
```
info: created build.zig
info: created build.zig.zon
info: created src/main.zig
info: see `zig build --help` for a menu of options
```

## Zig Build Commands

```bash
# Run in debug mode
zig build run

# Build release
zig build

# Run tests
zig build test

# Cross-compile
zig build -Dtarget=x86_64-windows-gnu

# Help
zig build --help
zig build run --help
```

## Essential Tools

| Tool | Purpose | Install |
|------|---------|--------|
| zig | Compiler & build tool | Built-in |
| zls | Language Server | External |
| zigmod | Package manager | External |
| zam | Zig archive manager | External |

## Development Workflow

### Project Structure

```
my-project/
├── build.zig              # Build configuration
├── build.zig.zon          # Package manifest (0.11+)
├── src/
│   ├── main.zig           # Entry point
│   └── root.zig           # Library root
├── libs/
│   └── mylib/
│       ├── build.zig.zon
│       └── src/
│           └── mylib.zig
└── test/
    └── main.zig
```

### Recommended Extensions

- VS Code: "Zig" by Zig Software Foundation
- Neovim: zio/zig-tools.nvim + nvim-lspconfig
- Zed: Built-in Zig support