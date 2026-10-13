# refs-cli — Flags and Commands

Entry point: `bun scripts/refs-cli/index.ts` (run from the skill folder or give the full path)

## Usage

```
bun scripts/refs-cli/index.ts [website|api|cli ...] [flags]
```

- positional = the domain(s) to generate (unspecified → `api cli`)
- repeating a domain within one command is fine (deduped naturally by the table)

## Flags

| Flag | Default | Meaning |
|---|---|---|
| `--root <dir>` | cwd | project root whose source is scanned and manifests are read |
| `--out <dir>` | `<root>/.devin/references` | where to write the output files (created automatically) |
| `--url <url>` | — | base URL for the `website` domain (required when this domain is selected) |
| `--dry-run` | off | print markdown to stdout without writing files |
| `--help`, `-h` | — | show usage |

## Examples

```bash
# preview api + cli of the current project in the chat
bun scripts/refs-cli/index.ts --dry-run

# generate every domain of a staging site
bun scripts/refs-cli/index.ts website api cli --url https://staging.example.com --root ~/code/my-app

# write only api.md into docs/references
bun scripts/refs-cli/index.ts api --root ~/code/my-app --out docs/references
```

## Exit Behavior

- a tool is missing (e.g. `crw` for website) → error with a pointer to the tool's install skill (`/follow-tool-crw`), then exit 1
- domain `website` without `--url` → error before starting (fail fast, no blind scraping)
- an ast-grep pattern errors → that pattern is skipped silently (the table may be empty — suspect the pattern before the code)
