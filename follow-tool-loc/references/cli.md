| key | value |
|---|---|
| install | `cargo install loc` |
| version | 0.5.0 |
| repository | https://github.com/cgag/loc |
| docs | https://github.com/cgag/loc |

| commands | description | default | options |
|---|---|---|---|
| `loc [paths]` | Count lines of code in target directory | respects `.gitignore` | `--files`, `--sort`, `--include`, `--exclude`, `-u`, `-uu` |
| `loc --help` | Show help | — | (none) |

| Option | Description |
|---|---|
| `--files` | Show stats for each file |
| `--sort <column>` | Sort by `Code`, `Blank`, `Comment`, `Lines`, `Files` |
| `--include <regex>` | Include matching files (Rust regex; multiple flags = OR) |
| `--exclude <regex>` | Exclude matching files (multiple flags = OR) |
| `-u` | Ignore `.gitignore` |
| `-uu` | Ignore `.gitignore` and include hidden files |
