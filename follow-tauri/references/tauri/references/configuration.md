# Configuration Reference

## tauri.conf.json

### Top-level Keys

| Key | Type | Description |
|-----|------|-------------|
| `$schema` | string | JSON schema path |
| `productName` | string | Application name |
| `version` | string | Version string |
| `identifier` | string | Bundle identifier (e.g., `com.example.app`) |
| `build` | object | Build configuration |
| `app` | object | App configuration |
| `bundle` | object | Bundle configuration |
| `plugins` | object | Plugin configurations |

### Build Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `devUrl` | string | - | Development server URL |
| `frontendDist` | string | - | Frontend build output path |
| `beforeDevCommand` | string | - | Command before `tauri dev` |
| `beforeBuildCommand` | string | - | Command before `tauri build` |
| `devtools` | boolean | false | Enable devtools in release |

### App Configuration

#### Windows

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | - | Window title |
| `width` | number | 800 | Initial width |
| `height` | number | 600 | Initial height |
| `minWidth` | number | - | Minimum width |
| `minHeight` | number | - | Minimum height |
| `resizable` | boolean | true | Allow resize |
| `fullscreen` | boolean | false | Start in fullscreen |
| `decorations` | boolean | true | Show window decorations |
| `transparent` | boolean | false | Transparent background |
| `center` | boolean | true | Center on screen |

#### Security

| Key | Type | Description |
|-----|------|-------------|
| `csp` | string | Content Security Policy |

### Bundle Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `active` | boolean | true | Generate bundles |
| `targets` | string[] | "all" | Bundle targets |
| `icon` | string[] | - | Icon paths |
| `resources` | string[] | - | Embedded resources |
| `copyright` | string | - | Copyright string |
| `category` | string | - | App category |
| `shortDescription` | string | - | Short description |
| `longDescription` | string | - | Long description |
| `windows` | object | - | Windows-specific options |
| `macOS` | object | - | macOS-specific options |
| `linux` | object | - | Linux-specific options |

### Windows Bundle Options

| Key | Type | Description |
|-----|------|-------------|
| `nsis` | object | NSIS installer config |
| `wix` | object | WiX installer config |
| `webviewInstallMode` | object | WebView installation |

### Plugin Configurations

```json
{
  "plugins": {
    "fs": {
      "scope": ["$APPDATA/*", "$DOCUMENT/*"]
    },
    "dialog": {
      "all": true
    },
    "http": {
      "all": true,
      "requestHeaders": true,
      "requestBody": true
    },
    "shell": {
      "all": true,
      "open": true
    },
    "store": {
      "all": true
    }
  }
}
```

### Updater Configuration

```json
{
  "bundle": {
    "publisher": "github",
    "updater": {
      "active": true,
      "endpoints": [
        "https://github.com/user/repo/releases/latest/download/latest.json"
      ],
      "dialog": true,
      "pubkey": "PUBLIC_KEY"
    }
  }
}
```

### macOS Bundle Options

| Key | Type | Description |
|-----|------|-------------|
| `signingIdentity` | string | Code signing identity |
| `entitlements` | string | Path to entitlements file |
| `hardenedRuntime` | boolean | Enable hardened runtime |
| `minimumSystemVersion` | string | Minimum macOS version |

### Linux Bundle Options

| Key | Type | Description |
|-----|------|-------------|
| `deb` | object | Debian package config |
| `appimage` | object | AppImage config |
| `rpm` | object | RPM package config |

### Android Configuration

```json
{
  "bundle": {
    "android": {
      "minSdkVersion": 24,
      "versionCode": 1
    }
  }
}
```

### iOS Configuration

```json
{
  "bundle": {
    "ios": {
      "minimumSystemVersion": "13.0"
    }
  }
}
```

## Cargo.toml

### Dependencies

```toml
[dependencies]
tauri = { version = "2", features = ["devtools"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }

[build-dependencies]
tauri-build = "2"
```

### Feature Flags

| Feature | Description |
|---------|-------------|
| `devtools` | Enable devtools |
| `protocol-asset` | Custom asset protocol |
| `protocol-default` | Default protocol |
| `tray-icon` | System tray support |
| `image-png` | PNG image support |
| `image-ico` | ICO image support |

## Capabilities

Location: `src-tauri/capabilities/`

### Structure

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "description": "Main capability description",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:default",
    "dialog:default"
  ]
}
```

### Built-in Permissions

| Permission | Description |
|------------|-------------|
| `core:default` | Core functionality |
| `core:event:default` | Event system |
| `core:window:default` | Window management |
| `core:window:allow-set-title` | Allow setting title |
| `fs:default` | File system access |
| `fs:allow-read-text-file` | Read text files |
| `fs:allow-write-text-file` | Write text files |
| `dialog:default` | Dialog operations |
| `dialog:allow-open` | Open file dialog |
| `dialog:allow-save` | Save file dialog |
| `shell:default` | Shell operations |
| `http:default` | HTTP requests |

### Platform-specific Config Files

| Platform | File |
|----------|------|
| Windows | `tauri.windows.json` |
| macOS | `tauri.macos.json` |
| Linux | `tauri.linux.json` |
| Android | `tauri.android.json` |
| iOS | `tauri.ios.json` |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TAURI_DEV_WATCH` | Enable file watching |
| `TAURI_CLI_NO_DEV_SERVER_WAIT` | Skip dev server wait |
| `TAURI_CLI_PORT` | Dev server port |