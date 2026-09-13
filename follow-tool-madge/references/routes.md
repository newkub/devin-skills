# Tool Madge Routes / Topics

| Route / Topic | URL |
|---|---|
| README | https://github.com/pahen/madge |
| Circular deps | https://github.com/pahen/madge#circular-dependencies |
| API (programmatic) | https://github.com/pahen/madge#api |
| CI usage | https://github.com/pahen/madge#cli |

## Key Concepts

- CI gate: `madge --circular --exit-code 1 src/` — default exit code = 0 แม้เจอ cycle ต้องใส่ `--exit-code` เสมอ
- `--ts-config tsconfig.json` สำหรับ path alias (`@/...`)
- Programmatic: `const res = await madge('src', opts); res.circular()`
- `--image` ต้องมี Graphviz (`dot` binary) ติดตั้งใน system
