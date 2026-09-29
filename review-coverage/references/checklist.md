# Coverage Checklist — review-coverage

## Surface Definition

- [ ] surface source declared — spec, map, config, routes, or user-provided list
- [ ] `skills` surface — actions/domains from `../check-my-global-cli/references/tool-map.md`, `global_rules.md` intents, skills-map categories
- [ ] `tests` surface — routes/endpoints/public modules via `/review-delivery` or route-file scan
- [ ] `docs` surface — features/public API from `FEATURES.md`, exports, routes
- [ ] custom surface — extracted from user list or spec, normalized to keys
- [ ] large surfaces — scripted extraction (`/use-scripts`) not manual eyeballing

## Coverage Inventory

- [ ] `skills` — `*/SKILL.md` descriptions scanned, `related` checked, `/update-devin-global-skills` for usage signal
- [ ] `tests` — `*.test.*`/`*.spec.*`/`tests/` mapped to surface items; real coverage report read if present
- [ ] `docs` — docs pages, README sections, `docs/` nav mapped to features
- [ ] keys normalized — same key format on both sides (action name / route path / feature id)

## Gap Matrix

- [ ] every surface item classified — `covered`, `partial`, `missing`
- [ ] `partial` criteria — exists but incomplete scope (skill without script, route with smoke test only)
- [ ] orphans detected — coverage items with no surface item (dead feature tests/docs)
- [ ] matrix complete — no surface item left unclassified

## Severity

- [ ] Critical — user-facing/critical-path surface items with zero coverage
- [ ] Warning — partial coverage or missing in non-critical domain
- [ ] Info — orphan coverage, low-value gaps
- [ ] every finding has evidence — surface item + what was searched and not found

## Report

- [ ] `/report` table — No, Surface Item, Status, Coverage, Severity, Recommendation
- [ ] coverage % per category summarized
- [ ] orphan list reported separately, not mixed into gaps
- [ ] routing correct — missing skills → `/idea-new-devin-global-skills`, missing tests → `/update-tests`, missing docs → `/update-docs`, orphans → delete-or-declare review
- [ ] `/suggest-next-action` issued

## Rules

- [ ] surface from declared source only — never guessed
- [ ] review-only — no skill/test/doc created during review
- [ ] coverage % treated as signal, not target — critical-path gaps outrank % drops
- [ ] `/ask-me` used when surface unclear

Severity: critical path uncovered = Critical, non-critical missing = Warning, orphan coverage = Info
