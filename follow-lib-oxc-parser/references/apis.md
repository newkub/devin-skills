| key | value |
|---|---|
| version | 0.149.0 |
| package registry | https://www.npmjs.com/package/oxc-parser |
| repository | https://github.com/oxc-project/oxc |
| docs | https://oxc.rs/docs/guide/usage/parser.html |

| api | description | default | options |
|---|---|---|---|
| `parseSync(filename, code)` | Parse → `{program, errors, comments}` | - | `sourceType`, `lang`, `astType: 'ts'` |
| `parseSync(code, {astType:'ts'})` | TypeScript-aware AST (TS nodes preserved) | - | - |
| `parseSync` options | `lang: 'ts'\|'tsx'\|'js'\|'jsx'` | infer | `preserveParens`, `showSemanticErrors` |
| AST walk | ต้อง walk เอง หรือใช้ `oxc-walker` (`bun add -d oxc-walker`) | - | - |
