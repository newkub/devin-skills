# Touch And Layout Checklist — review-mobile

## Touch Targets

- [ ] minimum sizes — ≥44×44pt iOS / ≥48×48dp Android (WCAG 2.5.5: 44×44 CSS px)
- [ ] spacing between targets — adjacent tap areas don't overlap/mis-tap
- [ ] invisible hit areas — icon buttons padded, not just glyph-size
- [ ] edge/corner targets — reachable without extreme thumb stretch
- [ ] dense UIs justified — smaller targets only with deliberate trade-off docs

## Safe Areas And Insets

- [ ] notch/Dynamic Island — content not obscured (iOS `safe-area-inset-*`)
- [ ] home indicator — bottom UI above gesture bar
- [ ] status bar — content doesn't bleed under, or intentional translucency
- [ ] display cutouts — punch-holes, foldables, landscape insets
- [ ] keyboard avoidance — inputs not covered when keyboard opens
- [ ] system bars — immersive mode edge cases, gesture nav overlap

## Gestures

- [ ] no conflicts with system gestures — edge swipes (back), pull-down (notifications), swipe-up (home)
- [ ] custom gestures discoverable — hint/tutorial for non-obvious swipes
- [ ] gesture alternatives — swipe actions have button equivalents
- [ ] multi-touch handling — pinch/zoom on content that warrants it
- [ ] touch slop — drag thresholds don't trigger on sloppy taps
- [ ] scroll hijacking — nested scroll views delegate correctly

## Scrolling And Layout

- [ ] overscroll behavior — bounce/rubber-band per platform convention
- [ ] scroll-to-top — status bar tap on iOS
- [ ] pull-to-refresh — standard pattern, not custom friction
- [ ] lazy content — virtualization for long lists, no DOM dump
- [ ] sticky elements — headers/fabs don't break scroll or safe area
- [ ] orientation — portrait/landscape layout adapts (or locked deliberately)
- [ ] foldables — hinge area, dual-screen spanning states

## Text And Readability

- [ ] minimum text size — body ≥ 11pt/14sp readable without zoom
- [ ] dynamic type / font scaling — respects OS text size preference
- [ ] contrast — outdoor-readable, sunlight test consideration
- [ ] truncation — important text doesn't clip at small widths
- [ ] line length — readable measure on tablets/foldables

## Visual Adaptation

- [ ] dark mode — colors adapt, not just invert
- [ ] high contrast mode — increased contrast variant
- [ ] reduced motion — animations respect accessibility setting
- [ ] zoom — app doesn't break at 200% system zoom
- [ ] RTL — layouts mirror for RTL locales

## Detection

- inspect computed sizes — touch targets below 44px in mobile viewport
- grep `safe-area`, `inset`, `viewport-fit`, `touch-action`, `user-scalable`
- test on device/simulator — gestures, orientation, dynamic type

Severity: unusable touch targets / covered safe-area content = High, system gesture conflicts = High, no keyboard avoidance = Medium
