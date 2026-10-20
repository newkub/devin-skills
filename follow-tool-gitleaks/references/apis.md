| key | value |
|---|---|
| package | `gitleaks` — standalone Go binary (no npm/cargo package) |
| install | `mise use -g gitleaks` · `winget install Gitleaks.Gitleaks` · `scoop install gitleaks` · Docker `ghcr.io/gitleaks/gitleaks` |
| version | v8 line — upstream feature-complete, security patches only |
| license | MIT |
| docs | https://github.com/gitleaks/gitleaks |
| CI action | `gitleaks/gitleaks-action@v2` |

| surface | description | example |
|---|---|---|
| `[[rules]]` | custom detection rule | `id`, `description`, `regex`, `secretGroup`, `keywords`, `entropy` |
| `[[allowlists]]` | global/rule allowlist (v8.25+; older `[allowlist]`) | `description`, `commits`, `paths`, `regexes`, `stopwords` |
| `[extend]` | inherit default rules | `useDefault = true`, `disabledRules = ["generic-api-key"]` |
| `.gitleaks.toml` | config auto-discovered in the target path | repo root |
| `GITLEAKS_CONFIG` | config path via env | `export GITLEAKS_CONFIG=/path/custom.toml` |
| `GITLEAKS_CONFIG_TOML` | config content via env | `export GITLEAKS_CONFIG_TOML="$(cat custom.toml)"` |
| baseline | ignore already-rotated findings | `-b .gitleaks-baseline.json` |
