# Formats And Rtl Checklist — review-i18n

## Date And Time

- [ ] `Intl.DateTimeFormat` or framework formatter — no manual `dd/mm/yyyy` string building
- [ ] timezone handling — stored UTC, displayed local; `timeZone` option used
- [ ] relative time — `Intl.RelativeTimeFormat` ("2 hours ago") not hand-rolled
- [ ] calendar systems — Buddhist (th), Japanese imperial, Hijri where relevant
- [ ] date range formatting — `Intl.DateTimeFormat.formatRange` where available
- [ ] duration — `Intl.DurationFormat` or library, not `Math.floor(min/60)` strings

## Numbers And Currency

- [ ] `Intl.NumberFormat` — decimal/grouping separators per locale
- [ ] currency — `style: 'currency'` + `currency` code, symbol placement auto
- [ ] percentages — `style: 'percent'`, fraction digits sensible
- [ ] units — `style: 'unit'` (km, kg) locale-aware
- [ ] compact notation — `notation: 'compact'` for large numbers (1.2M)
- [ ] no manual formatting — `toLocaleString`/`toFixed` with locale arg, not regex commas

## Lists And Text

- [ ] `Intl.ListFormat` — "A, B, and C" conjunction/disjunction per locale
- [ ] `Intl.Segmenter` — grapheme-aware splits for CJK/emoji text
- [ ] `Intl.Collator` — locale-aware sorting not default `sort()`
- [ ] plural-sensitive text — "3 items" uses plural rules not `"item" + (n>1?"s":"")`

## RTL Layout

- [ ] `dir` attribute — `dir="auto"` or explicit `rtl`/`ltr` on container
- [ ] logical CSS properties — `margin-inline-start` not `margin-left`, `inset-inline` not `left`
- [ ] physical props only where intentional — icon positions, absolutely-placed decorative
- [ ] text alignment — `text-align: start` not `left`
- [ ] transforms/animations — slide directions mirrored in RTL
- [ ] icons — directional icons flip (arrows, breadcrumbs); symmetric icons don't
- [ ] flex/grid — usually auto-mirror, verify custom overrides don't break

## Bidirectional Text

- [ ] `unicode-bidi`/`dir` on user content — mixed-direction text handled
- [ ] `<bdi>`/`<bdo>` for isolates — user names in RTL context don't corrupt layout
- [ ] input direction — `dir="auto"` on user text fields
- [ ] ellipsis direction — truncation at correct end
- [ ] numerals — Latin vs Arabic-Indic digits handled by `numberingSystem`

## Fonts And Rendering

- [ ] font stack covers locale scripts — CJK, Thai, Arabic glyph coverage
- [ ] `lang` attribute — on `<html>` and locale-switching containers
- [ ] line-height — tall scripts (Thai, Devanagari) don't clip
- [ ] font loading — webfonts for all needed scripts, `unicode-range` subsetting
- [ ] fallback fonts — missing glyphs don't show tofu boxes

## Detection

- grep manual date/number format — `toFixed`, `toLocaleString` without args, regex commas
- grep physical CSS — `margin-left`, `padding-right`, `left:`, `right:` in RTL-targeted UI
- grep `dir=` attributes, `unicode-bidi`, `<bdi>`
- render test — switch to ar/he/fa and inspect layout

Severity: broken RTL layout = High, wrong currency/number format = Medium, missing lang attr = Medium, font gaps = Low–Medium
