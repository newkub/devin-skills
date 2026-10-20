| key | value |
|---|---|
| package | `hurl` (single Rust binary) · npm wrapper `@orangeopensource/hurl` |
| install | `scoop install hurl` · `winget install hurl` · `mise use -g hurl` · `cargo install --locked hurl` · Docker `ghcr.io/orange-opensource/hurl` |
| version | 8.0.1 (verified 2026-09-13) |
| license | Apache-2.0 |
| docs | https://hurl.dev |
| repo | https://github.com/Orange-OpenSource/hurl |
| CI | no official GitHub Action — install the binary in the workflow, gate on the exit code |

| api | description | signature/example |
|---|---|---|
| request block | method, URL, headers, body | `GET https://api.example.com/health` |
| expected response | status line, optionally headers/body | `HTTP 200` · `HTTP *` + `[Asserts]` |
| `[Captures]` | store response values for later requests | `id: jsonpath "$.id"` |
| `[Asserts]` | assertions over the response | `jsonpath "$.status" == "ok"` |
| queries | value extractors | `jsonpath`, `xpath`, `header`, `status`, `duration`, `body`, `regex`, `sha256` |
| predicates | comparison operators | `==`, `!=`, `contains`, `startsWith`, `matches`, `exists`, `>`, `<` |
| interpolations | reuse captured values | `{{name}}` in URL/headers/body |
| `[Options]` | per-file options | `retry`, `location`, `max-redirs` |
| variables | run-time inputs | `--variable k=v`, `--variables-file vars.env` |
| env vars | CI-safe values | `HURL_*` (e.g. `HURL_RETRY`, `HURL_LOCATION`) |
| reports | machine-readable output | `--report-junit`, `--report-html`, `--report-json` |
| `--test` | CI mode — non-zero exit on failure | `hurl --test tests/api/` |
