---
name: compat
description: Check what runs where — per-axis compatibility matrix, read-only
argument-hint: "[target-platform | runtime | version | dependency]"
related:
  - port
  - migrate
  - list-dependencies
  - check-types-definition
  - check-reference
  - check-update
  - deep-research
  - update-version-to-latest
  - report
  - ask-me
---

## Goal

Answer "will this run there?" with a per-axis matrix, a verdict, and cited evidence — without changing anything

## Scope

Use before a port, a migration, a version jump, or a dependency swap, and whenever the question is whether an existing codebase, package, or deployable works on a target platform, runtime, OS, architecture, browser, or dependency version.

This is a read-only detector: it reports pass/fail per axis and never edits, installs, upgrades, or refactors. Fixes route through `/port` (platform adaptation), `/migrate` (technology change), or `/update-version-to-latest` (version jump).

The name `compat` is intentional per user request; the behaviour matches the `check-*` contract — read-only, verdict plus locations, no fixes.

## Execute

### 1. Define The Subject And The Target
> Goal: one sentence that a stranger could verify

1. State what is being checked — this repo, a specific package, a deployable, a lockfile
2. State the target precisely: OS and version, architecture, runtime and version, browser Baseline, or dependency version
3. Target is vague ("Linux", "newer Node") → `/ask-me` for the exact version; a matrix against an undefined target is worthless
4. Check only what the user asked — a full audit is a different request

### 2. Collect Evidence From The Repo
> Goal: facts from manifests, not memory

1. Read the manifest: `package.json` (`engines`, `os`, `cpu`, `type`, exports), `Cargo.toml` (`rust-version`, target features), `go.mod`, `pyproject.toml`
2. Read the lockfile for resolved versions, peer requirements, and optional platform-specific packages
3. Read CI config for the actually tested matrix — what CI proves is a claim; what it never runs is an unknown
4. Read build and runtime config: bundler targets, `tsconfig` target/lib, transpile or polyfill scope, Docker base image
5. Use `/list-dependencies` when the dependency surface is large

### 3. Check The Compatibility Axes
> Goal: no axis is silently skipped

| Axis | What to verify | Typical evidence |
|------|----------------|------------------|
| OS and architecture | Supported `os`/`cpu`, native binaries, arm64 vs x64 | manifest fields, prebuilt artifacts, vendor docs |
| Runtime and engine | Required and maximum version, removed APIs, engine flags | `engines`, release notes, runtime docs |
| Language and toolchain | Compiler/interpreter version, target triples, stdlib features | toolchain files, tsconfig, rust-version |
| Dependencies and peers | Every peer range satisfied by resolved versions; no duplicate copies | lockfile, package manager tree |
| Native modules | Prebuilt or buildable, ABI match, system libraries present | install logs, binding.gyp, release assets |
| Browser and web platform | Baseline support for the APIs used, feature detection vs hard dependency | Baseline status, caniuse, official docs |
| Data and persistence | Driver support, SQL dialect differences, collation, migration path | driver docs, ORM docs |
| Protocol and API | Wire version, auth flow, deprecations, payload shape | API changelog, OpenAPI spec |
| Deployment target | Cold start, memory, timeout, filesystem, environment limits | platform limits page |
| Packaging and distribution | Signing, installer format, container base, update mechanism | packaging docs |

1. Run only the axes that apply; state which ones were skipped and why
2. Each row needs a source — a manifest field, a lockfile line, a doc URL, or a command output — never recollection
3. `/deep-research` the vendor's compatibility page when the answer is not in the repo
4. `/check-types-definition` when the question is whether a specific API exists in the target version
5. `/check-reference` when a row would rest on a README or doc claim rather than a manifest field — verify it first
6. `/check-update` when the target is "latest" — resolve it to an exact released version before the matrix runs

### 4. Classify Each Row
> Goal: one of four verdicts, never a hedge

| Verdict | Meaning |
|---------|---------|
| Compatible | Evidence shows it works as-is |
| Conditional | Works if a named condition is met (a flag, a version floor, a shim) |
| Incompatible | Evidence shows it cannot work |
| Unknown | Not enough evidence; the reason is named |

1. `Unknown` is a valid, useful result — never upgrade it to `Compatible` on intuition
2. A `Conditional` must name the exact condition, not "with some changes"
3. Contradictory evidence → report both sources and mark `Unknown` until resolved

### 5. Build The Matrix
> Goal: the answer fits on one screen

1. Columns: No. / Axis / Required / Current / Verdict / Evidence
2. One row per axis item, not per axis — "native `sharp` on linux-arm64" is a row, "native modules" is a section
3. Keep the evidence column to a short citation: field path, lockfile entry, or URL
4. Any `Incompatible` row goes to the top of the summary, not buried in the table

### 6. Give The Verdict
> Goal: a decision the user can act on

| Overall | When |
|---------|------|
| GO | Every applicable axis is `Compatible` |
| CONDITIONAL | No `Incompatible`, at least one `Conditional`, and each condition is named |
| NO-GO | Any `Incompatible` with no stated workaround |
| INCONCLUSIVE | Any `Unknown` that changes the outcome |

1. State the blocking rows first, then the conditions
2. Estimate the work only when the user asks; never invent effort figures

### 7. Route The Next Step
> Goal: the verdict connects to an action, not a dead end

| Verdict and intent | Route |
|--------------------|-------|
| Adapt to another platform, design unchanged | `/port` |
| Change the technology, design may change | `/migrate` |
| Version bump with breaking changes | `/update-version-to-latest`, then `/migrate` |
| Dependency choice is the question | `/follow-my-techstack` |
| A conditional needs a shim or flag | `/port` `### 5` |

1. Report the route instead of performing it — the user decides whether to proceed
2. Never start `/port` or `/migrate` from inside this skill

### 8. Report
> Goal: the matrix and verdict reach the user intact

1. Show the matrix and verdict in chat with the `No.` column first
2. List what was checked, what was skipped, and what remains `Unknown`
3. `/report` for the durable summary when the result feeds a plan or decision

## Rules

1. Read-Only — never edit, install, upgrade, or run destructive commands; inspecting and running a non-mutating check is the ceiling
2. Evidence Only — every row cites a manifest field, lockfile entry, command output, or official doc URL; no row is filled from memory
3. No Optimistic Defaults — an unverified axis is `Unknown`, never `Compatible`; "probably fine" is not a verdict
4. Named Conditions — a `Conditional` states the exact condition and how it would be verified
5. Precise Target — an undefined target version stops the check; ask instead of assuming
6. Scoped Output — report only the axes the question needs; a full audit is explicitly requested, never implied
7. No Fixing Here — `/port`, `/migrate`, and `/update-version-to-latest` own the work; this skill ends at the verdict and the route

## Expected Outcome

- Subject and target stated in one verifiable sentence
- Per-axis matrix (No. first column) with verdicts and cited evidence
- Overall GO / CONDITIONAL / NO-GO / INCONCLUSIVE, blockers first
- Skipped axes and `Unknown` rows listed with the reason
- Next route named (`/port`, `/migrate`, `/update-version-to-latest`) without being executed
