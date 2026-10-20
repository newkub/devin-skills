| key | value |
|---|---|
| install | `npm install -g esm.sh` or `bunx esm.sh` / `go install github.com/esm-dev/esm.sh@latest` |
| version | CLI v0.1.1 (verified 2026-09-13) |
| repository | https://github.com/esm-dev/esm.sh |

| command | description | options |
|---|---|---|
| `esm.sh add [...imports]` | add imports into the `importmap` script in `index.html` | — |
| `esm.sh tidy` | clean up + optimize `importmap` script | — |
| `esm.sh --version` | show version | `-v` |
| `esm.sh --help` | display help | `-h` |
| `bunx esm.sh add react react-dom` | add entries in the importmap | — |
| `bunx esm.sh tidy` | tidy/optimize the importmap | — |
