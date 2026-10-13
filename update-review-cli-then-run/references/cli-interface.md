# CLI Interface And Output Format

## Help Option

Verify that the `--help` and `-h` options display:

- usage: how to invoke the CLI
- options: all flags with a description
- exit codes: 0 = success, 1 = invalid arguments
- examples: usage examples

If `--help`/`-h` is missing → flag as `High` severity

## Exit Codes

Verify that exit codes are correct:

- `0` — success, the review completed
- `1` — invalid arguments or an error

If exit codes are wrong → flag as `High` severity

## Output Format

Verify that the output supports 2 formats via the `--format` flag:

- `table` — default, rendered as a readable table
- `JSON` — for programmatic consumption

If a format option is missing → flag as `Medium` severity

## Error Messages

Verify the error messages for invalid arguments:

- Identify the incorrect argument
- Suggest the correct usage
- Show exit code 1

If error messages are unclear → flag as `Medium` severity

## CLI Flags Checklist

Verify all flags are present:

- `--help` / `-h` — show help
- `--format` — choose the output format (`table` | `JSON`)
- `--output` — path to write the result to (optional)

If a required flag is missing → flag at the appropriate severity

## Evidence Format

Every finding must include:

- File path, e.g. `tools/review-codebase/src/presentation/cli.ts`
- Line number
- The code snippet that is problematic
