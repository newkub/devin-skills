# Mobile Accessibility Checklist — review-accessibility

## Touch Targets And Gestures

- [ ] target size — ≥44×44px (iOS) / 48×48dp (Android), WCAG 2.5.5
- [ ] spacing — adjacent targets don't overlap, adequate gap
- [ ] gesture alternatives — swipe/pinch/drag have button/keyboard alternative
- [ ] multi-point gestures — single-pointer alternative (WCAG 2.5.1)
- [ ] motion gestures — shake/tilt have UI alternative (WCAG 2.5.4)

## Zoom And Viewport

- [ ] no `user-scalable=no` — pinch-zoom enabled
- [ ] no `maximum-scale` <2 — allows magnification
- [ ] text resize — OS text scaling respected
- [ ] orientation — portrait AND landscape usable, not locked
- [ ] reflow — content adapts to narrow viewport without horizontal scroll

## Screen Reader On Mobile

- [ ] VoiceOver (iOS) — rotor navigation, elements labeled
- [ ] TalkBack (Android) — explore-by-touch order logical
- [ ] touch exploration — every element reachable/announced
- [ ] actions — custom actions in rotor/context menu
- [ ] focus order — swipe order matches visual order

## Input And Forms

- [ ] keyboard types — `email`/`tel`/`number`/`url` trigger right keyboard
- [ ] input font-size ≥16px — prevents iOS auto-zoom on focus
- [ ] keyboard avoidance — focused input visible above keyboard
- [ ] autofill — `autocomplete` attributes work with password managers
- [ ] dictation — voice input works on labeled fields

## Visual And Reading

- [ ] outdoor contrast — readable in sunlight
- [ ] dark mode — respects OS setting, contrast maintained
- [ ] text truncation — critical text doesn't clip at large text sizes
- [ ] scrolling — content scrollable, no trapped areas
- [ ] fixed elements — headers/footers don't consume readable area

## Platform-Specific

- [ ] iOS — Dynamic Type, Smart Invert, Reduce Motion respected
- [ ] Android — font scale, TalkBack gestures, accessibility menu
- [ ] switch control — external switch devices navigate correctly
- [ ] voice control — "Tap <label>" works on labeled elements

## Detection

- device test — VoiceOver/TalkBack through core flow
- grep `user-scalable`, `maximum-scale`, `touch-action`
- resize text — OS accessibility settings to max, verify layout
- gesture audit — every gesture has alternative

Severity: pinch-zoom disabled = High, touch targets <44px = High, gesture-only actions = High, screen reader unreachable elements = Critical
