# Installation

## Prerequisites

| Tool | Version | Description |
|------|---------|-------------|
| **Node.js** | >= 18 | JavaScript runtime |
| **Rust** | >= 1.57 | Rust toolchain |
| **Cargo** | Latest | Rust package manager |

## Install Tauri CLI

### Using bun (Recommended)

```bash
bun install --save-dev @tauri-apps/cli@latest
```

### Using yarn

```bash
yarn add -D @tauri-apps/cli@latest
```

### Using bun

```bash
bun add -D @tauri-apps/cli@latest
```

### Using Deno

```bash
deno add -D bun:@tauri-apps/cli@latest
```

### Using Bun

```bash
bun add -D @tauri-apps/cli@latest
```

### Using Cargo (Global Install)

```bash
cargo install tauri-cli --version "^2.0.0" --locked
```

## Install Tauri API

```bash
bun install @tauri-apps/api@latest
```

## Verify Installation

```bash
bun run tauri -- --version
# or
cargo tauri --version
```

## Platform-Specific Setup

### Windows

1. Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)
2. Install [Rust](https://rustup.rs/)
3. Install Node.js from [nodejs.org](https://nodejs.org/)

### macOS

1. Install Xcode Command Line Tools: `xcode-select --install`
2. Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

### Linux

```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf

# Fedora
sudo dnf install gtk3-devel webkit2gtk4.1-devel libappindicator-3-devel librsvg2-devel
```

## Add to package.json Scripts

```json
{
  "scripts": {
    "dev": "command to start frontend dev server",
    "build": "command to build frontend",
    "tauri": "tauri"
  }
}
```

## Rust Toolchain Management

```bash
# Check Rust version
rustc --version

# Update Rust
rustup update

# Set stable as default
rustup default stable
```

## VS Code Extension

```bash
code --install-extension rust-lang.rust-analyzer
code --install-extension vsc-tauri.vscode-tauri
```