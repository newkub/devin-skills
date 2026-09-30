| key | value |
|---|---|
| install | `npm install -g esm.sh` หรือ `npx esm.sh` / `go install github.com/esm-dev/esm.sh@latest` |
| version | CLI v0.1.1 (verified 2026-09-13) |
| repository | https://github.com/esm-dev/esm.sh |

| command | description | options |
|---|---|---|
| `esm.sh add [...imports]` | add imports ลง `importmap` script ใน `index.html` | — |
| `esm.sh tidy` | clean up + optimize `importmap` script | — |
| `esm.sh --version` | show version | `-v` |
| `esm.sh --help` | display help | `-h` |
| `npx esm.sh add react react-dom` | เพิ่ม entries ใน importmap | — |
| `npx esm.sh tidy` | จัดระเบียบ/optimize importmap | — |
