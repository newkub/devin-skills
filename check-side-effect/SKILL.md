---
name: check-side-effect
description: Detect side effects leaking into pure code and verify the effect boundary
argument-hint: "[scope]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
related:
  - follow-architecture
  - follow-lib-effect-ts
  - refactor
  - deep-review
  - check-code-structure
  - use-astgrep
  - deep-validate
  - report-review
  - dont-over-engineer
  - suggest-next-action
---

## Goal

Find every effect that is hidden inside code claiming to be pure — IO, network, database, clock, randomness, environment, logs, global mutable state — and prove the effect boundary is explicit: pure core, effects injected as ports, executed only at the edge or inside an effect system such as Effect-TS

## Scope

Use when a codebase claims a pure domain/core, when effects must be isolated behind ports/adapters, or when Effect-TS (or another effect system) is present and its contract must hold. Read-only detector: findings carry `file:line`, severity, and a fix route

| Question | Owner |
|---|---|
| Is this layer allowed to perform this effect | this skill (boundary + severity) |
| Where should the port/adapter live | `/follow-architecture` `## Clean Pattern` |
| How to write the effect pipeline, Layer, error channel | `/follow-lib-effect-ts` |
| Split the file that mixed computation and IO | `/check-code-structure`, `/refactor` |
| Full review of the touched area | `/deep-review` |

- Not a security review (secret values, injection) → `/check-correctness`, `/review-issues`
- Not a performance review (unbatched IO cost) → `/deep-review` dimension `performance`
- Effect systems are optional — when the project does not use one, ports + dependency injection are a valid boundary (`/dont-over-engineer`)

## Execute

### 1. Model The Boundary

> Goal: know which directories are pure before judging a call

1. Take `scope` from the argument — path, workspace, or package; unclear → `/ask-me`
2. Read `AGENTS.md`, the package layout, and the architecture skill the project follows (`/follow-architecture`) — record the claimed pattern
3. Classify scope directories as `pure` (domain, core, entities, usecases, model, utils, types), `edge` (adapters, infrastructure, infra, presentation, routes, handlers, workers, cli, main), or `unclassified`
4. No explicit boundary → assume functional core / imperative shell: computation pure, IO at the entry point; state the assumption in the report
5. Record the effect system in use (`effect`, `fp-ts`, `io-ts` style, none) from the manifest

### 2. Scan For Effects

> Goal: collect candidates deterministically, never by eyeballing

1. Prefer `sg run -p '<pattern>' --lang ts <path>` for structural hits; fall back to `rg -n --glob '*.{ts,tsx,js,jsx}'` when `sg` is unavailable
2. Run the `## Effect Patterns` table for the detected language over the `pure` directories first, then `unclassified`; `edge` directories are scanned only to confirm the effect is implemented there
3. Include hidden-effect shapes the API patterns miss: IO in a constructor, IO inside a getter, IO during module init, `async` methods that await external work, module-level mutable caches, fire-and-forget calls (`void promise`, missing `await`)
4. Record every hit as `file:line | token | directory class` — no hit is a finding yet
5. Cannot run the scan (tool unavailable, non-text source) → stop and report the gap instead of guessing

### 3. Classify And Filter

> Goal: keep only effects that actually cross the boundary

1. Open each hit and decide: direct call, injected port, wrapped in `Effect`/`Task`/`IO`, or a type-only reference
2. Drop false positives with the reason: `import type`, comments/strings (verify the line), adapter implementations inside `edge`, test doubles in `tests/`, config declarations, generated code
3. Keep `edge` hits only when the effect bypasses its port (direct SDK import in a route) or is duplicated outside the adapter
4. Flag as `hidden-effect` when the effect is reachable through a plain-looking function: name suggests pure, signature returns data, body performs IO
5. Flag as `leak` when a pure file imports an SDK, ORM client, or another `edge` module

### 4. Audit The Effect-System Contract

> Goal: when Effect-TS is present, check the typed boundary instead of only grepping for IO

Run only when the manifest declares an effect system; skip with `n/a` otherwise:

1. Domain/use-case signatures carry `Effect<A, E, R>` — the `R` channel lists the services the function needs
2. `Effect.runPromise` / `runSync` / `Layer.launch` appear only at the composition root (entry, server bootstrap, worker handler), never inside domain or library code
3. Services are provided through `Context.Tag` + `Layer` at the edge; domain code does not construct adapters (`new Client(...)`)
4. Expected failures use `Effect.fail` (typed `E`), not `throw` inside `Effect.gen`; `throw` remains a defect only for bugs
5. Port interfaces live with the domain, implementations live in `infra`/`adapters` — reversed ownership is a finding
6. No effect system in the manifest → mark all six `n/a`, do not recommend adoption by default

### 5. Judge Severity

> Goal: one severity per finding, from the boundary rule only

| Severity | Condition |
|---|---|
| Critical | Pure layer writes external state (database, filesystem, payment, email, queue) or an effect system is bypassed with nested `run*` — ordering/idempotency can corrupt state |
| High | Pure layer reads IO, environment, clock, randomness, or global mutable state; effect boundary is hidden behind an ordinary function; typed `E` channel absent for a failing effect |
| Medium | Logging/telemetry in pure code; adapter constructed inside a boundary that should inject it; unawaited/fire-and-forget effect in a use case |
| Low | Naming or file placement hides which side of the boundary a unit lives on; duplicated trivial effect wrapper |

- Tests, fixtures, and explicit demos are not findings unless the production path reuses them
- A finding needs the surrounding call path, not only the token: state what external state changes and who triggers it

### 6. Report

> Goal: one chat table, boundary map included

1. Report via `/report-review` (chat, no files): `No. | File:line | Effect | Layer | Evidence | Severity | Recommendation`
2. Boundary summary: pure dirs, edge dirs, unclassified dirs, effect system, pure-file count, findings by severity
3. Verdict per scope: `clean` (no leak), `leaky` (findings), `unclassified` (no boundary declared — name the decision needed)
4. Order by severity — Critical first; include the hidden-effect and effect-system findings in the same table
5. Run `/deep-validate` on the evidence set before reporting; drop or downgrade anything that cannot be proven

### 7. Route Fixes

> Goal: every finding has an owner; this skill never edits

1. Extract port + adapter, or move the call to the composition root → `/refactor` with the boundary rule from `/follow-architecture`
2. Adopt or correct an effect pipeline (`Effect.gen`, `Layer`, error channel, `runPromise` at the edge) → `/follow-lib-effect-ts`
3. File mixing computation and IO, or SRP split needed → `/check-code-structure` then `/refactor`
4. Project lacking an effect system and small enough that ports suffice → state that explicitly; do not push Effect-TS (`/dont-over-engineer`)
5. Re-run the Step 2 patterns on the fixed files only, confirm the hit is gone or now lives in `edge`, then close with `/suggest-next-action`

## Effect Patterns

> Starting set — verify the matched line before reporting; extend with `/use-astgrep` when a project has its own client wrappers

| Effect | TypeScript / JavaScript | Rust |
|---|---|---|
| Filesystem | `node:fs`, `fs/promises`, `Bun.file`, `Bun.write`, `Deno.read*` | `std::fs`, `tokio::fs` |
| Network | `fetch(`, `axios`, `ky(`, `got(`, `undici` | `reqwest`, `hyper`, `tonic` |
| Database / cache | `prisma`, `drizzle`, `kysely`, `pg`, `mysql2`, `redis`, `ioredis` | `sqlx`, `diesel`, `redis` |
| Clock | `Date.now()`, `new Date()`, `performance.now()` | `SystemTime::now`, `Instant::now` |
| Randomness | `Math.random()`, `crypto.randomUUID()`, `crypto.getRandomValues` | `rand::`, `uuid::Uuid::new_v4` |
| Environment | `process.env`, `Bun.env`, `Deno.env.get` | `std::env::var` |
| Logging / telemetry | `console.*`, logger calls, metrics/tracing SDKs | `println!`, `eprintln!`, `tracing::`, `log::` |
| Browser state | `localStorage`, `sessionStorage`, `document`, `window`, cookies | — (frontend only) |
| Timers / scheduling | `setTimeout`, `setInterval`, `setImmediate` | `tokio::time::sleep`, `tokio::spawn` |
| Global mutable state | module-level `let`, mutable singleton, `globalThis` writes | `static mut`, `OnceLock` + mutation, global registry |
| Effect-system leak | `Effect.runPromise`, `Effect.runSync`, `Layer.launch` outside entry | — |

Structural examples:

```bash
sg run -p 'fetch($$$)' --lang ts src/domain
sg run -p 'Date.now()' --lang ts src/domain src/core
sg run -p 'process.env.$KEY' --lang ts src/domain
sg run -p 'Effect.runPromise($$$)' --lang ts src
rg -n --glob '*.{ts,tsx,js,jsx}' --glob '!**/*.test.*' --glob '!**/__tests__/**' \
  -e "from ['\"](node:fs|fs/promises|axios|undici)['\"]" \
  -e 'fetch\(' -e 'Date\.now\(' -e 'Math\.random' -e 'process\.env' src
```

## Rules

### 1. Read-Only Detector

- Never edit code here — every fix routes to an owner skill and is confirmed by the user
- Never restate the architecture or effect-system guides; link to `/follow-architecture` and `/follow-lib-effect-ts`

### 2. Effects Are Not Evil

- Every program performs effects; the defect is an effect that is hidden, unordered, or in the wrong layer
- Judge the boundary, not the token: an effect inside an adapter is expected; the same call inside a pure calculation is a finding

### 3. Evidence Per Line

- Every finding carries `file:line`, the matched token, the layer classification, and the external state that changes
- False positives are listed with their reason; a suspicion without a verified line is not reported

### 4. Determinism Is A Requirement

- Clock, randomness, UUIDs, and environment are effects: pure core must receive them as values/ports so a test can pin them
- Non-deterministic core is High even when it looks harmless, because tests cannot prove behavior

### 5. Proportionate Adoption

- No effect system and no real boundary pressure → ports + injection are enough; do not recommend Effect-TS for a script or single-entry CLI
- Effect-TS present → audit the contract (Step 4); a missing `E`/`R` channel is a finding, a different valid effect system is not

### 6. Hand Off

- Use `/deep-review` if the scope also needs architecture, security, or tests reviewed
- Use `/suggest-next-action` to close the run

## Expected Outcome

- A boundary map (pure, edge, unclassified) plus every effect that leaks into pure code with `file:line` evidence
- One severity per finding from the boundary rule, ordered Critical first, with a named fix route
- Effect-system contract audited when present (`Effect<A, E, R>`, `Layer` at the edge, `run*` only at the root) or marked `n/a`
- Fixes routed to `/refactor`, `/follow-architecture`, `/follow-lib-effect-ts`, or `/check-code-structure`; no file edited here
- Re-scan after fixes proves the effect moved to the edge or disappeared
