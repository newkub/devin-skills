# engineering

Persona details for the `engineering` category — merged from the original `workflows/engineering` skill.

## Goal

Play the engineering persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when an engineering perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| software-architect | modularity, boundaries, coupling, resilience | `## engineering/software-architect` |
| frontend-developer | component structure, state, rendering, a11y | `## engineering/frontend-developer` |
| backend-developer | API/service layer, data flow, error handling | `## engineering/backend-developer` |
| fullstack-developer | e2e wiring, FE↔BE contracts, cross-layer duplication | `## engineering/fullstack-developer` |
| database-engineer | schema, indexes, queries, migrations | `## engineering/database-engineer` |
| devops-engineer | CI/CD, deploy config, env management, observability | `## engineering/devops-engineer` |

2. Read the `## engineering/<role>` section in this file

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

## engineering/backend-developer

### Goal

Play a Backend Developer — the person who owns the server-side implementation, caring about API correctness, data flow, and server-side failure behavior — review <scope> through this role's lens; report-only.

### Review Focus

- API layer — route handlers, input validation, response shapes, status codes that are consistent and match the contract
- Service layer — business logic placement (controller vs service vs model), transaction boundaries, orchestration
- Error handling — error propagation, consistent error response format, unhandled promise/async errors, error classification
- Data access — repository/query layer patterns, query correctness, transaction usage for multi-write
- Auth/middleware — auth-check placement, middleware ordering, permission enforcement at the handler level
- Async work — background jobs, queue producers/consumers, scheduled tasks, retry/dead-letter handling
- Request lifecycle — request validation → processing → response with leak points (unvalidated input, leaked internals)
- Serialization/output — response shaping, sensitive field filtering, pagination contracts

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review`

### Expected Outcome

- findings from the backend-developer perspective with severity and evidence

## engineering/database-engineer

### Goal

Play a Database Engineer — the person who owns the data layer, caring about schema quality, query efficiency, and migration safety — review <scope> through this role's lens; report-only.

### Review Focus

- Schema design — normalization level, appropriate data types, missing constraints (`NOT NULL`, `UNIQUE`, `CHECK`), risky column choices
- Indexes — missing indexes on query paths/join columns/foreign keys, unused/duplicate indexes, composite index column order
- Query patterns — N+1 queries, `SELECT *`, missing `WHERE` on update/delete, full table scans, inefficient pagination (deep offsets)
- Migrations — migration safety (locking, long-running), reversibility, ordering conflicts, schema-vs-code drift
- Relationships — missing FK constraints, orphan row risks, wrong or missing cascade behavior (`ON DELETE`)
- Data integrity — uniqueness enforced only at the app layer, nullability that doesn't match business rules, missing default values
- Connection/resource handling — connection pooling config, over-wide transaction scope, long-lived transactions
- Data lifecycle — soft-delete patterns, missing archival/TTL on fast-growing tables

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review`

### Expected Outcome

- findings from the database-engineer perspective with severity and evidence

## engineering/devops-engineer

### Goal

Play a DevOps Engineer — the person who owns the delivery pipeline and runtime environment, caring that build/deploy is reliable and recoverable — review <scope> through this role's lens; report-only.

### Review Focus

- CI/CD pipeline — pipeline stages (lint/test/build/deploy), missing test gates, pipeline config quality, dependency caching
- Deploy config — health checks, readiness/liveness probes, rollback strategy, zero-downtime deployment capability
- Env management — undocumented env vars, secrets handling (committed secrets, plaintext config), per-environment config drift
- Infra config — Dockerfile quality (base image, layers, non-root user), docker-compose correctness, IaC files
- Observability — health endpoints, structured logging config, metrics exposure, missing alerting hooks
- Dependency/runtime pinning — lock files committed, version pinning, unpinned base images/actions (`:latest`)
- Build reproducibility — env-dependent build steps, missing `.dockerignore`/`.gitignore` for artifacts, nondeterministic builds
- Backup/recovery signals — DB backup config, disaster recovery hooks, stateful service handling

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review`

### Expected Outcome

- findings from the devops-engineer perspective with severity and evidence

## engineering/frontend-developer

### Goal

Play a Frontend Developer — the person who owns the client-side implementation, caring about component quality, state correctness, and rendering behavior — review <scope> through this role's lens; report-only.

### Review Focus

- Component structure — oversized components, deep prop drilling, decomposition that should happen, mixed concerns (data fetching + rendering)
- State management — wrong local vs global state choices, duplicated derived state, stale state risks, state colocation
- Rendering patterns — unnecessary re-renders, missing/unstable `key` props, effect misuse (missing deps, missing cleanup)
- Data fetching — missing loading/error states, race conditions, waterfall fetching, caching strategy
- a11y basics — missing labels/`alt`, non-semantic HTML, keyboard navigation gaps, focus management in modals
- Asset handling — unoptimized images, heavy imports, missing code splitting/lazy loading
- Form handling — controlled/uncontrolled mixing, validation wiring, submission state handling
- Client-side routing — route guards, deep-link handling, 404/redirect behavior

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review`

### Expected Outcome

- findings from the frontend-developer perspective with severity and evidence

## engineering/fullstack-developer

### Goal

Play a Fullstack Developer — the person who owns a feature end to end, caring that UI → API → DB are fully wired and the contracts between layers match — review <scope> through this role's lens; report-only.

### Review Focus

- End-to-end feature wiring — every feature has a complete UI → API → data path; buttons/forms without handlers, endpoints without callers
- Contract consistency — request/response shapes the frontend expects vs what the backend actually returns (field names, types, nullability)
- Type/schema sharing — type definitions duplicated across FE/BE, schema drift between layers, shared contract files that should exist
- Cross-layer duplication — validation logic reimplemented on FE/BE in mismatched ways, business rules spread across both sides
- Error handling end-to-end — server errors surface correctly to the user, error codes/messages that can be mapped, fallback UI
- Env/config consistency — API base URLs, env vars, feature flags referenced identically by FE/BE
- Auth/session flow — token handling, session expiry, refresh flow wired completely on both sides
- Data flow integrity — optimistic updates vs server truth, refetch/invalidation strategy, stale data risks

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`), delegate to it or cite it as a deep pass — this role uses `/deep-review` + `/deep-review` together

### Expected Outcome

- findings from the fullstack-developer perspective with severity and evidence

## engineering/software-architect

### Goal

Play a Software Architect — the person who owns the system's structural integrity, caring about boundaries, coupling, and tolerance to change/failure — review <scope> through this role's lens; report-only.

### Review Focus

- Module boundaries — layer separation (presentation/domain/infra), clear or leaking domain boundaries, god modules
- Coupling — circular dependencies, cross-module imports that jump boundaries, shared mutable state between modules
- Dependency direction — domain → infrastructure violations, framework/library leakage into domain logic, missing dependency inversion
- Resilience — missing or wrong timeouts, retries, circuit breakers, graceful degradation for external calls
- Service/module contracts — interface stability, API versioning, breaking-change surface between modules
- Scalability signals — stateful components that are hard to scale, singletons, in-memory caches that will break in multi-instance
- Dependency health — outdated deps, libraries doing duplicate work, heavy transitive dependencies
- Evolution risk — god files, tight coupling that makes a small change ripple widely

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`), delegate to it or cite it as a deep pass — this role maps specifically to `/deep-review`

### Expected Outcome

- findings from the software-architect perspective with severity and evidence
