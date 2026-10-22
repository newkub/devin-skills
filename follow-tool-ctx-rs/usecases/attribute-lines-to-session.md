# Use Case — Attribute a Line Range to the Agent Session That Produced It

> Answer "which agent session wrote this code, and how sure are we?" with cited evidence instead of a guess. Source: https://www.ctx.rs/docs/blame (accessed 2026-10-22)

## 1. Check blame readiness

```bash
ctx status
ctx blame file src/checkout.ts --lines 118:146
```

If attribution is pending or stale, finish indexing first:

```bash
ctx import --all
ctx setup --wait
```

Then retry the same blame request.

## 2. Ask the smallest question first

```bash
ctx blame file src/checkout.ts --lines 118:146
ctx blame file src/checkout.ts --format json
```

Line range keeps the result bounded. JSON is for scripts and exact fields; default text is for reading and citing.

## 3. Widen to the change when the range is ambiguous

```bash
ctx blame commit <commit-id>
ctx blame pr https://github.com/your-org/your-repo/pull/42
```

Use `--repository` to select a repository and `--limit` to bound complete matches. `--cursor` continues the same query — a cursor is invalidated when the index generation changes.

## 4. Verify the attribution

```bash
ctx show session <ctx-session-id> --mode lite
ctx show event <ctx-event-id> --window 5
```

Read the cited session before repeating the attribution. Blame evidence classes:

| Evidence | Meaning |
|---|---|
| Proven production | The session is directly linked to the committed lines |
| Possible attribution | The session is a candidate; other sessions may share the change |
| Conflict | Multiple sessions plausibly produced the lines |
| Missing evidence | No session evidence covers these lines |

Report the class you got. `possible attribution` is not proof.

## 5. Record the claim

State: file and line range, commit, ctx session ID, evidence class, and any cursor or limit that bounded the query.

## Pitfalls

- Reporting `possible attribution` as certain — say which evidence class the result carries.
- Raising `--limit` and claiming an exhaustive audit — results are bounded by design.
- Reusing a `--cursor` after a reimport — the Core generation changed and the cursor is invalid.
- Confusing PR activity with code production — a session that discussed a PR did not necessarily write its lines.
- Blaming uncommitted edits — blame maps committed code; open work has no commit to attribute.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/blame-readiness.md`
- `best-practices/evidence-discipline.md`
- `usecases/resume-prior-investigation.md`
