# Write References

> Mandatory reference content per prefix. Cited as `update-devin-global-skills` `## Conventions → Write References` — keep the section name stable.

Every skill with dependencies must have `references/` (mandatory, never skip — except `follow-create-*`/`review-*`, which `Directory Structure` defines as a single `SKILL.md` → merge this same content into `SKILL.md` condensed instead) — every dependency gets its own file written from real `/learn-from-web`/`/learn-from-cli`/`/check-types-definition` output (no placeholder/TODO — learning without writing = failed task); after writing → `/check-reference`

## Required Content

- Each file must contain: the real install command, stable version (published ≥7 days — avoid `latest`/`*`/unbounded `>=`), peer deps, config + examples from official docs, source URL, migration steps if breaking changes exist; optional deps → ask before installing

## Per-Prefix Specs

- `follow-lib-*`/`follow-service-*`/`follow-tool-*` → `references/` has only `apis.md` + `cli.md` (only for tools with a real CLI) — no other files; both files are tables only, no prose sections — `apis.md`: metadata table `| key | value |` (package, install cmd, stable version ≥7 days, license, docs/repo URL) + API table `| api | description | signature/example |`; `cli.md`: `| command | description | options |` (+ `| flag | default |` if needed)
- `follow-lib-*`/`follow-tool-*` must have `best-practices/` (flat `.md` per topic — recommended patterns, pitfalls, do/don't, perf notes written from real `/learn-from-web`+`/deep-research`, not placeholders; no version pins — live-check via `/deep-research` at use time) — separate from `references/` because it's guidance, not API/CLI tables; `SKILL.md` must carry exactly one pointer line in `## Scope` (`- References: [apis](references/apis.md) · [cli](references/cli.md) · best-practices/`) — never a second trailing bullet in `## Rules` (measured: 110 skills duplicate `See best-practices/ for recommended patterns and pitfalls`, and `follow-lib-es-toolkit` carries it twice)
- `follow-lang-*` → `references/` has `toolchain.md` (plus one file per live-checked dependency when the language skill genuinely owns it): metadata table `| key | value |` (language, official docs URL, package manager) + tool table `| tool | role | command/install |` — runtime/compiler, package manager, linter, formatter, test runner, build tool; never pin versions (live-check via `/deep-research` at use time)
- `follow-lib-*`/`follow-tool-*` must also have `usecases/` — a sibling of `references/`, never inside it (mandatory for new/updated packages; untouched ones backfill in batches — audit with `/check-skills-structure` column `UseCases`, which reports `0` for them; the reviewer `package-files` check fails on a dead `usecases/`/`best-practices/` link, a use case missing from the `SKILL.md` table, or a use case without title/source quote/`## Pitfalls`/`## Related`, so the backfill stays verifiable)

## Use Cases

- one flat `.md` per application scenario the dependency is genuinely good at (`rest-api-crud.md`, `ci-duplicate-gate.md`, `monorepo-scope.md`) — kebab-case scenario names, never `usecase-1.md`/`example.md`/`misc.md`
- file shape `# Use Case — <Scenario>` → quote line with the goal + official source URL + access date → numbered sections (`## 1.`, `## 2.`) holding the real code/commands → `## Pitfalls` → `## Related` (`references/apis.md`/`cli.md` + the `best-practices/` files + the sibling use cases the recipe actually mentions); written from real `/learn-from-web`/`/learn-from-cli` output — a working install-to-result flow, not restated API docs; no TODO/MOCK/placeholder, no version pins, no `**` bold; after writing run `/check-reference` + `/follow-single-of-source`
- 2-6 files per package as the target (single-task tool → 2, framework-sized lib → 6), each ≤250 lines — a host-sized framework may exceed 6 only when every extra file is a genuinely separate capability area (server engine, desktop component kit), never split one scenario into parts to hit a count; `SKILL.md` seeds them with a `### Use Cases` table (`| Scenario | Use case |`) at the end of `## Execute` or in `## Scope` + the single `## Scope` pointer line; SKILL.md already >235 lines → pointer bullets only

## Other Skills

- Other skills with dependencies (not `follow-lib-*`/`follow-service-*`/`follow-tool-*`/`follow-create-*`/`review-*`) → `references/<dep>.md` per dependency as before — main content as tables per above
