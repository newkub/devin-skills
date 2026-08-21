# วิธี Migration จาก Version เก่า

## Migration Guides

### Tauri v1 to v2

Tauri v2 เป็น major update ที่มี breaking changes ที่สำคัญ

#### 1. Update Dependencies

**package.json**
```json
{
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-": "^2.0.0"
  }
}
```

**Cargo.toml**
```toml
[dependencies]
tauri = { version = "2.0", features = ["..."] }
```

#### 2. Configuration Changes

**tauri.conf.json v1**
```json
{
  "tauri": {
    "bundle": {
      "identifier": "com.example.app"
    }
  }
}
```

**tauri.conf.json v2**
```json
{
  "productName": "My App",
  "version": "1.0.0",
  "identifier": "com.example.app",
  "build": {
    "beforeDevCommand": "bun run dev",
    "beforeBuildCommand": "bun run build"
  }
}
```

#### 3. API Changes

**v1 API**
```typescript
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'

await appWindow.setTitle('New Title')
```

**v2 API**
```typescript
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()
await window.setTitle('New Title')
```

#### 4. Plugin Migration

Plugins ใน v2 ต้องติดตั้งแยก:

```bash
bun install @tauri-apps/plugin-fs
bun install @tauri-apps-plugin-shell
```

**v1**
```typescript
import { readTextFile } from '@tauri-apps/api/fs'
```

**v2**
```typescript
import { readTextFile } from '@tauri-apps/plugin-fs'
```

#### 5. Allowlist Changes

v2 ใช้ capability-based security แทน allowlist:

**v1**
```json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "all": true
      }
    }
  }
}
```

**v2**
```json
{
  "tauri": {
    "capabilities": [
      "default"
    ]
  }
}
```

Create `capabilities/default.json`:
```json
{
  "identifier": "default",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:allow-read-file",
    "fs:allow-write-file"
  ]
}
```

### Migration Steps

#### Phase 1: Preparation

1. **Backup Project**
   ```bash
   git commit -am "Backup before migration"
   ```

2. **Update Documentation**
   - Read v2 migration guide
   - Review breaking changes
   - Plan plugin replacements

#### Phase 2: Dependency Updates

1. **Update package.json**
   ```bash
   bun install @tauri-apps/api@latest
   bun install @tauri-apps/cli@latest
   ```

2. **Update Cargo.toml**
   ```toml
   [dependencies]
   tauri = { version = "2", features = ["..."] }
   ```

3. **Install Required Plugins**
   ```bash
   bun install @tauri-apps/plugin-fs
   bun install @tauri-apps/plugin-shell
   bun install @tauri-apps/plugin-dialog
   bun install @tauri-apps/plugin-notification
   ```

#### Phase 3: Configuration Migration

1. **Update tauri.conf.json**
   - Restructure configuration
   - Add capability references
   - Update build commands

2. **Create Capability Files**
   - Create `capabilities/` directory
   - Define permissions per capability
   - Reference in tauri.conf.json

#### Phase 4: Code Migration

1. **Update Imports**
   ```typescript
   // v1
   import { invoke } from '@tauri-apps/api/tauri'
   
   // v2
   import { invoke } from '@tauri-apps/api/core'
   ```

2. **Replace Deprecated APIs**
   - Use new window APIs
   - Update event handling
   - Replace plugin calls

3. **Update Rust Code**
   - Update Tauri macros
   - Migrate command definitions
   - Update error handling

#### Phase 5: Testing

1. **Run Development Server**
   ```bash
   bun run tauri dev
   ```

2. **Test All Features**
   - File operations
   - Window management
   - IPC commands
   - Plugin functionality

3. **Build Production**
   ```bash
   bun run tauri build
   ```

#### Phase 6: Deployment

1. **Test Installation**
   - Install on target platforms
   - Verify all features work
   - Check performance

2. **Rollback Plan**
   - Keep v1 build available
   - Document rollback steps
   - Monitor for issues

## Common Migration Issues

### 1. Plugin Not Found

**Error**: `Plugin not found`

**Solution**:
```bash
bun install @tauri-apps/plugin-<name>
```

Update `src-tauri/capabilities/default.json`:
```json
{
  "permissions": [
    "plugin-name:allow-*"
  ]
}
```

### 2. API Changes

**Error**: Function not found

**Solution**: Check v2 API documentation for replacements

### 3. Configuration Errors

**Error**: Invalid configuration

**Solution**: Use `tauri init` to generate new config and merge

## Version-Specific Notes

### v1.5 to v2.0

- Major breaking changes
- New plugin system
- Capability-based security
- Updated build process

### v2.0 to v2.1+

- Minor breaking changes
- New features added
- Performance improvements
- Bug fixes

## Resources

- [Tauri v2 Migration Guide](https://v2.tauri.app/start/migrate)
- [Breaking Changes](https://v2.tauri.app/start/migrate/breaking-changes)
- [Plugin Documentation](https://v2.tauri.app/plugin)
