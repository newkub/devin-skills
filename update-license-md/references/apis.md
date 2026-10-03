| key | value |
|---|---|
| version | 0.3.6 |
| package registry | https://www.npmjs.com/package/license-md |
| repository | https://github.com/angleman/license-md |

| api | description | default | options |
|---|---|---|---|
| `node node_modules/license-md` | Scan deps → append license badge markdown ลง README | stdout | pipe ผ่าน `sed`/`>>` |
| License declaration | `license` field ใน package.json / pyproject.toml / Cargo.toml | - | SPDX expression |
| `gh api licenses/{key} --jq .body` | ดึง license text ที่ถูกต้องจาก GitHub Licenses API | - | เช่น `mit`, `apache-2.0` |
