# Keyboard And Focus Checklist — review-accessibility

## Tab Order And Visibility

- [ ] all interactive elements reachable via `Tab` — no mouse-only features
- [ ] focus order logical — follows visual/DOM order, no unexpected jumps
- [ ] visible focus indicator — `outline`/`box-shadow` on `:focus-visible`, not removed without replacement
- [ ] focus contrast — indicator ≥3:1 against background
- [ ] skip links — "skip to content" for keyboard users bypassing nav

## Keyboard Operation

- [ ] `Enter`/`Space` activate buttons/links — no `keydown`-only handlers
- [ ] `Escape` closes modals/menus/dropdowns — returns focus to trigger
- [ ] arrow keys navigate composite widgets — menus, tabs, radio groups, listboxes
- [ ] `Home`/`End`/`PageUp`/`PageDown` — lists, tables, sliders
- [ ] `Tab` vs arrow keys — composite widgets use roving tabindex (one tab stop)

## Focus Management

- [ ] modals — focus moves into dialog, trapped inside, returns to trigger on close
- [ ] dynamic content — focus managed on route change, delete, expand
- [ ] focus not lost — deleting focused element moves focus to logical next
- [ ] programmatic focus — `focus()` used for errors/announcements, not `tabindex="-1"` hacks
- [ ] focus within — `:focus-within` for container states, not confused with `:focus`

## Focus Traps And Barriers

- [ ] modal traps — `Tab`/`Shift+Tab` cycle within, can't escape to background
- [ ] keyboard traps — no infinite loops, all elements reachable
- [ ] iframes — content focusable, no trap between host and frame
- [ ] shadow DOM — focus crosses boundaries where expected
- [ ] no `tabindex` > 0 — breaks natural order, use `0` or `-1` only

## Interactive Widgets

- [ ] menus — `Escape` closes, arrow nav, `Home`/`End` support
- [ ] dialogs — `Escape` closes, focus trapped, labelled
- [ ] tabs — arrow key nav, `Home`/`End`, `aria-selected`
- [ ] accordions — `Enter`/`Space` toggle, `aria-expanded`
- [ ] sliders — arrow keys adjust, `PageUp`/`PageDown` large steps
- [ ] comboboxes — typing filters, arrows navigate, `Enter` selects

## Shortcut And Custom Keys

- [ ] documented shortcuts — keyboard shortcuts discoverable (help, `?` key)
- [ ] no conflicts — custom keys don't override browser/AT shortcuts
- [ ] remappable — users can reassign keys
- [ ] no single-character triggers — without modifier, unless scoped to context

## Touch And Pointer Fallback

- [ ] touch equivalent — all keyboard ops have touch alternative
- [ ] pointer cancellation — `click` on release, not `mousedown`/`touchstart` (WCAG 2.5.2)
- [ ] drag alternatives — drag-and-drop has keyboard/pointer alternative
- [ ] hover content — `focus` shows same content as `hover` (tooltips, menus)

## Detection

- manual test — `Tab` through page, `Shift+Tab` back, operate all controls
- grep `tabindex` > 0, `outline: none` without `:focus-visible` replacement
- axe rules — `focus-order-semantics`, `tabindex`, `scrollable-region-focusable`
- keyboard-only session — complete core task without mouse

Severity: keyboard trap / unreachable interactive = Critical, no visible focus = High, modal without trap/return = High, missing skip link = Low
