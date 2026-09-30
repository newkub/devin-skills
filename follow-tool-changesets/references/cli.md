| key | value |
|---|---|
| install | `bun add -D @changesets/cli` |
| repository | https://github.com/changesets/changesets |
| docs | https://github.com/changesets/changesets/blob/main/packages/cli/README.md |

| commands | description | default | options |
|---|---|---|---|
| `changeset init` | Create `.changeset/` with config and README | — | (none) |
| `changeset` / `changeset add` | Interactive prompt to add a changeset | — | `--empty`, `--open` |
| `changeset version` | Bump versions and write changelogs | — | `--ignore <pkg>`, `--snapshot` |
| `changeset publish` | Publish packages to npm and create tags | — | `--otp <token>`, `--tag` |
| `changeset status` | Report changeset status | — | `--verbose`, `--output <file>`, `--since <ref>` |
| `changeset pre enter <tag>` | Enter prerelease mode | — | (none) |
| `changeset pre exit` | Exit prerelease mode | — | (none) |
| `changeset tag` | Push git tags for packages | — | (none) |
| `changeset --help` | Show help | — | (none) |
