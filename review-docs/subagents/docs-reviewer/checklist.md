# Docs Checklist — review-docs

## Structure

- [ ] `docs/` exists at root — missing = Critical
- [ ] required pages present — `index.md`, getting-started, architecture/overview per project type
- [ ] `docs/index.md` TOC complete — links to all major sections
- [ ] directory organization logical — guides/, reference/, tutorials/ or domain grouping
- [ ] no orphan pages — every page reachable from nav/TOC

## Vitepress Config (conditional)

- [ ] `docs/.vitepress/` exists when project uses VitePress — missing = Critical
- [ ] nav complete — all top-level sections linked
- [ ] sidebar complete — all pages reachable, correct order
- [ ] `collapsed` set for long sidebar groups
- [ ] config matches content — no nav/sidebar entries pointing to missing pages
- [ ] search enabled if docs large enough to warrant it

## Frontmatter

- [ ] every `.md` page has frontmatter — `title`, `description`
- [ ] `description` ≤120 chars, meaningful (not restated title)
- [ ] `title` matches H1 or page purpose
- [ ] no broken/empty frontmatter blocks

## Content Quality

- [ ] real data — no placeholders, `TODO`, `lorem ipsum`, example-only content where docs promised
- [ ] commands/APIs/env vars accurate — verified against source or runnable
- [ ] code blocks have language tags, copy-paste runnable
- [ ] no HTML where markdown suffices (except intentional embeds)
- [ ] consistent language per file (not mixed Thai/English randomly)
- [ ] headings hierarchy correct — no skipped levels, single H1

## Links And References

- [ ] internal links resolve — no 404 within docs
- [ ] no workspace duplicates — same content not copied across workspace READMEs
- [ ] cross-references current — links to source files/other docs still valid
- [ ] external links use HTTPS, not dead

## README.md

- [ ] section order per `readme-section-order.md`
- [ ] tables/columns/icon format per `readme-tables-icons.md`
- [ ] content standards per `readme-content-standards.md`
- [ ] usage coverage — every public command/API documented
- [ ] features coverage — every shipped feature mentioned
- [ ] workspace READMEs consistent with root per `readme-workspace-consistency.md`
- [ ] README score ≥70 per `readme-scoring.md`

## Freshness And Drift

- [ ] API docs match implementation — no drift vs OpenAPI/source
- [ ] changelog hygiene — entries complete, format consistent, `Unreleased` section
- [ ] stale sections identified — content describing removed/renamed features flagged
- [ ] onboarding walkthrough works on clean environment

## Scoring And Report

- [ ] score computed per `scoring.md` — weighted average of findings
- [ ] grade assigned — A (90+), B (80+), C (70+), D (60+), F (<60)
- [ ] findings reported via `/report` with severity + evidence + action
- [ ] score <70 → recommend `update-docs` or `update-vitepress-docs`

Severity: missing `docs/` or required pages = Critical, nav/TOC/frontmatter missing or placeholder content = High, collapsed/desc-length/HTML-in-md = Medium, workspace dupes/links = Low
