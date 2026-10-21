# Domain Map

Fix routing table for `deep-review` `### 7. Fix` — every finding is fixed by the route matching its domain. The review side is always `/deep-review <dimension>` (step 3 fan-out); metric domains route to `/optimize <scope>`, convention/behavior domains to the `## Fix` boilerplate in the same step.

**Lookup order (never fuzzy name matching):** (1) the row in this file matching the finding's domain; (2) a `## Dimension-name aliases` entry; (3) the matrix row's `Fix owner` in `references/dimension-matrix.md` — that column exists on every row, so a finding cannot be orphaned; (4) `/ask-me` only when a finding matches none of the above (and then report it as a matrix gap).

| Domain | Fix route |
|--------|-----------|
| seo | `## Fix` — meta, structured data, sitemap, CWV |
| security | `## Fix` — secrets rotation, headers, vuln deps (`/run-audit`) |
| auth | `## Fix` — sessions, tokens, OAuth, MFA; authz/RBAC UI → the `authz` and `frontend` dimension slices |
| api | `## Fix` — contract drift, versioning, errors |
| backend | `## Fix` — services, handlers, data flow |
| frontend | `## Fix` — components, state, rendering, hydration; scoped slices: forms, i18n, a11y |
| data-validation | `## Fix` — schemas, boundary validation |
| database | `## Fix` — migrations, schema + query perf → `/optimize queries` |
| dependencies | `## Fix` — updates (`/update-version-to-latest`, `/run-audit`) |
| bundle+assets+build speed | `/optimize bundle` |
| performance | `/optimize perf` (network → `/optimize network`; startup → `/optimize startup`) |
| memory | `/optimize memory` |
| cost | `/optimize cost` |
| ci/pipeline | `/optimize ci` |
| docker | `/optimize docker` (guided workflow → `follow-create-docker/workflows/optimize-image`) |
| tests | `## Fix` (flaky → `/check-flaky-tests`) + `/update-tests` for writing new tests |
| uxui | `## Fix` — design system/interaction/motion/UX copy + `/watch-browser fix` (browser pass) |
| observability / iac / platform | `## Fix` — metrics, tracing, alerting, infra code |
| accessibility | `## Fix` — WCAG, keyboard, contrast |
| i18n | `## Fix` — catalogs, RTL, formats |
| events | `## Fix` — schemas, ordering, idempotency, DLQ (queue ops same route, per scope-map boundaries) |
| compliance | `## Fix` — consent, retention, PII handling |
| business | `## Fix` — domain logic vs requirements |
| release | `## Fix` — versioning, changelog, publish |
| delivery | `## Fix` — CI/CD, release pipeline |
| stability | `## Fix` — crash/recovery (error paths/UI → error-handling slice; messaging → events slice) |
| error-handling | `## Fix` (sole owner: error paths, retries, recovery, error states, error UI, error boundaries) |
| architecture | `/follow-architecture` (choose + apply pattern; move files/split layers → `/refactor`) |
| migration | `## Fix` — backward compat, data integrity, rollback, cutover |
| quality/types | `## Fix` — complexity, imports |
| usage | `improve-usage-md` → `/update-usage-md` + verify via `/deep-test usage` |

## Dimension-name aliases

The `dimension-matrix.md` row name → the Domain row above it (the matrix names dimensions, this table names domains). A dimension not listed here — including everything the old catch-all `others (...)` row used to hold — routes by its matrix `Fix owner`, which exists on every row. The `review-<label>` names used by the `improve`/`optimize` scope-maps are not here either — each resolves through the matrix `Aliases` column to `references/<label>.md` (see `## Label resolution`).

| Matrix dimension | Domain row |
|------------------|------------|
| `a11y`, `theming-dark-mode` | accessibility |
| `ci-cd` | ci/pipeline |
| `containers` | docker |
| `bundle-size` | bundle+assets+build speed |
| `usage-examples` | usage |
| `code-quality`, `repo-hygiene` | quality/types |
| `observability`, `iac-cloud-config`, `serverless-runtime-constraints` | observability / iac / platform |

## Label resolution

The `improve`/`optimize` scope-maps name review targets as `review-<label>` — each name is answered by one bundle at `references/<label>.md`; read that file for one dimension or run `/deep-review` for a whole-scope pass. The bundle resolves its label by taking **every** `dimension-matrix.md` row whose `Aliases` cell lists it **or whose row name equals it** (a label may map to several dimensions — e.g. `frontend` → `routing-deeplinks`, `rendering-strategy`, `uxui`, `form`), plus the `always` tier. `review-issues` and `review-gaps` are exempt: they hold their own work. A label found on no row is a matrix gap — dispatch the `always` tier plus the closest artifact-match rows and report the gap, never invent a dimension; `scripts/verify-matrix.ts` proves every scope-map label has a bundle.

## Fix boilerplate

> The canonical fix steps — applied to the findings of one run

1. Rank findings by severity — critical first, then fix one at a time with verification immediately after each fix
2. Pick the fix route matching each finding from the lookup order above
3. Every fix preserves existing behavior, passes `/run-check` and `/run-test` if present, then summarizes with `/report-before-after`

Boundaries kept from the scope-maps: events=semantics / queues=ops / realtime=transport; stability=crash-recovery, resilience=patterns, error-handling=paths+UI (error UI owned by `error-handling`); data=integrity chain, data-validation=validation layer.
