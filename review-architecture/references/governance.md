# Governance Checklist — review-architecture

## Architecture Decision Records

- [ ] ADR directory — `docs/adr/` or `architecture/decisions/` exists
- [ ] ADR format — title, status (proposed/accepted/deprecated), context, decision, consequences
- [ ] coverage — major decisions have ADRs (framework, DB, auth, deployment, patterns)
- [ ] linked — ADRs referenced from code/docs where relevant
- [ ] updated — superseded decisions marked, not deleted

## Dependency Direction

- [ ] layer rules — documented (e.g., `domain` ← `application` ← `infrastructure` ← `presentation`)
- [ ] enforcement — lint rules or CI checks (eslint boundaries, madge, dependency-cruiser)
- [ ] no cycles — circular dependencies detected and flagged
- [ ] inward only — dependencies point inward (domain doesn't know infrastructure)
- [ ] exceptions — documented and justified, not accidental

## Ownership And Boundaries

- [ ] module owners — each package/module has CODEOWNERS or documented owner
- [ ] review boundaries — PRs touching boundaries require owner review
- [ ] API contracts — module boundaries have defined interfaces, not internal leaks
- [ ] change isolation — changes confined to owning module unless contract changes
- [ ] escalation — cross-module changes have review process

## Fitness Functions

- [ ] automated checks — architecture constraints testable in CI
- [ ] no cycles — madge/dependency-cruiser in CI fails on new cycles
- [ ] layer violations — eslint-plugin-boundaries or equivalent blocks wrong imports
- [ ] size limits — max file/module size enforced or alerted
- [ ] complexity limits — cyclomatic complexity thresholds on critical modules
- [ ] public API — only `index.ts`/`mod.rs` exports, deep imports blocked

## Evolution And Migration

- [ ] deprecation path — old patterns marked deprecated, migration guide exists
- [ ] strangler fig — new architecture wraps/migrates incrementally, not big-bang
- [ ] feature flags — architectural changes behind flags for rollback
- [ ] migration tracking — progress of old→new pattern migration tracked
- [ ] sunset criteria — when old pattern can be removed defined

## Documentation

- [ ] architecture overview — high-level diagram (C4, flowchart, module map)
- [ ] component docs — each module has README explaining purpose, boundaries
- [ ] decision rationale — why choices made documented, not just what
- [ ] glossary — domain terms, architectural terms defined
- [ ] onboarding — new dev can understand structure from docs alone

## Technical Debt

- [ ] debt register — architectural debt cataloged, not invisible
- [ ] impact assessment — cost of debt vs cost of fix estimated
- [ ] repayment plan — prioritized, not just "someday"
- [ ] prevention — checks prevent new debt (fitness functions, reviews)

## Compliance And Standards

- [ ] patterns followed — codebase follows declared architecture (clean, layered, hexagonal)
- [ ] exceptions documented — deviations from pattern justified
- [ ] standards — coding standards, naming, file organization consistent
- [ ] audits — periodic architecture review scheduled, findings tracked

## Detection

- `madge --circular` — dependency cycles
- `dependency-cruiser` — layer violations, forbidden imports
- grep `import.*from.*../` — deep imports bypassing public API
- `CODEOWNERS` — file exists, covers critical paths
- `docs/adr/` — ADR files present, format consistent

Severity: circular dependencies in production = Critical, no layer enforcement = High, missing ADRs for major decisions = Medium, no ownership = Low
