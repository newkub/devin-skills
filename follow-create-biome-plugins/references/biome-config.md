# Biome Plugin Configuration Reference

Biome plugin configuration reference — `plugins` array, `includes`, glob patterns, และ `biome.jsonc` format

## Configuration File

ใช้ `biome.json` หรือ `biome.jsonc` (รองรับ comments) ที่ root ของโปรเจกต์

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "plugins": ["./custom-rules.grit"]
}
```

`$schema` เป็น optional แต่แนะนำเพื่อ autocomplete ใน editor

## `plugins` Array

รายการ GritQL plugins ที่จะ enable แต่ละ entry เป็น string path หรือ object ที่มี `path` และ optional `includes`

### Simple Path (String)

```jsonc
{
  "plugins": ["./my-plugin.grit"]
}
```

plugin จะทำงานบนทุกไฟล์ที่ linter ประมวลผล

### Object With `includes`

```jsonc
{
  "plugins": [
    {
      "path": "./react-plugin.grit",
      "includes": ["src/components/**", "!src/components/generated/**"]
    }
  ]
}
```

### Mixed Forms

ผสม string และ object ใน `plugins` array ได้

```jsonc
{
  "plugins": [
    "./global-rules.grit",
    {
      "path": "./react-plugin.grit",
      "includes": ["src/components/**"]
    },
    {
      "path": "./ts-only-plugin.grit",
      "includes": ["src/**/*.ts", "!src/**/*.test.ts"]
    }
  ]
}
```

## `plugins.<ITEM>.path`

Required — path ไปยัง plugin `.grit` file ใช้ relative path จาก root ของโปรเจกต์

```jsonc
{
  "plugins": [
    { "path": "./plugins/no-console.grit" }
  ]
}
```

## `plugins.<ITEM>.includes`

รายการ glob patterns สำหรับไฟล์ที่ plugin ควรทำงาน ใช้ negated globs (ขึ้นต้นด้วย `!`) สำหรับ exclusions

- เมื่อ omitted: plugin ทำงานบนทุกไฟล์ที่ linter ประมวลผล
- เมื่อ empty `[]`: plugin ไม่ทำงานบน any ไฟล์
- ไฟล์ต้อง match อย่างน้อย หนึ่ง positive pattern และไม่ถูก exclude โดย negated pattern

```jsonc
{
  "plugins": [
    {
      "path": "./css-plugin.grit",
      "includes": ["src/**/*.css", "!src/generated/**"]
    }
  ]
}
```

## Glob Syntax Reference

| Pattern | Description |
|---------|-------------|
| `*` | match zero หรือ more characters ไม่ match `/` |
| `` | recursively match directories และ files (ต้องเป็น path component เช่น `/file`) |
| `[...]` | match any character ใน brackets เช่น `[0-9]` |
| `[!...]` | negation ของ `[...]` — match characters ที่ไม่อยู่ใน brackets |
| `!pattern` | negated pattern — match เฉพาะเมื่อ path ไม่ match (ใช้เป็น exception เท่านั้น) |

### Glob Examples

```
dist/**              // dist/ folder และทุกไฟล์ข้างใน
!dist                // ignore dist/ folder และทุกไฟล์ข้างใน
**/test/**           // ทุกไฟล์ใต้ folder ชื่อ test ที่ any ตำแหน่ง
**/*.js              // ทุกไฟล์ .js ในทุก folder
src/**/*.ts          // ทุกไฟล์ .ts ใต้ src/
!src/**/*.test.ts    // exclude ไฟล์ .test.ts ใต้ src/
```

### Negated Patterns

negated patterns ประมวลผลตามลำดับ อนุญาตให้ระบุ exceptions ของ exceptions

```jsonc
{
  "files": {
    "includes": ["**", "!**/*.test.js", "**/special.test.js", "!test"]
  }
}
```

ใช้ `**` ก่อน negated pattern เสมอ ไม่เช่นนั้น negated pattern จะไม่ match any ไฟล์

## Complete Configuration Example

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "plugins": [
    "./plugins/no-console.grit",
    {
      "path": "./plugins/react-rules.grit",
      "includes": ["src/components/**"]
    },
    {
      "path": "./plugins/css-rules.grit",
      "includes": ["src/**/*.css", "!src/generated/**"]
    },
    {
      "path": "./plugins/ts-rules.grit",
      "includes": ["src/**/*.ts", "!src/**/*.test.ts"]
    }
  ],
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

## Running Plugins

```bash
bunx biome lint           // ตรวจสอบ plugins (แสดง suggestions)
bunx biome check          // lint + format
bunx biome lint --write   // apply safe rewrites
bunx biome lint --write --unsafe  // apply safe + unsafe rewrites
```

## Suppressing Plugin Diagnostics

ใช้ suppression comment สำหรับ plugin diagnostics

```javascript
// biome-ignore lint/plugin: <reason>
Object.assign({}, defaultConfig, userConfig);
```

## Sources

- https://biomejs.dev/reference/configuration/
- https://biomejs.dev/linter/plugins/
- https://biomejs.dev/recipes/gritql-plugins/
