# Migration Playbook

> Cited from `migrate/SKILL.md` `### 1` as `references/migration-playbook.md`. One section per migration type: the risk that actually bites, the stage order, and the exit gate.

## How To Read This

Pick the type that matches step `### 1` of the skill. The stage order is always config → dependencies → code → data → cutover; this file tells you what belongs in each stage for that type, and which step is irreversible.

## Framework To Framework

Example: Nuxt to SvelteKit, Next to SvelteKit, Vue to React.

| Risk | Why it bites |
|------|--------------|
| Routing and data loading model | File-based routes, layouts, and loader/SSR semantics rarely map 1:1 |
| State and form libraries | Tied to the old framework's reactivity; a straight port leaks the old mental model |
| Build and deploy output | SSR, ISR, edge vs node, and asset handling change the deployment contract |
| SEO and redirects | URLs move; missing redirects silently break rankings and inbound links |

Stages:

1. Config and tooling — new bundler config, TS config, lint/format, env loading
2. Dependencies — swap framework packages, replace framework-bound libs
3. Code — mechanical import/API rewrites via rules; routes, layouts, and loaders by hand
4. Data — usually unchanged, but re-verify the fetch/SSR boundary
5. Cutover — URL redirect map, sitemap, canonical, and a side-by-side smoke of key pages

Exit gate: every route reachable, forms and auth working, no old framework import left, redirects verified with real requests.

## Major Version Upgrade

Example: v3 to v4 with breaking changes.

| Risk | Why it bites |
|------|--------------|
| Skipping a stepping-stone | Vendor guides often require an intermediate major; jumping creates unsupported state |
| Silent default changes | A changed default (cache, strictness, resolution) compiles fine and misbehaves at runtime |
| Peer dependency web | One unupgraded plugin pins the whole tree back |

Stages:

1. Config — new keys, removed keys, renamed flags
2. Dependencies — the target package plus every peer that must move with it
3. Code — deprecated API replacements, one rule per removed symbol
4. Data — only if the version changes serialization or schema
5. Cutover — single deploy if there is no long-lived state

Exit gate: build, typecheck, lint, tests green; runtime defaults diffed against the previous release notes; no dependency resolved to an older major through a peer.

## API Deprecation Sweep

Example: a provider removes an endpoint or renames a field.

| Risk | Why it bites |
|------|--------------|
| Partial coverage | One missed call site fails at runtime, not at build time |
| Response shape drift | Field renames and type changes do not always fail loudly |
| Mixed versions | Some call sites migrated, others not, with no way to tell which is which |

Stages:

1. Config — credentials, base URLs, API versions
2. Dependencies — client SDK upgrade
3. Code — every call site via rules plus a ripgrep sweep for string literals
4. Data — backfill of stored responses if the shape changed
5. Cutover — deploy with the old endpoint still reachable for one observation window when possible

Exit gate: zero occurrences of the old symbol or literal outside docs and intentional history; a smoke that exercises each migrated call path.

## Database Or Data Store Migration

Example: Postgres to another engine, ORM switch, schema rewrite.

| Risk | Why it bites |
|------|--------------|
| Irreversible writes | A bad transform destroys source data with no path back |
| Type and collation mismatch | Values load but sort, compare, or round differently |
| Downtime window | Cutover longer than the window turns into an incident |

Stages:

1. Config — connection, pool, TLS, timeouts
2. Dependencies — driver and ORM
3. Code — query layer, migrations, transaction boundaries
4. Data — dump, transform, load, then verify parity with row counts and checksums
5. Cutover — dual-write or backfill → verify → switch reads → keep the old store read-only until proven

Exit gate: restore from backup tested before the first write; parity report on representative tables; application smoke against the new store; old store retained until the observation window closes.

## Runtime Or Platform Port

This is `/port` territory when architecture is preserved; use `/migrate` only when the runtime swap drags a technology change with it.

| Risk | Why it bites |
|------|--------------|
| Native modules | A binary built for the old ABI fails to load, often only at runtime |
| Filesystem and process semantics | Path separators, case sensitivity, permissions, signals |
| Missing platform APIs | Crypto, networking, or timers differ per runtime |

Stages:

1. Config — runtime version, engine flags, CI matrix
2. Dependencies — replace or rebuild native packages
3. Code — shim the platform boundary; keep core untouched
4. Data — file paths, line endings, encodings
5. Cutover — run the full test matrix on both runtimes before retiring the old one

Exit gate: identical test results on both targets; no platform-specific import leaked into core modules; a documented list of intentional behaviour differences.

## Monorepo Or Multi-Package Migration

| Risk | Why it bites |
|------|--------------|
| Partial upgrade | Workspaces on mixed versions pass locally and fail at integration |
| Ordering | A shared package must be published before consumers can move |
| Duplicate dependencies | Two copies of a peer library cause type and runtime conflicts |

Stages:

1. Config — root tooling and task runner
2. Dependencies — leaf packages first, then shared, then apps
3. Code — one workspace per batch, each independently verified
4. Data — usually unchanged
5. Cutover — integration build across the whole graph

Exit gate: one resolved version per peer across the graph (`/check-monorepo` and the package manager's dedupe output), every workspace green, integration build green.

## Cutover Patterns

| Pattern | Use when | Cost |
|---------|----------|------|
| Big bang | Small blast radius, easy rollback | Short window to notice breakage |
| Strangler | Old and new can serve side by side | Routing layer plus dual maintenance |
| Canary | Traffic can be split by percentage | Needs metrics to judge |
| Blue/green | Two full environments exist | Double infrastructure during the window |

## Rollback Checklist

1. The revert command is written down and was tested, not assumed
2. The database restore was exercised on a copy
3. The old service or bundle is still deployable
4. Feature flag or routing switch exists for partial rollback
5. The rollback trigger is quantitative (error rate, latency, failed smoke), not a feeling
