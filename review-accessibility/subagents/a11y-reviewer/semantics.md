# Semantics Checklist — review-accessibility

## Landmarks And Structure

- [ ] landmark regions — `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>` present and unique
- [ ] `role` equivalents — `role="banner"`, `navigation`, `main`, `contentinfo` only when HTML insufficient
- [ ] heading hierarchy — `h1`→`h6` logical, no skipped levels for visual size
- [ ] single `h1` per page — main topic, subsequent `h2`+ for sections
- [ ] lists — `<ul>`/`<ol>`/`<dl>` for grouped items, not `<div>` chains

## Interactive Elements

- [ ] semantic tags — `<button>` for actions, `<a>` for navigation, `<input>` for data entry
- [ ] no `div`+click — `<div onClick>` without role/keyboard = violation
- [ ] links vs buttons — navigation uses `<a href>`, actions use `<button>`
- [ ] disabled state — `disabled` attribute or `aria-disabled`, not just visual gray
- [ ] expandable controls — `aria-expanded`, `aria-controls` on toggles

## Forms And Labels

- [ ] `<label for>` or `aria-label`/`aria-labelledby` — every input labeled
- [ ] fieldsets/legends — grouped controls (radio, checkbox) have group label
- [ ] `<select>` — not custom divs without ARIA combobox pattern
- [ ] error association — `aria-describedby` links inputs to error messages

## Tables

- [ ] `<table>` for tabular data — not layout grids
- [ ] `<th>` headers — `scope="col"`/`scope="row"` or `headers`/`id` association
- [ ] caption — `<caption>` or `aria-label` describes table purpose
- [ ] complex tables — `colspan`/`rowspan` announced correctly

## Text And Media

- [ ] alt text — meaningful for content images, `alt=""` for decorative
- [ ] `<figure>`/`<figcaption>` — associated media + description
- [ ] `<blockquote>`/`<q>`/`<cite>` — quoted content marked semantically
- [ ] `<time datetime>` — dates machine-readable
- [ ] `<abbr title>` — abbreviations expanded

## Dynamic Content

- [ ] `aria-live` regions — announcements for dynamic updates (polite vs assertive)
- [ ] `role="status"`/`role="alert"` — status messages announced
- [ ] loading states — `aria-busy`, announced changes
- [ ] hidden content — `aria-hidden` or `hidden` correctly, not both wrong

## Custom Components

- [ ] tabs — `role="tablist"`/`tab`/`tabpanel`, arrow key nav
- [ ] dialogs — `role="dialog"`/`alertdialog`, `aria-modal`, labelled
- [ ] menus — `role="menu"`/`menuitem`, roving tabindex
- [ ] tooltips — `role="tooltip"`, `aria-describedby` trigger

## Detection

- axe rules — `landmark-one-main`, `page-has-heading-one`, `region`, `button-name`, `label`
- grep `<div onClick`, `<span onClick`, missing `<label`, missing `alt`
- DOM audit — landmark coverage, heading tree

Severity: div-button / missing labels = High, missing landmarks/headings = Medium, wrong ARIA = Medium
