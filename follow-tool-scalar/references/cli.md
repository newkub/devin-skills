| key | value |
|---|---|
| install | `bun add -D @scalar/cli` |
| repository | https://github.com/scalar/scalar |
| docs | https://guides.scalar.com |

| commands | description | default | options |
|---|---|---|---|
| `scalar init` | Create starter `scalar.config.json` | — | (none) |
| `scalar document validate <file>` | Validate OpenAPI spec (Swagger 2.0 / OAS 3.0 / 3.1) | — | (none) |
| `scalar document mock <file>` | Run mock server from OpenAPI (validates requests, `422` on violation) | — | `--watch`, `--port` |
| `scalar document serve <file>` | Preview API reference locally | — | (none) |
| `scalar document lint <file>` | Lint with Spectral rules | — | (none) |
| `scalar document bundle <file>` | Resolve `$refs` and external deps | — | (none) |
| `scalar document markdown <file>` | Generate Markdown docs | — | (none) |
| `scalar registry` | Manage Scalar registry | — | (none) |
| `scalar project` | Manage Scalar docs project | — | (none) |
| `scalar --help` | Show help | — | (none) |
