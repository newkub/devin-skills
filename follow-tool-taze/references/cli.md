| key | value |
|---|---|
| install | `bun add -D taze` |
| version | 21.1.0 |
| repository | https://github.com/antfu-collective/taze |
| docs | https://www.npmjs.com/package/taze |

| commands | description | default | options |
|---|---|---|---|
| `taze` | Check dependency updates within current semver range | — | `-r, --recursive`, `--include`, `--exclude`, `--include-locked`, `-l, --show-locked`, `--peer`, `--write`, `--install`, `--json`, `--interactive` |
| `taze major` | Allow major (breaking) updates | — | same as above |
| `taze minor` | Allow minor updates within same major | — | same as above |
| `taze patch` | Allow patch updates | — | same as above |
| `taze --help` | Show help | — | (none) |

| Option | Description |
|---|---|
| `-r, --recursive` | Scan monorepo packages |
| `--include` / `--exclude` | Filter packages by name/regex |
| `--include-locked` / `-l` | Include fixed versions |
| `--peer` | Include `peerDependencies` |
| `--write` | Write updates to `package.json` |
| `--install` | Run install after writing |
| `--json` | Output JSON for agents |
| `--interactive` | Interactive selection |
