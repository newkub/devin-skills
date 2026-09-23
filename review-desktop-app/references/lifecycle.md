# Lifecycle Checklist — review-desktop-app

## Quit And Close Semantics

- [ ] close button — platform convention (macOS: hide/keep running, Windows/Linux: quit)
- [ ] minimize-to-tray — user preference, "X" behavior configurable
- [ ] quit confirmation — unsaved work prompts, not silent data loss
- [ ] Cmd/Ctrl+Q — quits app, Cmd/Ctrl+W closes window (macOS convention)
- [ ] before-quit — cleanup hooks run, resources released
- [ ] force-quit — SIGKILL/task kill recovery, no corrupted state

## Single Instance

- [ ] single-instance lock — second launch focuses existing, doesn't spawn duplicate
- [ ] handoff args — `argv`/deep links passed to running instance
- [ ] intentional multi-instance — if supported, separate profiles/data dirs
- [ ] zombie instances — crashed app doesn't leave lock blocking restart
- [ ] per-workspace instances — project-based apps allow one per project (if designed)

## Startup And Session Restore

- [ ] launch at login — opt-in, OS-native registration (not registry hacks)
- [ ] session restore — windows/tabs from last session restored (user preference)
- [ ] crash recovery — "app quit unexpectedly, restore?" prompt
- [ ] first-run state — sensible defaults, no empty/broken UI
- [ ] headless/systray start — `--background`/`--minimized` flags if supported

## Offline Behavior

- [ ] local-first data — core features work without network
- [ ] sync queue — offline changes queued, synced on reconnect
- [ ] cache strategy — downloaded content available offline where expected
- [ ] offline indicators — UI shows connectivity state
- [ ] conflict resolution — offline edits vs server, merge or prompt

## File Associations And OS Integration

- [ ] file associations — registered for claimed types, icon provided
- [ ] open-with — double-click file opens app correctly
- [ ] recent files — OS jump list/dock recents populated
- [ ] thumbnail/preview — Quick Look (macOS), Explorer preview (Windows)
- [ ] URL schemes — protocol handlers registered and cleaned on uninstall

## Power And Sleep

- [ ] suspend/resume — app survives sleep/wake, connections re-established
- [ ] hibernation — long sleep doesn't corrupt state
- [ ] power assertions — only when needed (presentation, download), not idle
- [ ] battery awareness — reduced background work on battery (if applicable)

## Window Lifecycle

- [ ] window close → quit or minimize — per platform/user setting
- [ ] last window closed — app behavior defined (quit vs keep running)
- [ ] reopen (macOS dock click) — recreates window if none open
- [ ] shutdown order — windows closed cleanly, state saved before exit

## Data Persistence

- [ ] data directories — `appData`/`userData` per OS convention, not app dir
- [ ] config format — documented, versioned, migration path
- [ ] backup/export — user data exportable, not locked in
- [ ] uninstall remnants — data preserved or prompted, not silently deleted

## Detection

- grep lifecycle events — `before-quit`, `will-quit`, `window-all-closed`, `activate`
- grep instance lock — `requestSingleInstanceLock`, `single_instance`
- grep file associations — `fileAssociations`, `CFBundleDocumentTypes`, registry
- test — close/quit/reopen, kill -9 recovery, sleep/wake

Severity: data loss on quit = Critical, no single-instance for singleton app = High, missing session restore = Medium, battery drain = Medium
