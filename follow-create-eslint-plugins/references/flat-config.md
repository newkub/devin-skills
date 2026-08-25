# ESLint Flat Config for Plugins Reference

อ้างอิงรูปแบบ ESLint flat config สำหรับ plugins ครอบคลุม `plugins` key, namespace assignment, รูปแบบ rule `namespace/rule-name` และตัวอย่าง configuration

## Configuration File

ESLint flat config ใช้ไฟล์ `eslint.config.js`, `eslint.config.mjs`, หรือ `eslint.config.cjs` วางใน root directory แล้ว export array ของ configuration objects:

```javascript
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
  { rules: { semi: "error" } },
]);
```

ถ้า project ใช้ `"type": "commonjs"` ใน `package.json` ต้องใช้ CommonJS format:

```javascript
// eslint.config.js
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    rules: {
      semi: "error",
    },
  },
]);
```

## Configuration Object Properties

แต่ละ configuration object มี properties หลัก:

- `name` — ชื่อ config object ใช้ใน error messages และ config inspector
- `files` — array ของ glob patterns ระบุ files ที่ config ใช้
- `ignores` — array ของ glob patterns ระบุ files ที่ยกเว้น
- `plugins` — object ที่ map ชื่อ plugin ไปยัง plugin object
- `rules` — object ที่ config rules
- `languageOptions` — `ecmaVersion`, `sourceType`, `globals`, `parser`, `parserOptions`
- `settings` — shared settings ส่งให้ทุก rule
- `extends` — array ของ configs ที่จะ inherit

## plugins Key

ใน flat config `plugins` เป็น object ที่ map ชื่อ namespace ไปยัง plugin object (ไม่ใช่ array เหมือน eslintrc):

```javascript
// eslint.config.js
import examplePlugin from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      example: examplePlugin, // "example" คือ namespace
    },
    rules: {
      "example/dollar-sign": "error", // namespace/rule-name
    },
  },
]);
```

### Inline Plugin Definition

สามารถ define plugin ได้โดยตรงใน config:

```javascript
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      customPlugin: {
        rules: {
          "my-rule": {
            meta: {
              type: "suggestion",
              docs: { description: "My custom rule" },
            },
            create(context) {
              return {
                Identifier(node) {
                  if (node.name === "foo") {
                    context.report({
                      node,
                      message: "Avoid using 'foo'",
                    });
                  }
                },
              };
            },
          },
        },
      },
    },
    rules: {
      "customPlugin/my-rule": "error",
    },
  },
]);
```

## Namespace Assignment

namespace คือ key ที่ใช้ใน `plugins` object เป็น prefix ของ rule name เมื่อเรียกใช้ใน `rules`:

- ถ้า `plugins: { myPlugin: pluginObj }` แล้ว rules อ้างอิงเป็น `myPlugin/rule-name`
- namespace ไม่จำเป็นต้องตรงกับ package name แต่ควรตั้งให้สื่อความหมาย

## Rule Format: `namespace/rule-name`

rules ของ plugin อ้างอิงด้วยรูปแบบ `namespace/rule-name`:

```javascript
rules: {
  "example/dollar-sign": "error",           // severity เป็น string
  "example/no-foo": ["error", "always"],    // severity + options
  "example/suggest-rule": "warn",           // ใช้ "warn" หรือ "off" ได้
}
```

severity มี 3 ระดับ: `"off"` (หรือ `0`), `"warn"` (หรือ `1`), `"error"` (หรือ `2`)

## Plugin Object Structure

plugin object มี `meta`, `configs`, `rules`, และ `processors`:

```javascript
const plugin = {
  meta: {
    name: "eslint-plugin-example",
    version: "1.2.3",
  },
  configs: {},
  rules: {
    "dollar-sign": {
      create(context) {
        // rule implementation
      },
    },
  },
};

// ใช้ Object.assign เพื่อให้ config อ้างอิง plugin ได้
Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        example: plugin,
      },
      rules: {
        "example/dollar-sign": "error",
      },
    },
  ],
});

// ESM
export default plugin;

// หรือ CommonJS
module.exports = plugin;
```

**สำคัญ:** ใช้ `Object.assign()` หลังประกาศ `plugin` เพื่อให้ config objects อ้างอิงตัวแปร `plugin` ได้

## การใช้ Configs จาก Plugin

ใช้ `extends` เพื่อโหลด predefined config จาก plugin ต้องประกาศ plugin ใน `plugins` ก่อน:

```javascript
import examplePlugin from "eslint-plugin-example";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      example: examplePlugin,
    },
    extends: ["example/recommended"],
  },
]);
```

หรือ insert config object โดยตรงใน `extends`:

```javascript
export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      example: examplePlugin,
    },
    extends: [examplePlugin.configs.recommended],
  },
]);
```

## Shared Settings

ใช้ `settings` เพื่อส่งข้อมูลให้ทุก rule ใน plugin:

```javascript
export default defineConfig([
  {
    settings: {
      sharedData: "Hello",
    },
    plugins: {
      customPlugin: {
        rules: {
          "my-rule": {
            create(context) {
              const sharedData = context.settings.sharedData;
              return { /* visitors */ };
            },
          },
        },
      },
    },
    rules: {
      "customPlugin/my-rule": "error",
    },
  },
]);
```

## Dual Export (Flat Config + Legacy)

plugin ที่ต้องรองรับทั้ง flat config และ eslintrc สามารถ export ทั้งสองรูปแบบ:

```javascript
const plugin = {
  meta: { name: "eslint-plugin-example", version: "1.2.3" },
  configs: {},
  rules: {
    "dollar-sign": { create(context) { /* ... */ } },
  },
};

Object.assign(plugin.configs, {
  // flat config format
  "flat/recommended": [{
    plugins: { example: plugin },
    rules: { "example/dollar-sign": "error" },
  }],
  // eslintrc format
  recommended: {
    plugins: ["example"],
    rules: { "example/dollar-sign": "error" },
  },
});

export default plugin; // ESM
// module.exports = plugin; // CommonJS
```

## ตัวอย่าง Flat Config แบบสมบูรณ์

```javascript
// eslint.config.js
import myPlugin from "./src/plugin.js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // global ignores
  { ignores: ["dist/**", "node_modules/**"] },

  // ประกาศ plugin และเปิด rules
  {
    files: ["**/*.js", "**/*.ts"],
    plugins: {
      myplugin: myPlugin,
    },
    rules: {
      "myplugin/no-foo": "error",
      "myplugin/prefer-bar": ["warn", { alias: "baz" }],
    },
  },

  // ใช้ predefined config จาก plugin
  {
    files: ["src/**/*.js"],
    plugins: { myplugin: myPlugin },
    extends: ["myplugin/recommended"],
  },
]);
```

## Sources

- https://eslint.org/docs/latest/use/configure/configuration-files
- https://eslint.org/docs/latest/extend/plugins
- https://eslint.org/docs/latest/extend/plugin-migration-flat-config
- https://eslint.org/docs/latest/use/configure/plugins
