# Package Scripts Validation

## Tools Review Scripts

Verify that `tools/review-codebase/package.json` has all scripts:

- `review-codebase` — run the review in table format
- `review-codebase:json` — run the review in JSON format

Example:

```json
{
  "scripts": {
    "review-codebase": "bun run src/index.ts",
    "review-codebase:json": "bun run src/index.ts --format JSON"
  }
}
```

If a script is missing → flag as `Medium` severity

## Root Package Scripts

Verify that the root `package.json` has filter commands:

- `review-codebase` — `bun --filter tools-review-codebase review-codebase`
- `review-codebase:json` — `bun --filter tools-review-codebase review-codebase:json`

Example:

```json
{
  "scripts": {
    "review-codebase": "bun --filter tools-review-codebase review-codebase",
    "review-codebase:json": "bun --filter tools-review-codebase review-codebase:json"
  }
}
```

If a root script is missing → flag as `Medium` severity

## Script Consistency

Verify that the scripts are consistent:

- The script name in root matches the one in `tools/review-codebase` (`review-codebase`, `review-codebase:json`)
- The filter command uses the correct workspace name (`tools-review-codebase`)
- There is no script pointing to a wrong path

If an inconsistency is found → flag as `Low` severity

## Script Execution

Verify that the scripts actually run:

- Run `bun --filter tools-review-codebase review-codebase` and check the exit code
- Run `bun --filter tools-review-codebase review-codebase:json` and check the output format

If a script does not run → flag as `High` severity

## Evidence Format

Every finding must include:

- File path, e.g. `tools/review-codebase/package.json` or the root `package.json`
- Line number
- The code snippet that is problematic
