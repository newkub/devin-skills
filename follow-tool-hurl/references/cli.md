| Option | Description |
|--------|-------------|
| `--test` | test mode — report per-file pass/fail, exit non-zero on failure |
| `--variable <name=value>` | Set a variable (repeatable) |
| `--variables-file <file>` | Load variables from a `.env`-style file |
| `-o, --output <file>` | Write the response body to a file |
| `-L, --location` | Follow redirects (same curl semantics) |
| `--insecure` | Allow insecure TLS |
| `--connect-timeout <s>` / `-m, --max-time <s>` | Timeouts (accepts `20s`, `3500ms`) |
| `--retry <n>` / `--retry-interval <ms>` | retry failed requests |
| `--parallel` | Run files in parallel |
| `--continue-on-error` | Keep running even if an entry fails |
| `-v, --verbose` / `--very-verbose` | debug output |
| `--error-format <short|long>` | Error report format |
| `--proxy`, `--user`, `--cacert`, `-E/--cert`, `--aws-sigv4` | curl-equivalent network/auth options |

| Option | Description |
|--------|-------------|
| `--report-junit <file>` | JUnit XML report |
| `--report-html <dir>` | HTML report (per-file pages + waterfall) |
| `--report-json <dir>` | JSON report |
| `--json` | Output structured JSON to stdout |

| Code | Meaning |
|------|---------|
| 0 | All succeeded |
| 1 | usage error |
| 2 | Parse error in `.hurl` |
| 3 | runtime error (network, etc.) |
| 4 | assert error (`--test` mode) |
