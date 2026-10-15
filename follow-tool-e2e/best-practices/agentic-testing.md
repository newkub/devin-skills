# e2e best practices

## Do

- one goal per `agent.act` — the agent controls the flow inside the goal, we control the order of goals
- use wording the screen actually shows in the goal text; move repeated phrasing across goals into `context`
- always follow `agent.act` with `expect(locator)` — it is the condition that lets the cache record that goal
- `unique()` for values that change every run (email, slug) — the cache can still replay
- judge meaning, not the exact sentence, for model-written text; need exact → a locator assertion
- `{ vision: 'only' }` when judging a screenshot alone; `{ vision: true }` when pixels must be checked as a supplement

## Don't

- don't use `agent.act` for actions with a known exact selector — it wastes a model call
- don't interpolate a password/token into the goal string — use a `Secret` param
- don't rely on direct reads (`textContent()`) for values that need waiting — they do not retry
- don't query multiple matching nodes without `.filter()/.first()/.nth()` — action/read/single-node assertion will fail

## Cost

- deterministic `scan` = free; `act` is cached after verification; `assert`/`waitFor`/`extract` always cost tokens — place few asserts but cover well
- decision model + small text model for bounded actions instead of a full LLM agent when the flow is narrow
