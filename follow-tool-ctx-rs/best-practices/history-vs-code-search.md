# History Search Versus Code Search

> Source: https://github.com/ctxrs/ctx/blob/main/docs/agent-usage.md and https://github.com/ctxrs/ctx/blob/main/docs/cli-reference.md (accessed 2026-10-22)

## The Boundary

- `ctx search` searches indexed agent history: sessions, messages, tool calls, and outputs
- `ctx search --file <path>` filters history metadata for that path — it does not read the file on disk
- Filesystem text search belongs to ripgrep; structural code search belongs to ast-grep; both live in `/code-search`
- Git history, pickaxe, and line history belong to `/git-search`
- `ctx blame` is the bridge: committed code to the agent session that produced it

## Choosing The Layer

| Question | Tool |
|---|---|
| Where is this string in the working tree? | `/code-search` with `rg` |
| Where is this function called or defined? | `/code-search` with `ast-grep` |
| When did this line change, and in which commit? | `/git-search` with `git log -L` or `git blame` |
| Which agent session wrote this code? | `ctx blame` |
| Did a previous session already investigate this error? | `ctx search` |

## Pitfalls

- Running `ctx search --file src/app.ts` and expecting current file content
- Repeating a filesystem search through ctx because history matched a similar path
- Treating a ctx history hit with the same path as proof the current file is identical
- Using ripgrep to answer a provenance question, or ctx blame to answer a syntax question

## Related

- [cli.md](../references/cli.md)
- [evidence-discipline.md](evidence-discipline.md)
