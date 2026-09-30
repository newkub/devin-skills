# Mobile And Desktop Platform Checks

## Mobile Review

### Capacitor And Native Bridge

1. ตรวจสอบ Capacitor plugin usage, platform detection, และ native bridge patterns
2. ตรวจสอบ plugin compatibility กับ target platform versions
3. ตรวจสอบ native bridge error handling และ fallback behavior

### Offline And Notifications

1. ตรวจสอบ offline support, cache strategy, และ offline data sync
2. ตรวจสอบ push notification handling: permission flow, notification display, action handling
3. ตรวจสอบ biometric auth integration และ fallback

### Mobile UX

1. ตรวจสอบ touch targets: ขนาดต่ำสุด 44x44px, spacing ระหว่าง targets
2. ตรวจสอบ safe area handling: notch, home indicator, status bar
3. ตรวจสอบ responsive layout ข้าม screen sizes และ orientations

### Mobile Severity

- Critical: native bridge พัง, plugin ที่จำเป็นหายไป, app crash บน platform
- High: ไม่มี offline support, push notification พัง, ไม่มี platform detection
- Medium: missing safe area, touch target เล็กเกินไป, inconsistent responsive layout
- Low: minor layout issue, cosmetic improvement

## Desktop Review

### Native APIs And IPC

1. ตรวจสอบ native API usage, IPC patterns, และ security boundaries ระหว่าง main/renderer processes
2. ตรวจสอบ IPC message validation, input sanitization, และ channel whitelisting
3. ตรวจสอบ context isolation, node integration settings, และ sandbox configuration

### Window Management

1. ตรวจสอบ window management, multi-window patterns, และ window state persistence
2. ตรวจสอบ window lifecycle: create, restore, minimize, maximize, close
3. ตรวจสอบ single-instance lock และ second-instance handling

### Auto-Update

1. ตรวจสอบ auto-update mechanism, update signature verification, และ rollback capability
2. ตรวจสอบ update channel configuration แล staged rollout
3. ตรวจสอบ update notification UX และ restart behavior

### File System And Sandbox

1. ตรวจสอบ file system access, path validation, และ sandbox restrictions
2. ตรวจสอบ file dialog integration, drag-and-drop, และ recent files
3. ตรวจสอบ permission model และ user consent flow

### Platform-Specific Code

1. ตรวจสอบ platform-specific code, conditional compilation, และ platform feature detection
2. ตรวจสอบ offline support, local data persistence, และ sync conflict resolution
3. ตรวจสอบ desktop UX: system tray, notifications, keyboard shortcuts, clipboard integration

### Desktop Severity

- Critical: IPC ไม่มี validation, file system access ไม่จำกัด, ไม่มี sandbox, auto-update ไม่ verify
- High: ไม่มี platform-specific handling, native integration พัง, ไม่มี auto-update rollback, ไม่มี offline fallback
- Medium: inconsistent window state, missing keyboard shortcut, suboptimal tray integration
- Low: minor UX polish, cosmetic improvement
