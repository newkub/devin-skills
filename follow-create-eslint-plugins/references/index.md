# Index: follow-create-eslint-plugins

สารบัญ reference files สำหรับ skill `follow-create-eslint-plugins` ครอบคลุมการสร้าง custom ESLint plugins ด้วย JavaScript/TypeScript

## Reference Files

| File | ความรับผิดชอบ |
|------|---------------|
| `rule-structure.md` | โครงสร้างของ ESLint rule: `meta` object (`type`, `docs`, `messages`, `fixable`, `hasSuggestions`, `schema`), `create` function, `context.report`, `context.sourceCode`, และ AST traversal |
| `flat-config.md` | รูปแบบ ESLint flat config สำหรับ plugins: `plugins` key, namespace assignment, รูปแบบ rule `namespace/rule-name`, และตัวอย่าง configuration |

## ลำดับการอ่านแนะนำ

1. `rule-structure.md` — เริ่มจากการเข้าใจโครงสร้าง rule ก่อน เพราะเป็นหัวใจของ plugin
2. `flat-config.md` — จากนั้นศึกษาวิธีเชื่อม plugin เข้ากับ ESLint ผ่าน flat config

## Sources

- ESLint Custom Rules: https://eslint.org/docs/latest/extend/custom-rules
- ESLint Configuration Files: https://eslint.org/docs/latest/use/configure/configuration-files
- ESLint Create Plugins: https://eslint.org/docs/latest/extend/plugins
- ESLint Plugin Migration to Flat Config: https://eslint.org/docs/latest/extend/plugin-migration-flat-config
