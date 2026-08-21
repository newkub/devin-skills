# Configuration

## Configuration Files

Tauri uses multiple configuration files:

```
src-tauri/
├── tauri.conf.json          # Main configuration
├── tauri.windows.json       # Windows-specific
├── tauri.macos.json         # macOS-specific
├── tauri.linux.json         # Linux-specific
├── tauri.android.json       # Android-specific
├── tauri.ios.json           # iOS-specific
├── Cargo.toml               # Rust dependencies
└── capabilities/            # Permission definitions
```

## tauri.conf.json Structure

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "productName": "MyApp",
  "version": "1.0.0",
  "identifier": "com.myorg.myapp",
  "build": {
    "devUrl": "http://localhost:3000",
    "frontendDist": "../dist",
    "beforeDevCommand": "bun run dev",
    "beforeBuildCommand": "bun run build"
  },
  "app": {
    "windows": [
      {
        "title": "MyApp",
        "width": 800,
        "height": 600,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

## Build Configuration

| Key | Type | Description |
|-----|------|-------------|
| `devUrl` | string | Development server URL |
| `frontendDist` | string | Frontend build output path |
| `beforeDevCommand` | string | Command before `tauri dev` |
| `beforeBuildCommand` | string | Command before `tauri build` |
| `devtools` | boolean | Enable devtools in release |

## App Configuration

### Windows

```json
{
  "app": {
    "windows": [
      {
        "title": "MyApp",
        "width": 800,
        "height": 600,
        "minWidth": 400,
        "minHeight": 300,
        "resizable": true,
        "fullscreen": false,
        "decorations": true,
        "transparent": false,
        "center": true
      }
    ]
  }
}
```

### Security

```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
    }
  }
}
```

## Bundle Configuration

```json
{
  "bundle": {
    "active": true,
    "targets": ["msi", "nsis"],
    "icon": ["icons/icon.ico"],
    "resources": [],
    "copyright": "Copyright 2024",
    "category": "DeveloperTool",
    "shortDescription": "My Tauri App",
    "longDescription": "A Tauri application"
  }
}
```

## Capabilities (v2)

Location: `src-tauri/capabilities/`

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "description": "Main capability",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:default",
    "dialog:default"
  ]
}
```

## Environment Variables

```bash
# .env file
TAURI_DEV_WATCH=true
TAURI_CLI_NO_DEV_SERVER_WAIT=true
```
