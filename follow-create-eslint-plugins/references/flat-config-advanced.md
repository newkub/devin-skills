# ESLint Flat Config Advanced Reference

อ้างอิงการใช้งาน ESLint flat config ขั้นสูง ครอบคลุมการใช้ configs จาก plugin, shared settings, dual export, และตัวอย่างแบบสมบูรณ์

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
