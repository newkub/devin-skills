| key | value |
|---|---|
| package | `@usebruno/cli` (binary `bru`) |
| install | `bun add -D @usebruno/cli` · `mise use -g npm:@usebruno/cli` · `npm i -g @usebruno/cli` · official Docker image for CI |
| version | 4.3.0 (npm latest, verified 2026-10-24) |
| license | MIT |
| docs | https://docs.usebruno.com |
| repo | https://github.com/usebruno/bruno |
| CI action | `usebruno/bruno-cli-action@v1` |

| api | description | signature/example |
|---|---|---|
| classic `bru` format | `bruno.json` + `.bru` request files + `environments/*.bru` | pick one format per collection |
| `opencollection` format | `opencollection.yml` + `.yml` requests (new default) | human-readable YAML |
| `bru import openapi` | OpenAPI spec → collection | `--source <spec\|url> --output <dir> --collection-name "API"` |
| `bru import wsdl` | WSDL/SOAP → collection | `--source <file.wsdl> --output <dir>` |
| `bru run <collection>` | run requests + tests | `-r` recursive |
| `bru docs generate` | collection → standalone HTML reference | run from the collection root; `-o/--output`, `--all-envs`, `--envs A,B`, `--exclude-envs`, `--tags`, `--exclude-tags` |
| environments | env selection at run time | `--env`, `--global-env`, `--env-var k=v`, `--env-file` |
| data-driven runs | CSV/JSON iteration | `--csv-file-path`, `--json-file-path`, `--iteration-count` |
| folder tags (4.3.0) | tags on a folder inherit into tag filters | `bru run --tags`, `--exclude-tags` |
| mock servers | Beta desktop-app feature, no CLI counterpart | local `http://localhost:<port>` from saved examples or an OpenAPI spec; stops when the app closes, never auto-starts, in-memory 500-entry request log |
| `externalSecrets` | fetch secrets from vaults, never written to disk (held in memory since 4.3.0) | `--secrets-env-file` |
| TLS / mTLS | client certs, CA, proxy bypass | `--client-cert-config`, `--cacert`, `--noproxy` |
| reporters | machine-readable results | `--reporter-json`, `--reporter-junit`, `--reporter-html`, `--reporter-skip-*` |
| sandbox mode | request-script capability level | `--sandbox safe` (default since v3) \| `developer` |
