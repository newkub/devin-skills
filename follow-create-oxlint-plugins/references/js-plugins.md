# JavaScript Plugins Reference

เอกสารอ้างอิงสำหรับ JavaScript plugins ใน Oxlint ครอบคลุมการใช้ฟิลด์ `jsPlugins` รูปแบบ string vs object
การกำหนด alias สำหรับ reserved names และคำเตือนสถานะ alpha

## ภาพรวม

Oxlint รองรับ plugins ที่เขียนด้วย JavaScript — ทั้งที่เขียนเองหรือจาก npm Plugin API ของ Oxlint
เข้ากันได้กับ ESLint v9+ ทำให้ ESLint plugins ส่วนใหญ่ใช้งานได้ทันที

> **คำเตือน:** JS plugins อยู่ในสถานะ **alpha** และกำลังพัฒนาอยู่ — ไม่อยู่ภายใต้ semver
> หากพบพฤติกรรมต่างจาก ESLint ให้รายงานเป็น bug

## การใช้งาน `jsPlugins`

ขั้นตอน:

1. เพิ่ม path ของ plugin ในฟิลด์ `jsPlugins` ของ config file
2. เพิ่ม rules จาก plugin ในฟิลด์ `rules`

path สามารถเป็น import specifier ใดก็ได้ เช่น `./plugin.js`, `eslint-plugin-foo`, หรือ `@foo/eslint-plugin`
paths จะถูก resolve โดย relative กับ config file เอง

### ตัวอย่าง `.oxlintrc.json`

```jsonc
{
  "jsPlugins": ["./path/to/my-plugin.js", "eslint-plugin-whatever", "@foobar/eslint-plugin"],
  "rules": {
    "my-plugin/rule1": "error",
    "my-plugin/rule2": "warn",
    "whatever/rule1": "error",
    "whatever/rule2": "warn",
    "@foobar/rule1": "error"
  }
}
```

### ตัวอย่าง `oxlint.config.ts`

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: ["./path/to/my-plugin.js", "eslint-plugin-whatever", "@foobar/eslint-plugin"],
  rules: {
    "my-plugin/rule1": "error",
    "my-plugin/rule2": "warn",
    "whatever/rule1": "error",
    "whatever/rule2": "warn",
    "@foobar/rule1": "error",
  },
});
```

## รูปแบบ String vs Object

`jsPlugins` รับ array ที่แต่ละ element เป็นได้สองรูปแบบ:

| รูปแบบ | โครงสร้าง | การใช้งาน |
| --- | --- | --- |
| String | `"eslint-plugin-foo"` | ใช้ชื่อ default ของ plugin (derive จาก specifier) |
| Object | `{ "name": "alias", "specifier": "eslint-plugin-foo" }` | กำหนด alias สำหรับ plugin |

### String format

ใช้เมื่อไม่มี conflict กับ reserved names และชื่อ default ยอมรับได้:

```json
{
  "jsPlugins": ["eslint-plugin-playwright"]
}
```

### Object format (alias)

ใช้เมื่อต้องการกำหนดชื่ออื่นให้ plugin:

```json
{
  "jsPlugins": [
    { "name": "my-eslint-react", "specifier": "eslint-plugin-react" }
  ]
}
```

ผสม string และ object ใน array เดียวกันได้:

```jsonc
{
  "jsPlugins": [
    { "name": "jsdoc-js", "specifier": "eslint-plugin-jsdoc" },
    { "name": "short", "specifier": "eslint-plugin-with-name-so-very-very-long" },
    "eslint-plugin-whatever"
  ],
  "rules": {
    "jsdoc-js/check-alignment": "error",
    "short/rule1": "error",
    "whatever/rule2": "error"
  }
}
```

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: [
    { name: "jsdoc-js", specifier: "eslint-plugin-jsdoc" },
    { name: "short", specifier: "eslint-plugin-with-name-so-very-very-long" },
    "eslint-plugin-whatever",
  ],
  rules: {
    "jsdoc-js/check-alignment": "error",
    "short/rule1": "error",
    "whatever/rule2": "error",
  },
});
```

## Alias สำหรับ Reserved Names

ชื่อ plugin บางชื่อ reserved เพราะ implement แบบ native ใน Rust หากใช้ชื่อ reserved ใน `jsPlugins`
จะเกิด conflict ต้องกำหนด `name` (alias) ให้ต่างจากชื่อ reserved

Reserved names ที่พบบ่อย: `react`, `unicorn`, `typescript`, `oxc`, `import`, `jest`, `vitest`,
`jsx-a11y`, `nextjs`, `jsdoc`, `node`, `promise`, `vue`, `eslint`

### กรณีใช้ alias

- ชื่อ default ของ plugin ชนกับ native plugin (เช่น `jsdoc`, `react`)
- ชื่อ default ยาวเกินไป ต้องการย่อ
- ต้องการใช้ JS version ของ plugin ที่ Oxlint รองรับ native แต่ rule ที่ต้องการยังไม่ implement ใน native version

### ตัวอย่าง: ใช้ `eslint-plugin-jsdoc` โดยไม่ชนกับ native `jsdoc`

```json
{
  "jsPlugins": [
    { "name": "jsdoc-js", "specifier": "eslint-plugin-jsdoc" }
  ],
  "rules": {
    "jsdoc-js/check-alignment": "error"
  }
}
```

## ESLint Plugins ที่ทดสอบแล้ว (Conformance)

Oxlint รัน conformance tests กับ ESLint plugins ยอดนิยมหลายตัว:

- `eslint-plugin-cypress`
- `@e18e/eslint-plugin`
- `eslint-plugin-mocha`
- `eslint-plugin-playwright`
- `eslint-plugin-react-hooks` (บาง rules รองรับ native แล้ว ควรใช้ native แทน)
- `eslint-plugin-regexp`
- `eslint-plugin-sonarjs`
- `eslint-plugin-storybook`
- `@stylistic/eslint-plugin`
- `eslint-plugin-testing-library`

> รายการข้างต้นไม่ใช่ทั้งหมด — ESLint plugins อื่นๆ อีกมากก็ใช้งานได้

## API Support

Oxlint รองรับ ESLint API เกือบทั้งหมด:

- AST traversal และ exploration (`node.parent`, `context.sourceCode.getAncestors`)
- Fixes
- Rule options
- Selectors
- `SourceCode` APIs (`context.sourceCode.getText(node)`)
- `SourceCode` tokens APIs (`context.sourceCode.getTokens(node)`)
- Scope analysis
- Control flow analysis (code paths)
- Inline disable directives (`// oxlint-disable`)
- Language server (IDE) support + suggestions

### ยังไม่รองรับ

- Custom file formats และ parsers (เช่น Svelte, Vue, Angular)
- Lint rules ที่พึ่งพา TypeScript type-awareness

> ESLint APIs ที่ถูกลบใน ESLint v9 หรือก่อนหน้า จะไม่ถูก implement ส่วนใหญ่

## Sources

- https://oxc.rs/docs/guide/usage/linter/js-plugins
- https://oxc.rs/docs/guide/usage/linter/config
- https://oxc.rs/docs/guide/usage/linter/writing-js-plugins
