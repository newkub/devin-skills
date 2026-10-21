# alignment

Alias of `code-quality` — naming, pattern, layer, and doc consistency are code-quality findings, so no separate review exists here.

## Run

- resolves to the matrix `correctness` row, which is one of the six `always` rows `/deep-review` adds to every run — nothing is lost by forwarding
- run: `/deep-review <scope> code-quality`; the `improve` scope that reaches this label is `consistency`
- no argument of its own — the caller's `<scope>` is forwarded verbatim
