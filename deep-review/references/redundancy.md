# redundancy

Alias of `code-quality` — duplicate logic, dead code, and overlap are code-quality findings, so no separate review exists here.

## Run

- `redundancy` resolves to the `code-quality` row itself — `/deep-review <scope> code-quality` keeps every check the label promised
- the `improve` scopes that reach this label are `code-quality` and `consistency`; both also name `code-quality`, so a batch run does not double-review
- no argument of its own — the caller's `<scope>` is forwarded verbatim
