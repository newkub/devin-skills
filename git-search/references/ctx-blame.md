# ctx blame

Agent attribution for committed code. `git blame` answers which commit and author; `ctx blame` answers which agent session produced the lines, with an evidence class.

## Commands

| Task | Command | Notes |
|---|---|---|
| Line range | `ctx blame file <path> --lines <start>:<end>` | smallest question first |
| Whole file | `ctx blame file <path>` | larger result |
| Whole commit | `ctx blame commit <sha>` | one change |
| Pull request | `ctx blame pr <url>` | PR activity, not proof of code production |
| Structured output | `ctx blame file <path> --format json` | for scripts and exact fields |
| Select repository | `ctx blame ... --repository <repo>` | multi-repo setups |
| Bound matches | `ctx blame ... --limit <n>` | result is bounded by design |
| Continue a query | `ctx blame ... --cursor <cursor>` | same query only |

## Readiness

| Check | Command |
|---|---|
| Index readable | `ctx status` |
| Provider roots | `ctx sources` |
| Import all providers | `ctx import --all` |
| Setup and wait | `ctx setup --wait` |

Attribution pending or stale → finish indexing, then rerun the same blame request.

## Evidence Classes

| Class | Meaning | How to report |
|---|---|---|
| Proven production | Session directly linked to the committed lines | cite as evidence |
| Possible attribution | Session is a candidate; others may share the change | say "possible", never "proven" |
| Conflict | Multiple sessions plausibly produced the lines | report the conflict |
| Missing evidence | No session evidence covers these lines | state the gap |

## Verify

| Step | Command |
|---|---|
| Open the session | `ctx show session <ctx-session-id> --mode lite` |
| Open the event | `ctx show event <ctx-event-id> --window 5` |
| Resolve identity | `ctx locate session <ctx-session-id>` |

## Notes

| Constraint | Detail |
|---|---|
| Committed only | blame maps committed code; uncommitted edits have no commit to attribute |
| Cursor lifetime | a cursor is bound to the Core generation; reimport invalidates it |
| PR vs production | a PR can discuss code without producing it — check the evidence class |
| Limits | never claim an exhaustive audit after raising `--limit` |
| Privacy | transcripts and paths are private local data |
| Delegation | full workflow in `/follow-tool-ctx-rs` |
