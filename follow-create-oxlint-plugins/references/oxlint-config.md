# Oxlint Configuration Reference

เอกสารอ้างอิงการกำหนดค่า Oxlint สำหรับการเปิดใช้งาน plugins ทั้ง built-in (native) และ JavaScript plugins
ครอบคลุมรูปแบบ config file, ฟิลด์ `plugins` / `jsPlugins`, `categories`, reserved plugin names และ CLI flags

## รูปแบบ Config File

Oxlint รองรับ config file สองรูปแบบหลัก:

| รูปแบบ | ชื่อไฟล์ | Runtime | หมายเหตุ |
| --- | --- | --- | --- |
| JSON | `.oxlintrc.json` / `.oxlintrc.jsonc` | Standalone binary หรือ Node | รองรับ comments (jsonc) |
| TypeScript | `oxlint.config.ts` / `oxlint.config.mts` | Node-based `oxlint` package | ต้องมี Node v22.18+ หรือ v24+ |

สร้าง starter config:

```sh
oxlint --init
```

ระบุ config โดยตรง (ปิด nested config lookup):

```sh
oxlint -c ./.oxlintrc.json
# หรือ
oxlint --config ./.oxlintrc.json
```

ข้อจำกัด: ใช้ได้เพียงหนึ่ง config file ต่อไดเรกทอรี — JSON และ TypeScript ไม่สามารถอยู่ร่วมกันได้

### ตัวอย่าง `.oxlintrc.json`

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "categories": {
    "correctness": "warn"
  },
  "rules": {
    "eslint/no-unused-vars": "error"
  }
}
```

### ตัวอย่าง `oxlint.config.ts`

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
  },
  rules: {
    "eslint/no-unused-vars": "error",
  },
});
```

`defineConfig` ให้ typing สำหรับ config object — default export ต้องเป็น object

## Top-level Fields ที่เกี่ยวข้องกับ Plugins

| ฟิลด์ | ความหมาย |
| --- | --- |
| `plugins` | เปิดใช้งาน built-in plugins (native, เขียนด้วย Rust) |
| `jsPlugins` | กำหนดค่า JavaScript plugins (alpha, เขียนด้วย JS) |
| `categories` | เปิด/ปิดกลุ่ม rules ตามความตั้งใจ |
| `rules` | เปิด/ปิด rule แต่ละตัว พร้อมตั้ง severity และ options |
| `overrides` | ใช้ config ต่างกันตาม file pattern |
| `settings` | การตั้งค่าระดับ plugin ที่ใช้ร่วมโดยหลาย rules |

## ฟิลด์ `plugins` (Built-in / Native)

Plugins ขยายชุด rules ที่ใช้ได้ Oxlint รองรับหลาย plugins แบบ native ใน Rust โดยไม่ต้องพึ่ง JavaScript dependency tree

การตั้งค่า `plugins` จะ **overwrite** default plugin set — ต้องระบุทุก plugin ที่ต้องการเปิด:

```json
{
  "plugins": ["unicorn", "typescript", "oxc"]
}
```

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["unicorn", "typescript", "oxc"],
});
```

ปิด default plugins ทั้งหมด:

```json
{
  "plugins": []
}
```

## ฟิลด์ `jsPlugins` (JavaScript, Alpha)

ใช้สำหรับ ESLint plugins ที่เป็น JavaScript — ดูรายละเอียดเต็มที่ `js-plugins.md`

```json
{
  "jsPlugins": [
    "eslint-plugin-playwright",
    { "name": "my-eslint-react", "specifier": "eslint-plugin-react" }
  ]
}
```

> JS plugins อยู่ในสถานะ alpha และไม่อยู่ภายใต้ semver

## Categories

Categories เปิด/ปิดชุด rules ที่มีความตั้งใจคล้ายกัน โดย default Oxlint เปิด `correctness`

| Category | คำอธิบาย |
| --- | --- |
| `correctness` | Code ที่ผิดหรือไร้ประโยชน์อย่างชัดเจน |
| `suspicious` | Code ที่น่าจะผิดหรือไร้ประโยชน์ |
| `pedantic` | Rules เข้มงวดพิเศษ อาจมี false positives |
| `perf` | Rules ที่ปรับปรุง runtime performance |
| `style` | Rules ด้าน idiomatic และความสอดคล้องของ style |
| `restriction` | Rules ที่ห้าม pattern หรือ feature เฉพาะ |
| `nursery` | Rules ที่กำลังพัฒนา อาจเปลี่ยนแปลง |

```json
{
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "pedantic": "off"
  }
}
```

Severity values สำหรับ categories และ rules: `"off"` / `"allow"`, `"warn"`, `"error"` / `"deny"`

## Reserved Plugin Names

ชื่อ plugin ต่อไปนี้ reserved เพราะ implement แบบ native ใน Rust หากต้องการใช้ JavaScript version ต้องกำหนด alias ผ่าน `jsPlugins`

| Plugin name | Default | Source |
| --- | --- | --- |
| `eslint` | Yes | ESLint core rules |
| `typescript` | Yes | typescript-eslint |
| `unicorn` | Yes | eslint-plugin-unicorn |
| `oxc` | Yes | Oxc-specific rules |
| `react` | No | eslint-plugin-react / react-hooks / react-refresh |
| `react-perf` | No | eslint-plugin-react-perf |
| `nextjs` | No | @next/eslint-plugin-next |
| `import` | No | eslint-plugin-import |
| `jsdoc` | No | eslint-plugin-jsdoc |
| `jsx-a11y` | No | eslint-plugin-jsx-a11y |
| `node` | No | eslint-plugin-n |
| `promise` | No | eslint-plugin-promise |
| `jest` | No | eslint-plugin-jest |
| `vitest` | No | @vitest/eslint-plugin |
| `vue` | No | eslint-plugin-vue |

## CLI Flags ที่เกี่ยวข้อง

| Flag | ความหมาย |
| --- | --- |
| `--init` | สร้าง starter config |
| `-c` / `--config <path>` | ระบุ config file (ปิด nested config lookup) |
| `--<plugin-name>-plugin` | เปิด plugin ผ่าน CLI เช่น `--import-plugin` |
| `--disable-<plugin-name>-plugin` | ปิด default plugin ผ่าน CLI เช่น `--disable-unicorn-plugin` |
| `-A` / `--allow` | ตั้ง rule/category เป็น off |
| `-W` / `--warn` | ตั้ง rule/category เป็น warn |
| `-D` / `--deny` | ตั้ง rule/category เป็น error |
| `--type-aware` | เทียบเท่า `options.typeAware` |
| `--max-warnings <n>` | เทียบเท่า `options.maxWarnings` |

ตัวอย่าง: เปิด import plugin และตั้ง correctness เป็น error

```sh
oxlint --import-plugin -D correctness -W suspicious
```

ตัวอย่าง: ปรับ severity หลาย rules จาก CLI (apply จากซ้ายไปขวา)

```sh
oxlint -D no-alert -W oxc/approx-constant -A no-plusplus
```

> CLI flags มี precedence เหนือ config เมื่อมีทั้งสองที่

## Sources

- https://oxc.rs/docs/guide/usage/linter/config
- https://oxc.rs/docs/guide/usage/linter/plugins
- https://oxc.rs/docs/guide/usage/linter/config-file-reference
- https://oxc.rs/docs/guide/usage/linter/cli
