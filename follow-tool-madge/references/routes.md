# Tool Madge Routes / Topics

| Route / Topic | URL |
|---|---|
| README | https://github.com/pahen/madge |
| Circular deps | https://github.com/pahen/madge#circular-dependencies |
| API (programmatic) | https://github.com/pahen/madge#api |
| CI usage | https://github.com/pahen/madge#cli |

## Key Concepts

- CI gate: `madge --circular src/` exit code ≠ 0 ถ้าเจอ cycle
- `--ts-config tsconfig.json` สำหรับ path alias (`@/...`)
- Programmatic: `const res = await madge('src', opts); res.circular()`
- ใช้คู่ `/check-circular-dependencies`, `/visualize-repo`
