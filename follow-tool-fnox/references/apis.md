| key | value |
|---|---|
| package | `fnox` (Rust binary, by jdx) |
| install | `mise use -g fnox` |
| version | 1.40.x |
| license | MIT |
| docs | https://fnox.jdx.dev/ |
| CLI reference | https://fnox.jdx.dev/cli/ |

| surface | description | example |
|---|---|---|
| `[providers.<name>]` | declare a secret source | `type = "age"` + `recipients = ["age1..."]`; `type = "1password"` + `vault = "Engineering"` |
| `[secrets.<KEY>]` | bind one env var to a source | `provider = "age"`, `value = "<ciphertext>"` (written by `fnox set`) |
| provider types | built-in backends, mixable per secret | age, 1password, aws-sm, azure-sm, gcp-sm, bitwarden, vault |
| config discovery | searched from cwd upward | `fnox.toml`, `.fnox.toml`, `fnox.local.toml`, `.fnox.local.toml` |
| profile | layered config selection | `-P prod` / `FNOX_PROFILE` (later profiles override earlier) |
| `if_missing` | behavior when a secret cannot resolve | `error`, `warn`, `ignore` |
| daemon | in-memory cache of resolved values | opt-in; `fnox daemon status/clear` |
| lease | temporary credentials (STS, Vault, GitHub App) | `fnox lease create/list/revoke` |
| proxy | inject real values into matching HTTPS requests | `fnox proxy rules` / `fnox proxy run` |
