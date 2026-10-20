| command | description | notes |
|---|---|---|
| `gitleaks git [path]` | scan a git repository via `git log -p` | no path → current directory |
| `gitleaks dir [path]` | scan directories or files (aliases `files`, `directory`) | no path → current directory |
| `gitleaks stdin` | detect secrets from stdin | pipe file content |
| `gitleaks version` | print the version | |
| `gitleaks completion <shell>` | generate shell completion | bash, zsh, fish, powershell |
| `gitleaks detect` / `protect` | deprecated since v8.19, hidden from help | use `git`/`dir`/`stdin` |

| flag | default | meaning |
|---|---|---|
| `-b, --baseline-path` | — | findings file to ignore (only new issues reported) |
| `-c, --config` | `.gitleaks.toml` in target, else defaults | config path (precedence: flag → `GITLEAKS_CONFIG` → `GITLEAKS_CONFIG_TOML` → file) |
| `-f, --report-format` | json | json, csv, junit, sarif, template |
| `-r, --report-path` | — | write the report to a file |
| `--report-template` | — | template file; implies `--report-format=template` |
| `--redact` | 100 when set | redact percentage 0-100 from logs/stdout |
| `--log-opts` | — | extra `git log` options (git command only) |
| `--max-target-megabytes` | 0 | skip files larger than N MB |
| `--timeout` | 0 | command timeout in seconds, 0 = none |
| `--no-banner`, `--no-color` | false | suppress banner / color |
| `-v, --verbose` | false | verbose output |
