# refs-cli — Flags And Commands

Entry point: `bun <skill-dir>/scripts/refs-cli/index.ts` (run from the skill folder or give the full path)

## Usage

```text
bun <skill-dir>/scripts/refs-cli/index.ts [website|api|cli ...] [flags]
```

- positional = the domain or domains to generate (unspecified becomes `api cli`)
- repeating a domain within one command is fine (deduped naturally by the table)

## Flags

| Flag | Default | Meaning |
|---|---|---|
| `--root <dir>` | cwd | project root whose source is scanned and manifests are read |
| `--out <dir>` | `<root>/.agents/references` | where to write the output files (created automatically) |
| `--url <url>` | — | base URL for the `website` domain (required when this domain is selected) |
| `--dry-run` | off | print markdown to stdout without writing files |
| `--help`, `-h` | — | show usage |

## Examples

```bash
# preview api + cli of the current project in the chat
bun <skill-dir>/scripts/refs-cli/index.ts --dry-run

# generate every domain of a staging site
bun <skill-dir>/scripts/refs-cli/index.ts website api cli --url https://staging.example.com --root <project-dir>

# write only api.md into docs/references
bun <skill-dir>/scripts/refs-cli/index.ts api --root <project-dir> --out <project-dir>/docs/references
```

## Exit Behavior

- a tool is missing, e.g. `crw` for website → error with a pointer to the tool's install skill (`/follow-tool-crw`), then exit 1
- domain `website` without `--url` → error before starting (fail fast, no blind scraping)
- an ast-grep pattern errors → that pattern is skipped silently; an empty table usually means a bad pattern, not an empty project
