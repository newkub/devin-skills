# Window And Shell Checklist — review-desktop-app

## Window State

- [ ] size/position persisted — restore across launches, per-monitor DPI aware
- [ ] multi-monitor — reopen on correct screen, off-screen recovery
- [ ] fullscreen/maximized state — restore vs always-normal policy
- [ ] minimum size — usable at smallest dimensions, responsive layout
- [ ] zoom level — per-window or global, persisted
- [ ] always-on-top — optional, user-controlled, not default

## Native Menus And Shortcuts

- [ ] menu bar — File/Edit/View/Window/Help per platform (macOS app menu, Windows accel keys)
- [ ] context menus — right-click native behavior, not custom web-only
- [ ] keyboard shortcuts — Ctrl/Cmd conventions per platform, no conflicts with system
- [ ] shortcut customization — remappable, persisted
- [ ] menu state — enabled/disabled/context-aware items
- [ ] role-based menus — `role: 'copy'`/`'paste'` native handling (Electron)

## System Tray And Notifications

- [ ] tray icon — correct for platform (Windows 16px, macOS template, Linux StatusIcon)
- [ ] tray menu — useful actions, not duplicate window menu
- [ ] tray behavior — click vs right-click conventions (Windows right-click menu, macOS click menu)
- [ ] notifications — native OS notifications, actionable where supported
- [ ] notification permission — requested contextually, not on first launch
- [ ] badge/dock — unread count, progress indication

## Clipboard And Integration

- [ ] clipboard formats — text, HTML, images, files handled correctly
- [ ] clipboard security — sensitive data not left in clipboard
- [ ] drag-and-drop — files in/out of app, external sources handled
- [ ] file dialogs — native open/save, correct filters, remembered directories
- [ ] print support — native print dialog, print stylesheets
- [ ] share targets — Windows share contract, macOS share extension (if applicable)

## Deep Links And Protocol

- [ ] protocol handler — `myapp://` registered, routes correctly
- [ ] link validation — URLs sanitized, no injection via deep links
- [ ] second-instance handoff — deep link to running instance, not new process
- [ ] browser integration — "Open in app" from web works
- [ ] uninstall cleanup — protocol registration removed

## Titlebar And Theme

- [ ] native titlebar — platform look, traffic lights (macOS), system buttons (Windows)
- [ ] custom titlebar — if used, draggable regions, native controls fallback
- [ ] dark mode — follows OS theme, window chrome adapts
- [ ] accent colors — respects system accent color (Windows/macOS)
- [ ] window vibrancy/mica — macOS vibrancy, Windows 11 Mica where appropriate

## Multi-Window Management

- [ ] window types — main, preferences, dialogs, tool windows distinct
- [ ] window lifecycle — parent-child relationships, modal behavior
- [ ] window list — "Window" menu shows all, can activate specific
- [ ] memory — closed windows actually destroyed, not leaked

## Detection

- grep window APIs — `BrowserWindow`, `getCurrentWindow`, `setSize`, `setPosition`
- grep menu/tray — `Menu`, `Tray`, `setContextMenu`, `globalShortcut`
- grep deep links — `setAsDefaultProtocolClient`, `protocol`, `open-url`
- test on all target platforms — window restore, tray, shortcuts

Severity: window state lost every launch = Medium–High, no tray/menu conventions = Medium, protocol not registered = Medium
