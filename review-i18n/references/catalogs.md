# Catalog Coverage Checklist — review-i18n

## Key Coverage

- [ ] every key in default locale exists in every other locale — diff key sets per file
- [ ] unused keys — keys in catalogs never referenced in code (dead translations)
- [ ] namespacing — keys organized by feature/route, no giant flat file
- [ ] key naming — semantic (`checkout.submit`) not content (`checkout.payNowButton`)
- [ ] duplicate values — same string under different keys (consolidate or intentional?)

## Pluralization

- [ ] ICU MessageFormat plural rules — `one`/`other` minimum, locale-specific categories (`few`, `many`, `zero`)
- [ ] CLDR correctness — Russian `few`/`many`, Arabic `zero`/`two`, Thai singular-only
- [ ] plural values — count variable passed, not string-concatenated
- [ ] ordinal plurals — "1st", "2nd" rules where used

## Interpolation

- [ ] variables consistent across locales — `{name}` exists in all translations of that key
- [ ] typed placeholders — number/date/currency format specifiers match usage
- [ ] HTML in translations — safe markup allowed? escaped correctly?
- [ ] rich text — `<b>`, `<link>` components inside translations handled by framework

## Structure

- [ ] nested vs flat keys — consistent strategy, no mixed `a.b` + `{"a.b": "x"}` collisions
- [ ] default values — `t('key', 'fallback')` used sparingly, not masking missing keys
- [ ] context keys — `_male`/`_female`/`_formal` variants where language needs
- [ ] comments/descriptions — translator context notes where ambiguous

## Locale Inventory

- [ ] declared locales match catalog files — `locales: ['en','th','ja']` ↔ `en.json`, `th.json`, `ja.json`
- [ ] fallback chain — `en-US` → `en` → root default, documented
- [ ] locale-specific overrides — regional variants only where needed (pt-BR vs pt)
- [ ] completion % per locale — report coverage metric

## Detection

- script: diff JSON keys across locale files (missing/extra per locale)
- grep `t(`/`$t(`/`formatMessage` calls vs catalog keys (orphaned refs)
- ICU syntax validation — unbalanced `{}`/`#`/`'` in messages

Severity: missing keys on shipped locale = High, wrong plural rules = Medium, dead keys = Low
