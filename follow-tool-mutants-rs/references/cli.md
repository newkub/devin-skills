| key | value |
|---|---|
| install | `cargo install cargo-mutants --locked` |
| repository | https://github.com/sourcefrog/cargo-mutants |
| docs | https://mutants.rs/controlling.html |

| commands | description | default | options |
|---|---|---|---|
| `cargo mutants` | Run mutation tests in cwd | shuffled order by default | `--dir`, `--manifest-path`, `--file`, `--exclude`, `--re`, `--exclude-re`, `--jobs`, `--timeout`, `--config`, `--no-config` |
| `cargo mutants --list` | List mutants without running | — | `--json`, `--diff` |
| `cargo mutants --check` | Run `cargo check` on mutants | — | (none) |
| `cargo mutants --help` | Show help | — | (none) |

| Option | Description |
|---|---|
| `--dir`, `-d` | Test Rust tree in given directory |
| `--manifest-path` | Path to `Cargo.toml` |
| `--file`, `-f` | Mutate only files matching glob |
| `--exclude`, `-e` | Exclude files matching glob |
| `--re`, `-F` | Only test mutants matching regex |
| `--exclude-re`, `-E` | Exclude mutants matching regex |
| `--jobs` | Parallel jobs |
| `--timeout` | Timeout per test run |
| `--no-shuffle` | Run in source order |
| `--caught`, `-v` | Also print caught mutants |
| `--unviable`, `-V` | Also print mutants that fail build |
| `--config FILE` | Config file path |
| `--no-config` | Do not read `.cargo/mutants.toml` |
