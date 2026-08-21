---
title: Deployment
description: Deployment และ distribution สำหรับ Tauri
---

## Package Managers

**Windows**
- MSI installer
- NSIS installer

**macOS**
- DMG
- PKG
- App Store

**Linux**
- DEB
- AppImage
- RPM

## Auto-updates

```typescript
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'

const { shouldUpdate, manifest } = await checkUpdate()
if (shouldUpdate) {
  await installUpdate()
}
```
