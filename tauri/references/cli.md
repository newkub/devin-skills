# Tauri CLI Reference

## Installation

```bash
# Install via Cargo
cargo install tauri-cli

# Or use via bun
bun install --save-dev @tauri-apps/cli
```

## Common Commands

### Project Initialization

| Command | Description |
|---------|-------------|
| `bun run tauri init` | Initialize Tauri project in current directory |
| `cargo tauri init` | Initialize Tauri project via Cargo |

### Development

| Command | Description |
|---------|-------------|
| `bun run tauri dev` | Run Tauri app in development mode |
| `cargo tauri dev` | Run Tauri app in development mode via Cargo |
| `bun run tauri dev -- --release` | Run in release mode (faster) |

### Building

| Command | Description |
|---------|-------------|
| `bun run tauri build` | Build Tauri app for current platform |
| `cargo tauri build` | Build Tauri app via Cargo |
| `bun run tauri build -- --target x86_64-pc-windows-msvc` | Build for specific target |

### Plugin Management

| Command | Description |
|---------|-------------|
| `bun run tauri add <plugin>` | Add Tauri plugin to project |
| `cargo tauri add <plugin>` | Add plugin via Cargo |

### Info

| Command | Description |
|---------|-------------|
| `bun run tauri info` | Display system information and Tauri version |
| `cargo tauri info` | Display system information via Cargo |

### Mobile Development

| Command | Description |
|---------|-------------|
| `bun run tauri android init` | Initialize Android project |
| `bun run tauri android dev` | Run on Android device/emulator |
| `bun run tauri android build` | Build Android APK |
| `bun run tauri ios init` | Initialize iOS project |
| `bun run tauri ios dev` | Run on iOS simulator |
| `bun run tauri ios build` | Build iOS app |

### Icon Management

| Command | Description |
|---------|-------------|
| `bun run tauri icon <path>` | Generate app icons from source image |

### Signer

| Command | Description |
|---------|-------------|
| `bun run tauri signer generate` | Generate key pair for signing |
| `bun run tauri signer sign` | Sign the app bundle |

## CLI Options

### Development Options

```bash
# Specify custom frontend dev server
bun run tauri dev -- --no-watch

# Disable watching for file changes
bun run tauri dev -- --no-watch

# Run with specific features
cargo tauri dev --features custom-feature
```

### Build Options

```bash
# Build without updater
bun run tauri build -- --no-bundle

# Build for specific target
cargo tauri build --target aarch64-apple-darwin

# Build with debug symbols
cargo tauri build --debug
```

## Configuration

The CLI can be configured via `tauri.conf.json` or `tauri.conf.json5`:

```json
{
  "build": {
    "beforeBuildCommand": "bun run build",
    "beforeDevCommand": "bun run dev",
    "devUrl": "http://localhost:3000"
  },
  "tauri": {
    "bundle": {
      "identifier": "com.example.app"
    }
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TAURI_PRIVATE_KEY` | Path to private key for signing |
| `TAURI_KEY_PASSWORD` | Password for private key |
| `TAURI_BUNDLE` | Custom bundle configuration |
| `TAURI_SKIP_TARGET_CHECK` | Skip target compatibility check |

## Examples

### Initialize New Project

```bash
bun create tauri-app@latest
cd my-tauri-app
bun install
bun run tauri dev
```

### Add Plugin

```bash
bun run tauri add fs
bun run tauri add shell
bun run tauri add dialog
```

### Build for Production

```bash
# Build for current platform
bun run tauri build

# Build for specific platform
cargo tauri build --target x86_64-pc-windows-msvc
```

## Troubleshooting

### Common Issues

- **Build fails**: Ensure Rust toolchain is installed and up to date
- **Dev server not starting**: Check `beforeDevCommand` in config
- **Plugin not found**: Run `bun run tauri add <plugin>` to install
- **Permission errors**: Check system permissions for file access

### Debug Mode

```bash
# Enable debug logging
RUST_LOG=debug bun run tauri dev

# Verbose output
cargo tauri dev --verbose
```
