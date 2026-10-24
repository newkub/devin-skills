---
name: port
description: Make existing software run on another platform without changing its design
argument-hint: "[target-platform | os | runtime]"
related:
  - compat
  - migrate
  - use-astgrep
  - code-search
  - follow-architecture
  - run-check
  - run-verify
  - report-before-after
  - report
  - ship
  - ask-me
---

## Goal

Make the same software run on a different platform or environment with the same behaviour — architecture preserved, platform differences isolated at the boundary, both targets verified

## Scope

Use when the platform, OS, runtime, or device changes and the design should not: a Windows app on Linux, a Node service on Bun or Deno, a browser build on an edge runtime, a desktop build on a mobile shell, an x64 image on arm64.

Not this skill when the technology itself is being replaced and the architecture may change (Nuxt to SvelteKit, database swap) — use `/migrate`; when only the syntax or format changes — use `/convert`; when the existing structure is the problem — use `/refactor`.

| Aspect | Migrate | Port |
|--------|---------|------|
| Meaning | move a system or its data to a new system | adapt code to run in another environment |
| Goal | change technology or infrastructure | make existing software work in the new environment |
| Code change | large or small | usually adjusted for the target platform |
| Architecture | may change | must not change |
| Example | Nuxt to SvelteKit | Windows app to Linux |
| Result | system lives in the new technology | same software runs on the new platform |

The dividing line is intent: if you would accept a different internal design to reach the target, it is a migration. If the design must survive untouched, it is a port.

## Execute

### 1. Confirm The Port And Name The Target
> Goal: the correct skill owns the work and the target is unambiguous

1. State source platform, target platform, and the behaviour that must stay identical
2. Apply the table in `## Scope`; the design is allowed to change → route to `/migrate` and stop
3. Target still vague (which distro, runtime version, arch) → `/ask-me` before any work
4. Record the constraint in one line: architecture preserved, behaviour parity required

### 2. Assess Compatibility First
> Goal: know what breaks before touching code

1. Run `/compat` against the target and read the verdict
2. Verdict `Incompatible` → report the blockers and stop; do not start a port that cannot finish
3. Verdict `Conditional` → carry the conditions into the plan as explicit work items
4. Verdict `Unknown` → resolve the unknown with evidence before proceeding, not with optimism

### 3. Capture Behaviour On The Source Platform
> Goal: parity is measurable, not remembered

1. `/run-check` and `/run-verify` on the source platform; record the exact results
2. Capture the smoke path: the entry points a user or caller actually exercises
3. Record platform-observable behaviour — output, exit codes, file layout, network calls
4. `/report-before-after` for the source baseline; a red baseline is documented before porting

### 4. Inventory Platform-Specific Code
> Goal: the whole adaptation surface is known

1. `/code-search` for the risky categories: filesystem and paths, process and signals, shell calls, native modules, OS APIs, environment detection
2. Search for absolute paths, path separators, case-sensitive filenames, line endings, and hardcoded locale or timezone assumptions
3. List native or prebuilt dependencies; each one is either rebuildable or a blocker
4. Split hits into: mechanical replacement, needs a shim, needs a native alternative, cannot be ported

### 5. Choose The Adaptation Strategy
> Goal: one deliberate mechanism per difference, not scattered conditionals

| Difference | Strategy |
|------------|----------|
| Same API, different name | mechanical rewrite via `/use-astgrep` |
| Missing API with an equivalent | adapter or shim at the platform boundary |
| Different runtime capability | conditional implementation selected at startup |
| Native binary unavailable | swap to a portable implementation or isolate it |
| Platform behaviour that cannot match | document the divergence and get user confirmation |

1. Prefer the smallest mechanism that keeps the core unchanged
2. Prefer a runtime check at one entry point over `if` statements spread through the codebase
3. Anything that needs a behavioural divergence → `/ask-me` with the tradeoff stated

### 6. Keep The Platform Boundary Clean
> Goal: the core stays platform-agnostic

1. Put every platform-specific implementation behind a shared interface, per `/follow-architecture`
2. The core imports the interface, never the concrete platform module
3. Platform selection happens once at the composition root, not inside business logic
4. A shim that starts leaking into unrelated modules is a design smell — stop and restructure

### 7. Rewrite Only The Mechanical Set
> Goal: repetitive changes are automated and reviewable

1. Route rule-based rewrites to `/migrate` (which owns the migration sequence) or `/use-astgrep` (rule mechanics) — this skill does not restate rule authoring
2. Apply one rule at a time, reviewing the diff, per `/migrate` `### 8`
3. Anything that changes behaviour needs a test on both platforms, not a rule
4. Skip generated and vendored files unless the target genuinely requires them

### 8. Verify On Both Platforms
> Goal: parity is proven, not assumed

1. Run the full check and verify set on the target with the same commands as the source
2. Re-run the source platform — a port that breaks the original is not a port
3. Exercise the smoke path on both and compare observable output
4. List every intentional difference with its reason; an undocumented difference is a bug
5. Red on either platform → fix before cutover; do not carry a known failure forward

### 9. Cut Over And Report
> Goal: the target is live and the source path is accounted for

1. Re-run `/compat` — the verdict should now be `Compatible` or `Conditional` with known limits
2. Update CI, packaging, and docs for the new platform; a build matrix is the honest proof
3. Retire the old platform only after the observation window, or keep it intentionally alongside
4. `/report-before-after` for the parity delta and `/report` for the summary, then `/ship`

## Rules

1. Architecture Preserved — the port changes platform-facing code, never the design; a port that needs a redesign is reported and routed to `/migrate`
2. Evidence Before Work — `/compat` runs before the first edit; an `Incompatible` verdict stops the work rather than encouraging a heroic attempt
3. Boundary Isolation — platform code lives behind one interface, selected at the composition root; no `if (isWindows)` inside business logic
4. Behaviour Parity — every intentional difference is listed with a reason and confirmed by the user; silent divergence is a defect
5. Both Platforms Green — source and target must pass the same gates; keeping the source working is part of the definition of done
6. No Duplicated Mechanics — rule authoring and the staged migration sequence belong to `/migrate` and `/use-astgrep`; this skill owns the port plan and the parity proof
7. No Unverified Exit — no completion claim without target check, verify, and smoke output; untested target behaviour is reported as untested

## Expected Outcome

- `/compat` verdict recorded before changes, and re-checked after
- Platform-specific surface inventoried and each item assigned a strategy
- Platform code isolated behind one interface; core untouched
- Mechanical rewrites applied as reviewed batches via `/migrate` or `/use-astgrep`
- Source and target both pass check, verify, and smoke; intentional differences listed
- `/report` table (No. first column) covering differences, strategy, files, and verification on each platform
