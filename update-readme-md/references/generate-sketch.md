# Step: Generate Flow Diagram

> Goal: Draw an ANSI flow diagram of the operation for the README

## Execute

1. From `/learn-from-codebase` (deep-analyze), identify the project's main flow — input → process → output or a lifecycle (e.g. `describe → compose → run → result`)
2. Draw it as an ANSI box-drawing flow diagram — use `─`, `│`, `▶`, `▼` to show direction — every line the same length (fixed width, e.g. 60 chars)
3. Place the diagram above Get Started without a heading — use a ` ```text ` codeblock
4. If the flow fails → retry (max 3 → stop/report)

## Rules

- Flow diagram only — show the operation/step sequence/data flow or command pipeline
- Never draw a file structure/tree or UI mockup in this position (file structure belongs only in `Development > Architecture`)
- No ANSI below the logo/badges in the Hero section

## Example

```text
┌──────────────────────────────────────────────────────────┐
│  describe ──▶ compose ──▶ run                            │
│                                                          │
│  task(() => fetchUser(id))                               │
│      │  .map(u => u.name)                                │
│      │  .retry(Cadence.exponential(100))                 │
│      ▼  .timeout(5000)                                   │
│                                                          │
│  .run() ──▶ Result<A, E> ──▶ .match() ──▶ done           │
└──────────────────────────────────────────────────────────┘
```
