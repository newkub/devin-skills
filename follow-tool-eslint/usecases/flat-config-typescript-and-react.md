# Use Case — Flat Config for TypeScript + React

> One flat config with type-aware rules, file-scoped plugins, and ignores that actually work. Source: https://eslint.org/docs/latest/use/configure/configuration-files (accessed 2026-10-20)

## 1. Compose from shareable configs

```js
// eslint.config.js
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"

export default defineConfig([
  { ignores: ["dist/**", "coverage/**", ".wrangler/**", "*.config.js"] },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },

  {
    files: ["**/*.tsx"],
    plugins: { "react-hooks": reactHooks },
    rules: { "react-hooks/rules-of-hooks": "error", "react-hooks/exhaustive-deps": "warn" },
  },
])
```

`projectService: true` finds the nearest `tsconfig.json` per file — no `project` array to keep in sync across workspaces.

## 2. Scope type-aware rules

Type-aware rules are the expensive ones. Keep `recommendedTypeChecked` limited to source files and exclude generated or config code:

```js
{ files: ["**/*.config.{ts,js}", "**/scripts/**"], extends: [tseslint.configs.disableTypeChecked] }
```

## 3. Fix and verify

```bash
bunx eslint . --fix            # apply safe fixes locally
bunx eslint . --max-warnings=0 # what CI runs
```

## Pitfalls

- `.eslintrc.*` still present → ESLint 10 ignores it and silently lints nothing; delete it and keep one flat config.
- Type-aware rules without `projectService`/`project` → "parserOptions.project has been set" errors for every file.
- `ignores` inside a config object alongside `files` → it applies only to that object; put global `ignores` in its own entry first.
- Running `--fix` in CI → the job passes while the committed code stays unfixed; fix locally instead.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/flat-config.md`
- `usecases/lint-gate-in-ci.md`
