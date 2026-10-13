| key | value |
|---|---|
| version | 0.3.6 |
| package registry | https://www.npmjs.com/package/license-md |
| repository | https://github.com/angleman/license-md |

| api | description | default | options |
|---|---|---|---|
| `node node_modules/license-md` | Scan deps → append license badge markdown to the README | stdout | pipe through `sed`/`>>` |
| License declaration | `license` field in package.json / pyproject.toml / Cargo.toml | - | SPDX expression |
| `gh api licenses/{key} --jq .body` | Fetch the correct license text from the GitHub Licenses API | - | e.g. `mit`, `apache-2.0` |
