# Blame Readiness And Limits

> Source: https://github.com/ctxrs/ctx/blob/main/docs/blame.md (accessed 2026-10-22)

## Readiness

- `ctx status` and `ctx doctor` report health; they do not start an attribution rebuild
- Blame indexing is enabled by default; automatic indexing keeps it current with retained history
- Pending or interrupted work: retry `ctx import --all` or `ctx setup --wait`
- `ctx import --all --no-blame` imports history without waiting for blame completion
- Manual mode: `ctx index`, `ctx index watch`, and `ctx index wait` observe existing work only
- Disable both foreground and background blame in the data root `config.toml` with `[blame] enabled = false`; existing data stays readable with its freshness limits

## What Results Mean

- Proven production, possible attribution, conflicting records, and missing evidence are distinct outcomes — report which one you got
- Pull-request activity, membership, and merge activity are not the same as producing the code
- A session that mentions a commit or PR is not by itself attribution evidence
- Amend, rebase, and cherry-pick relationships are preserved only when tool-call evidence supports them
- Similar patches, timestamps, or git ancestry alone never establish attribution

## Limits

- File results refer to committed code; a dirty working copy can differ from the evaluated commit
- Missing or pruned git objects, moved repositories, and unavailable history reduce what can be proven
- An empty or partial result does not prove no agent worked on the code
- Cursors are bound to a generation and target; a changed HEAD or line range needs a fresh query

## Related

- [cli.md](../references/cli.md)
- [evidence-discipline.md](evidence-discipline.md)
