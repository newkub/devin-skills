# Platform Conventions Checklist — review-mobile

## iOS HIG

- [ ] navigation — tab bar ≤5 items, nav controller back behavior, modals dismissible
- [ ] bars — navigation bar, toolbar, tab bar styling per HIG
- [ ] controls — switches not checkboxes, date pickers native-style, context menus
- [ ] typography — San Francisco or equivalent, Dynamic Type support
- [ ] haptics — `UIImpactFeedback`/`UINotificationFeedback` for confirmations/errors
- [ ] pull-down — dismiss modals, refresh lists where conventional
- [ ] edge cases — Face ID/Touch ID prompts, permission rationale strings

## Android Material

- [ ] navigation — bottom nav ≤5 items, back button hierarchy, drawer for overflow
- [ ] components — FAB, cards, chips, dialogs per Material 3
- [ ] typography — Roboto/system font, type scale consistent
- [ ] elevation/shadows — Material elevation levels, not arbitrary drop shadows
- [ ] motion — meaningful transitions, shared element transitions where apt
- [ ] edge cases — back press handling, notification channels, adaptive icons

## Cross-Platform Consistency

- [ ] platform-appropriate widgets — don't port iOS switches to Android or vice versa
- [ ] navigation models — respect platform's expected pattern, not forced uniformity
- [ ] sharing — native share sheet, not custom UI
- [ ] date/time pickers — platform-native where possible
- [ ] maps — platform maps (Apple Maps / Google Maps) or consistent cross-platform choice

## Permissions

- [ ] requested in context — camera when taking photo, not on app launch
- [ ] rationale shown — explain why before system dialog
- [ ] denied gracefully — app works or explains limitation, doesn't crash
- [ ] settings deep-link — "open settings" for re-granting
- [ ] scoped/minimal — only permissions actually needed
- [ ] permission status checked — don't assume granted, handle all states

## Keyboard And Input

- [ ] keyboard types — `email`, `number`, `phone`, `url` appropriate
- [ ] return key — `done`, `next`, `send`, `search` labeled correctly
- [ ] input accessories — toolbar with prev/next/done for forms
- [ ] autocorrect/autocapitalize — disabled where inappropriate (emails, passwords)
- [ ] secure entry — passwords/PINs masked, autofill integration
- [ ] keyboard avoidance — focused input stays visible above keyboard

## Notifications

- [ ] channels/categories — grouped, user-controllable per type (Android)
- [ ] permission requested — contextually, not on first launch
- [ ] badge management — count accurate, cleared on open
- [ ] deep-link targets — tap → right screen
- [ ] quiet hours — respect Do Not Disturb, no bypass tricks

## Accessibility Integration

- [ ] VoiceOver/TalkBack — all interactive elements labeled
- [ ] focus order — logical traversal, not DOM order
- [ ] semantic grouping — related elements announced together
- [ ] dynamic type — text scales with accessibility settings
- [ ] reduce motion — animations disabled/reduced when set

## Store Compliance

- [ ] privacy labels — data collection declared accurately
- [ ] permission declarations — `Info.plist`/`AndroidManifest` strings
- [ ] age rating — content rating appropriate
- [ ] review guidelines — no prohibited content/patterns
- [ ] export compliance — encryption declaration if applicable

## Detection

- grep navigation components — tab bar, drawer, stack navigators
- grep permission requests — `requestPermission`, `Info.plist` keys, manifest uses-permission
- grep keyboard props — `keyboardType`, `returnKeyType`, `inputAccessoryView`
- platform audit — run on both iOS and Android, compare UX

Severity: permission without rationale = High, wrong navigation pattern = Medium–High, accessibility unlabeled = High, denied-permission crash = Critical
