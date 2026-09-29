# Lifecycle And Offline Checklist — review-mobile

## Background/Foreground Transitions

- [ ] state preservation — UI state survives backgrounding (scroll, form input, nav stack)
- [ ] state restoration — app returns where user left, not cold-start reset
- [ ] task completion — background tasks finish or suspend cleanly
- [ ] timers/animations — paused on background, resumed correctly
- [ ] audio/video — session handling on interruption (calls, other apps)
- [ ] data sync — resume triggers refresh, stale data marked

## Process Death And Restoration

- [ ] OS kills — low-memory termination handled, state persisted to disk
- [ ] tombstoning — critical state serialized before suspension
- [ ] cold-start resume — deep-link/notification entry restores context
- [ ] form draft preservation — unsaved input not lost on kill

## Connectivity And Offline

- [ ] network detection — online/offline state monitored, UI reflects
- [ ] offline reads — cached data available without network
- [ ] offline writes — queued ops, sync on reconnect (outbox pattern)
- [ ] optimistic updates — UI responds before network confirms
- [ ] conflict resolution — offline edits vs server state merge strategy
- [ ] retry strategy — exponential backoff, not retry storms on flaky networks
- [ ] graceful degradation — features degrade not crash on offline

## Caching Strategy

- [ ] cache policy — what's cached, staleness, invalidation
- [ ] cache size bounds — doesn't grow unbounded on device
- [ ] cache persistence — survives app restart where needed
- [ ] stale-while-revalidate — show cache + fetch fresh
- [ ] image/asset caching — disk cache, not refetch every view

## Deep Links And Entry Points

- [ ] deep links — `myapp://path` routes handled, restore context
- [ ] universal/app links — `https://` links open app, fallback to web
- [ ] push notifications — tap → correct destination, not just app open
- [ ] share targets — receive shared content from other apps
- [ ] widget/extension entry — home screen widget → right screen
- [ ] cold-start vs warm-start — entry point behavior consistent

## Background Execution

- [ ] background tasks — OS-appropriate (BGTaskScheduler, WorkManager, etc.)
- [ ] execution limits — iOS ~30s, Android Doze deferral
- [ ] periodic sync — scheduled refresh, not constant polling
- [ ] geofencing/motion — location triggers battery-efficient
- [ ] push-driven sync — silent push triggers update, not polling

## App State Machine

- [ ] foreground/background/inactive states — transitions mapped correctly
- [ ] interrupt handling — phone call, alarm, Siri interruption
- [ ] multi-window — split-screen, picture-in-picture state
- [ ] external display — content adapts to second screen (if supported)

## Detection

- grep lifecycle handlers — `AppState`, `onPause`, `onResume`, `didEnterBackground`
- grep network monitors — `NetInfo`, `navigator.onLine`, connectivity listeners
- grep cache/queue — AsyncStorage, SQLite, offline queue implementations
- test airplane mode, app switcher kill, background during form fill

Severity: state loss on background = High, no offline handling for core features = High, data loss on kill = Critical
