# Use Case — Resume Prior Work Without Repeating It

> Recover the decisions, constraints, and failed attempts an earlier agent session already produced, so the new session continues instead of restarting. Source: https://www.ctx.rs/docs/cli-reference (accessed 2026-10-22)

## 1. Confirm the index is usable

```bash
ctx status
ctx sources
```

`ctx status` reports whether the local index is readable. `ctx sources` lists which provider roots exist — a provider that was never imported cannot answer a search.

## 2. Search the task in natural language

```bash
ctx search "checkout tax rounding fix"
```

Lexical BM25 by default. Start broad, then narrow:

```bash
ctx search "tax rounding" --workspace src/checkout --since 2026-09-01
ctx search "tax rounding" --session <ctx-session-id>
ctx search "tax rounding" --content-scope transcript
```

## 3. Broaden before giving up

```bash
ctx search "rounding" --term "tax" --term "invoice" --events
```

Repeated `--term` adds query terms; `--events` returns dense event hits instead of session summaries. Use `--primary-only` to exclude subagent work and `--include-current-session` when the relevant work happened in this same session tree.

Read an existing index without waking a worker:

```bash
ctx search "rounding" --refresh off
```

## 4. Open the evidence

```bash
ctx show event <ctx-event-id> --window 5
ctx show session <ctx-session-id> --mode lite
ctx show session <ctx-session-id> --mode log
```

`lite` is the compact agent-readable transcript; `log` includes tool and command activity when you need the exact commands that were run.

## 5. Write the resume brief

Carry forward, with ctx IDs cited:

- the decision and its stated reason
- constraints and non-goals the earlier session accepted
- attempts that failed and why
- the exact files and commands already touched

Label your own synthesis separately from the quoted evidence.

## Pitfalls

- Treating `ctx search` as a filesystem search — it reads indexed history, not the working tree; use `/code-search` for current files.
- Assuming the index is current — stale usage data returns stale answers; run `ctx import --all` when freshness matters.
- Quoting a search snippet as a decision — open the full event with `ctx show event` before repeating a claim.
- Searching only one provider — `ctx sources` may show several; results differ by provider root.
- Forgetting that direct CLI searches exclude the current session tree — add `--include-current-session` to see this session's own work.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/evidence-discipline.md`
- `best-practices/history-vs-code-search.md`
- `usecases/attribute-lines-to-session.md`
