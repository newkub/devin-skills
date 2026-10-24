# Implementation queue — what the codebase claims but does not really have

Scope: [repo/workspace scanned] · Source: `git rev-parse --short HEAD` [commit] · Coverage: [share actually verified]
Order: `schema` → `data` → `api` → `ui` → `infra` → `docs`; `No.` is the first column

| No. | Location | Domain | Item | Status | Evidence | Blocking | Effort | Verify |
|---|---|---|---|---|---|---|---|---|
| 1 | `[file:line]` | `[schema/data/api/ui/infra/test/docs]` | `[the promised-but-not-real thing]` | `[missing/fake/partial/unwired/promised]` | `[confirming block or real run result]` | `[item ids that depend on this]` | `[S/M/L]` | `[how it will be proven closed]` |

## Fill Rules

- `Evidence`: a real `file:line` plus the confirming block, or a real run result — never conclude from "probably not done yet"; one item, one status; same root cause merges into one item listing every site
- `Status`: `missing` (no code), `fake` (mock/hardcoded/no-op), `partial` (happy path only), `unwired` (unreachable), `promised` (in docs/spec/plan, absent in code); deliberate test doubles and documented deferred work are not gaps
- `Domain`/`Blocking`/`Effort`/`Verify`: name the critical path so the queue is usable immediately as the work list

## Fix Route

- The queue is the contract with `/implement-to-production` — pass it as-is, never let the implementer re-derive scope
- An item whose surface has no design yet → `/design-cli-prototype`/`/design-tui-prototype`/`/design-web-prototype`/`/design-html-prototype` first
- Suppression hygiene → `/no-use-ignore`; cross-module batches → `/create-plan-in-dot-agents`; re-scan must show zero gaps before the gate
