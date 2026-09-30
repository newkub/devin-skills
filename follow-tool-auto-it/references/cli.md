| key | value |
|---|---|
| install | `bun add -D auto` |
| repository | https://github.com/intuit/auto |
| docs | https://intuit.github.io/auto/ |

| commands | description | default | options |
|---|---|---|---|
| `auto init` | Initialize auto config and plugins | — | --only-pkg |
| `auto shipit` | Publish a new release | — | -d, --dry-run, --no-changelog, --no-chromy |
| `auto version` | Calculate version bump | — | --from, --to |
| `auto changelog` | Generate changelog | — | --from, --to, -d |
| `auto release` | Create GitHub release | — | --use-version |
| `auto label` | Manage labels | — | --pr, --reset |
| `auto pr-check` | Validate PR labels | — | --pr, --url |
| `auto --help` | Show help | — | (none) |
