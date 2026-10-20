---
name: read-all-files
description: Read/concat all or only related files in a project for analysis — check-file-relation Rust CLI
argument-hint: "all | patterns <glob> | related <entry-file>"
related:
  - check-file-relation
  - deep-analyze
  - report-file-structure
  - read-devin-context
  - update-devin-global-skills
---

## Goal

Read and analyze every file in the project completely — use the `/check-file-relation` Rust CLI as the engine for finding files, ordering them, and concatenating into a single output

## Scope

Use when you need to read every file or only the files related to a task

- `all` — concat every needed file in the project, ordered config → entry → deps → rest
- `patterns <glob>` — only files matching the glob, e.g. `src/**/*.ts`
- `related <entry>` — only the entry + files reachable through the import chain (deps first)

CLI engine: `<skills>/check-file-relation/target/release/check-file-relation.exe` (build: `cargo build --release` in `<skills>/check-file-relation/`) — examples use `cfr` for short

## Execute

### 1. Prepare

> Goal: plan the reading

1. Run `/report-file-structure` to see the overview
2. Identify which file types to read, per the argument
3. Set the priority order: config → entry points → core → tests → docs

### 2. Collect + Concat Files

> Goal: get a complete set of files in a readable order

1. If argument `all`:

   ```bash
   cfr . --all --order smart --out .devin/tmp/bundle.txt
   ```

   - `--order smart` = config files → entry points → topo deps → the rest
   - by default it skips `node_modules`, `.git`, `dist`, `build`, `coverage`, `target`, etc. — skip `.devin/tmp` yourself by not feeding the output back into the same scope, or use `--include` to limit the scope

2. If argument `patterns <glob>`:

   ```bash
   cfr . --include "src/**/*.ts" --all --order smart
   cfr . --include "*.json" --include "*.toml" --all   # non-source too
   ```

3. If you only want the files related to an entry (`related`):

   ```bash
   cfr src --from src/main.ts            # entry + transitive deps, deps first
   cfr . --summary --ext ts,tsx          # view the graph/import rank before picking an entry
   ```

4. Languages/import styles the built-ins don't cover → add `--pattern '<regex>'` (see `/check-file-relation`)
5. Large codebase → limit with `--max-lines 250` per file or split by subdir

### 3. Read + Analyze

> Goal: read and analyze what was concatenated

1. Read the output — max 250 lines per file per pass; if the bundle is long, continue with an offset or run `--from` per subdir separately
2. Analyze the project structure and file relations (match the `===== <path> =====` headers against the `--json` graph)
3. Summarize patterns and architecture — run `/deep-analyze` if deeper analysis is needed
4. Verify reading completeness (compare the file count with the CLI's summary)

## Rules

- Always use the `/check-file-relation` CLI as the engine — never hand-write a walker/concat again
- Always read config first → `--order smart` already handles it; entry before deps → use `--from`
- Skip unrelated files — scope with `--include`/`--ext`/`--from`
- The output may contain secrets → run `/check-secrets` before feeding it to an LLM
- Use /read-devin-context if needed
- If reading to improve devin global skills → pair with `/update-devin-global-skills`

## Expected Outcome

- A single bundle containing every file or only the related ones, ordered by import chain
- Understanding of the project structure and inter-file relations
- Ready for further analysis
