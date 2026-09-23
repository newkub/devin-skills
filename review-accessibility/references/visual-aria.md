# Visual And Aria Checklist — review-accessibility

## Color Contrast

- [ ] normal text — ≥4.5:1 vs background (WCAG AA)
- [ ] large text (≥18pt/14pt bold) — ≥3:1
- [ ] UI components — ≥3:1 (buttons, inputs, icons, focus indicators)
- [ ] non-text elements — ≥3:1 (charts, graphs, meaningful icons)
- [ ] disabled state — exempt but still distinguishable
- [ ] placeholder text — ≥4.5:1 or treated as hint not label
- [ ] text on images — contrast measured over image area or has scrim

## Color Independence

- [ ] not color-only — status/meaning conveyed by text/icon/pattern too
- [ ] links distinguishable — not just color, underline or other cue
- [ ] error states — not just red, icon/text alternative
- [ ] required fields — not just asterisk color, label or aria
- [ ] charts/graphs — patterns/shapes, not just color series

## Focus And States

- [ ] `:focus-visible` styling — clear indicator, ≥3:1 contrast
- [ ] hover/focus/active states — distinct, not just color change
- [ ] selected/current — `aria-current` + visual indicator
- [ ] expanded/collapsed — `aria-expanded` + icon/text change
- [ ] disabled — visual + programmatic (`disabled`/`aria-disabled`)

## Typography And Readability

- [ ] line height — ≥1.5x font size for body text
- [ ] line length — ≤80 characters (40 for CJK) per line
- [ ] paragraph spacing — ≥1.5x line height between blocks
- [ ] letter spacing — ≥0.12x font size tracking
- [ ] word spacing — ≥0.16x font size
- [ ] text alignment — left-aligned (LTR), not justified (WCAG 1.4.8)

## Zoom And Reflow

- [ ] 200% zoom — content readable, no horizontal scroll (except data tables)
- [ ] 400% zoom — usable, reflows to single column
- [ ] text spacing — override works, no clipping/overlap
- [ ] fixed heights — `overflow` handled, text doesn't clip
- [ ] viewport — `user-scalable=yes` (or omitted), no `maximum-scale=1`

## Visual Layout

- [ ] target size — ≥44×44px touch targets (WCAG 2.5.5)
- [ ] spacing — interactive elements ≥8px apart
- [ ] visual grouping — related items visually associated
- [ ] reading order — visual order matches DOM order
- [ ] overlays — content behind modals/menus not obscured

## Motion And Animation

- [ ] `prefers-reduced-motion` — animations disabled/reduced when set
- [ ] auto-play — pausable/stoppable if >5s duration
- [ ] parallax/scrolling — optional, not default
- [ ] flashing — no content >3 flashes/second (WCAG 2.3.1)
- [ ] vestibular disorders — no extreme motion effects

## Aria Usage

- [ ] ARIA only when needed — semantic HTML preferred
- [ ] valid ARIA — roles/states/properties match ARIA spec
- [ ] `aria-label` — on icon-only buttons, unlabeled elements
- [ ] `aria-labelledby` — preferred over `aria-label` when visible label exists
- [ ] `aria-describedby` — hints, errors, additional context
- [ ] `aria-live` — `polite` for updates, `assertive` for critical, `off` default
- [ ] `aria-hidden` — decorative icons, hidden content, not on focusable
- [ ] `role` — accurate widget type, not `role="button"` on `<a>`
- [ ] required children — `tablist`/`tab`/`tabpanel` structure complete
- [ ] no ARIA on native — `<button>` doesn't need `role="button"`

## Images And Icons

- [ ] alt text — meaningful description, not filename/"image of"
- [ ] decorative — `alt=""` or `aria-hidden="true"`
- [ ] complex images — `longdesc`, `figure`/`figcaption`, or text alternative
- [ ] icon buttons — `aria-label` or visually-hidden text
- [ ] SVG — `role="img"` + `aria-label` or `title`/`desc` elements
- [ ] functional icons — indicate action (print icon = "Print")

## Detection

- contrast analyzer — axe DevTools, WebAIM contrast checker, `contrast-ratio` lib
- grep `aria-*` attributes — invalid roles, missing labels
- manual zoom — 200%, 400% browser zoom test
- reduced motion — OS/browser setting test
- color-blind simulation — grayscale, protanopia/deuteranopia filters

Severity: contrast <3:1 = Critical, <4.5:1 text = High, color-only meaning = High, missing focus indicator = High, invalid ARIA = Medium
