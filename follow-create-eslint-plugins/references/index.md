# Index: follow-create-eslint-plugins

สารบัญ reference files สำหรับ skill `follow-create-eslint-plugins` ครอบคลุมการสร้าง custom ESLint plugins ด้วย JavaScript/TypeScript

## Reference Files

| File | ความรับผิดชอบ |
|------|---------------|
| `rule-structure-meta.md` | โครงสร้างพื้นฐานของ ESLint rule และ `meta` object: `type`, `docs`, `messages`, `fixable`, `hasSuggestions`, `schema` |
| `rule-structure-context.md` | `create` function, `context` object (`report`, `options`, `sourceCode`), `fixer` object, และ AST traversal |
| `flat-config-basics.md` | รูปแบบ ESLint flat config สำหรับ plugins: `plugins` key, namespace assignment, รูปแบบ rule `namespace/rule-name`, และ plugin object structure |
| `flat-config-advanced.md` | การใช้ configs จาก plugin, shared settings, dual export (flat config + legacy), และตัวอย่าง configuration แบบสมบูรณ์ |
| [website.md](website.md) | Official resources and links |

## ลำดับการอ่านแนะนำ

1. `rule-structure-meta.md` — เริ่มจากการเข้าใจ `meta` object ของ rule ก่อน เพราะเป็นหัวใจของ plugin
2. `rule-structure-context.md` — จากนั้นศึกษา `create` function และ `context` object สำหรับ implement rule logic
3. `flat-config-basics.md` — ศึกษาวิธีเชื่อม plugin เข้ากับ ESLint ผ่าน flat config
4. `flat-config-advanced.md` — ดูตัวอย่างขั้นสูง เช่น shared settings, dual export และ config แบบสมบูรณ์

## Sources

- ESLint Custom Rules: https://eslint.org/docs/latest/extend/custom-rules
- ESLint Configuration Files: https://eslint.org/docs/latest/use/configure/configuration-files
- ESLint Create Plugins: https://eslint.org/docs/latest/extend/plugins
- ESLint Plugin Migration to Flat Config: https://eslint.org/docs/latest/extend/plugin-migration-flat-config
