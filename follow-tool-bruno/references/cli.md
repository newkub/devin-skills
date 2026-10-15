| Option | Description |
|--------|-------------|
| `--env <name>` | collection environment |
| `--global-env <name>` | workspace-level environment |
| `--workspace-path <path>` | workspace path when the collection is not at the root |
| `--env-var k=v` | overwrite an env var (repeatable) |
| `--global-env-var k=v` | overwrite a global env var (requires `--global-env`) |
| `--env-file <file>` | environment file (`.bru` or `.json`) |
| `--sandbox <safe|developer>` | JS sandbox mode — default `safe` since v3.0.0 |
| `--csv-file-path` / `--json-file-path` | data file for data-driven runs |
| `--iteration-count <n>` | repeat the run n times |
| `-r` | recursive run |

| Option | Description |
|--------|-------------|
| `--delay <ms>` | delay between requests |
| `--tests-only` | run only requests that have tests/assertions |
| `--bail` | stop when a request/test/assertion fails |
| `--tags` / `--exclude-tags` | filter by tags (comma-separated) |
| `--parallel` | run requests in parallel |

| Option | Description |
|--------|-------------|
| `--reporter-json <path>` | JSON report |
| `--reporter-junit <path>` | JUnit XML report |
| `--reporter-html <path>` | HTML report |
| `--reporter-skip-all-headers` | strip all headers in the report |
| `--reporter-skip-headers <list>` | strip selected headers |
| `--reporter-skip-request-body` / `--reporter-skip-response-body` / `--reporter-skip-body` | strip bodies in the report |

| Option | Description |
|--------|-------------|
| `--secrets-env-file <file>` | dotenv credentials for external secret managers (Vault/AWS/Azure/GCP) |
| `--cacert <file>` | CA certificate (PEM) |
| `--client-cert-config <file>` | client cert config JSON (per-domain mTLS) |
| `--insecure` | allow insecure TLS |
| `--noproxy` | bypass all proxies |
| `--ignore-truststore` / `--disable-cookies` | truststore/cookie control |
