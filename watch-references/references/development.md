# Development Reference

The package is Bun ESM TypeScript. Source lives in `src/`, the suite in `tests/core.test.ts`, and the commands are `bun test tests` and `bun check -p . --no-script`.

## Module Layering

Imports only point down this list; a module never imports from a layer above it.

| Layer | Modules | Responsibility |
| --- | --- | --- |
| 1 | `types.ts` | Shared types and category constants |
| 2 | `config.ts` | Config merge, path resolution, root containment, `CliError` |
| 2 | `runproc.ts` | Shell execution and pid checks |
| 3 | `astgrep.ts` | Language table, binary resolution, node scanning |
| 4 | `store.ts` | Atomic JSON writes, id hashing, index queries |
| 5 | `derive.ts` | References ast-grep kinds cannot express |
| 6 | `scan.ts` | Full and incremental scan pipelines |
| 7 | `watch.ts`, `feedback.ts`, `visual.ts`, `devproc.ts`, `skills.ts` | Feature modules |
| 8 | `cli.ts`, `mcp.ts` | Surfaces only; no extraction logic |

`scan.ts` depends on `derive.ts`, `astgrep.ts`, `store.ts`, and `config.ts`; the surface modules depend on every feature module. Adding an import that points up this list is the usual source of a cycle.

## Adding A Language

1. Add the extension to `LANG_BY_EXT` in `src/astgrep.ts` with a `lang` value that ast-grep accepts and the node kinds worth indexing.
2. Add a declaration-name pattern to `NAME_PATTERNS` in `src/derive.ts` when the language's declaration syntax differs; the generic patterns cover most cases.
3. Add a fixture file to `tests/core.test.ts`, scan it, and assert the category and line range.
4. Run `bun test tests`; a language with no matching node kinds should still produce `file` and `architecture` references.

## Adding A Category

1. Extend `CATEGORIES` in `src/types.ts` and, when the category is scan-derived, `SCANNED_CATEGORIES`.
2. Emit the reference from `derive.ts` with a distinct `provenance.generator`, or from `scan.ts` for parser hits.
3. Make sure the extractor emits one reference per logical item; a scan replaces a file's refs wholesale, so a partial pass loses the rest.
4. Add a case to `tests/core.test.ts` and to the generated guide only when the category changes how an agent should search.
5. Run `watch-ref skills validate` after regenerating the guides.

## Testing

- Fixtures are written to a fresh directory under `os.tmpdir()` and removed in `afterAll`.
- ast-grep scans are slow on Windows; give any test that waits for a watch cycle a 60-second timeout and a wait helper with a 20-second bound.
- A watcher test proves recovery by forcing an error, waiting for `errors === 0`, and checking that the index exists again.
- The MCP tests use `InMemoryTransport.createLinkedPair()` with a real `Client`; they assert tool results, not console output.
- `assertConsistent` checks that every reference points at an existing file, that line ranges are valid, and that ids are unique.

## Platform Notes

- `Bun.spawn` throws synchronously when the binary is missing; wrap a probe in `try` rather than checking an exit code.
- MSYS `/tmp` and Bun's `/tmp` are different directories on Windows; use `os.tmpdir()` for fixtures.
- Node paths use `\` on Windows; convert to POSIX with `toPosix` before storing or comparing.
- `Bun.Glob.scan()` is async; always `for await` over it, and remember `**/*` also matches root-level files.

## Invariants

1. One `diagnostic` reference per failing file, never one per parse attempt.
2. A full scan drops records whose paths are gone, and a watched scan drops a reported-removed path in the same flush.
3. A removed or renamed file re-parses the files that imported it, so no stale `architecture` edge survives.
4. Every write is atomic, and the watcher ignores its own output directory.
5. Feedback never edits source; only an authorized apply does, after validating scope and `expectedText`.
6. `verified` requires checks that pass, a clean re-scan, and at least one configured check.
7. Every path argument resolves inside the project root.
