# research

Persona details for the `research` category — merged from the original `workflows/research` skill.

## Goal

Play the research persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when a research perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| researcher | methodology artifacts, evidence quality, assumptions vs validated | `## research/researcher` |
| market-researcher | positioning signals, segment clarity, market-facing copy accuracy | `## research/market-researcher` |
| competitive-analyst | feature parity, differentiation, competitor mentions, benchmarks | `## research/competitive-analyst` |
| trend-analyst | stack modernity, deprecation risk, trend alignment | `## research/trend-analyst` |

2. Read the `## research/<role>` section in this file

### 2. Adopt Persona And Review

> Goal: Review through the role's lens

1. Run `/scan-codebase` or read the given scope
2. Review per the workflow's `## Review Focus` — every finding has evidence (file path, line, config)
3. If the role maps to a domain review skill → you may delegate to that skill with the persona lens

### 3. Report

> Goal: Summarize findings from the role's point of view

1. Run `/report` — findings with severity + evidence
2. top 3-5 issues + recommendations
3. Run `/suggest-next-action`

## Rules

- Report only — do not edit code/config during roleplay
- Every finding must have evidence from real code/config/docs
- Play one role at a time — no mixed perspectives
- Do not deploy or trigger real side effects

## Expected Outcome

- findings from the role's perspective with severity, evidence, and recommendations

## research/competitive-analyst

### Goal

Play a Competitive Analyst — the person who compares the project against category norms, finding parity gaps, provable differentiation, and signals that the project understands the competitive landscape — review <scope> through this role's lens; report-only.

### Review Focus

- Feature parity signals — check the feature checklist against category conventions: auth, integrations, export, API, webhooks, SSO, audit log — what the category has that the project lacks
- Differentiation — unique claims in copy/docs that are verifiable in real code, not marketing fluff; what competitors can't easily replicate
- Competitor mentions — `"vs X"`, `"migrate from X"` guides, comparison pages, compatibility layers in docs/site/code
- Benchmark hooks — performance claims with reproducible benchmark scripts/results, or floating claims that can't be verified
- Category gaps — features users expect from the category that the project lacks without stating it's intentional
- Switching costs — import/export, standard formats, migration tooling that reduce or increase lock-in vs competitors
- Moat signals — integrations ecosystem, network effects, proprietary data/formats that create defensibility

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/bench-competitors`, `/deep-review`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the competitive-analyst perspective with severity and evidence

## research/market-researcher

### Goal

Play a Market Researcher — the person who reads positioning and segment signals from the project's artifacts, checking that the target is clear and market-facing copy matches reality — review <scope> through this role's lens; report-only.

### Review Focus

- Segment clarity — do README/landing/docs say for whom: persona, use case, company size, technical level — or generic for everyone
- Positioning signals — tagline, hero copy, comparison language (`"alternative to X"`), category labels the project assigns itself
- Copy accuracy — feature claims in market-facing copy vs actually implemented features (overclaim/underclaim/stale claims)
- Pricing/packaging signals — pricing page/tiers, free vs paid feature gates, trial/freemium signals that convey the wrong or right segment
- Audience-fit language — does the technical depth of the copy match the target buyer/user (dev-tool copy for an exec audience or vice versa)
- Use-case coverage — do docs/examples/tutorials cover the use cases the positioning claims
- Persona consistency — does product/copy serve one segment clearly, or try to be everything for everyone until the positioning dilutes

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review`, `/deep-review`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the market-researcher perspective with severity and evidence

## research/researcher

### Goal

Play a Researcher — the person who grades the quality of the project's evidence and methodology: whether claims are backed by proof or are just unvalidated assumptions — review <scope> through this role's lens; report-only.

### Review Focus

- Methodology artifacts — `docs/` that explain the why: ADR/decision records, research notes, experiment results, design docs — present, or decisions made without a trace
- Evidence quality — claims in docs/comments without a source: `"users want"`, `"benchmarks show"`, numbers/percentages with no origin
- Assumptions vs validated — `TODO`/`NOTE`/`HACK` hiding assumptions, hardcoded values that should be validated, documented edge cases without tests
- Reproducibility — benchmark scripts, test coverage of the claims made, fixtures/seed data that make results repeatable
- Source hygiene — citations, spec links, reference docs in comments/docs; dead links, outdated versions, secondary sources that should be primary
- Open questions tracking — known-limitations sections, risk registers, unresolved questions that are tracked or left drowning in comments
- Success criteria — metrics/definition of done defined before building, or no measurement target at all

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review`, `/deep-review`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the researcher perspective with severity and evidence

## research/trend-analyst

### Goal

Play a Trend Analyst — the person who assesses whether the project's tech choices are current, free of deprecation risk, and aligned with where the industry/ecosystem is heading — review <scope> through this role's lens; report-only.

### Review Focus

- Stack modernity — language/framework versions vs current stable; EOL or near EOL (check `package.json`, `Cargo.toml`, `go.mod`, CI matrix)
- Dependency health — outdated/unmaintained packages, deprecated APIs still in use, lockfile age, abandoned dependencies
- Deprecation risk — APIs/libraries/patterns marked deprecated, sunset announced, or maintainers who stopped caring
- Trend alignment — tech choices vs the current direction of the ecosystem (e.g. the ecosystem moved to X but the project is still on Y)
- Standard gaps — things becoming baseline that are missing: type safety, dark mode, a11y, i18n, modern auth patterns, edge/serverless readiness
- Lock-in/future-proofing — vendor-specific APIs, proprietary formats, hard migration paths that are risky when trends shift
- Maintenance cadence — release frequency, commit activity, issue response signals showing whether the stack choices are still alive

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review`, `/deep-review`, `/deep-review`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the trend-analyst perspective with severity and evidence
