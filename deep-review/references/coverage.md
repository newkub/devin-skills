# coverage

Alias of `review-test` — `coverage` and `test` resolve to the same `tests` row, so this label carries no review of its own.

## Run

- run `/review-test <scope>` or `/deep-review <scope> tests` — both select the same row, and the delegation adds nothing
- the `improve` scopes that reach this label are `coverage` (gap filling) and `tests`; the act of raising coverage itself stays `/update-tests` + `/deep-test coverage`, as the `improve` scope-map states
- no argument of its own — the caller's `<scope>` is forwarded verbatim
