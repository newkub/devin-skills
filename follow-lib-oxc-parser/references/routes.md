# Lib Oxc Parser Routes / Topics

| Route / Topic | URL |
|---|---|
| Oxc docs | https://oxc.rs/docs/guide/usage/parser.html |
| AST types | https://github.com/oxc-project/oxc/tree/main/npm/oxc-types |
| Playground | https://oxc.rs/playground |
| oxc-walker | https://www.npmjs.com/package/oxc-walker |
| Ecosystem (oxlint/rolldown) | https://oxc.rs |

## Key Concepts

- `astType: 'ts'` คืน TypeScript AST (TSESTree-like); default คือ ESTree ที่ strip types
- Errors ใน result — parse ไม่ throw; ตรวจ `result.errors`
- ใช้กับ `ast-grep`/`oxlint` ecosystem; สำหรับ lint rules ดู `/use-astgrep-programmatic`
- Performance: ~3x faster than Babel/TS parser (Rust)
