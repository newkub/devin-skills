| key | value |
|-----|-------|
| package | `tstyche` |
| install | `bun add -D tstyche` / `npm i -D tstyche` |
| stable version | `7.2.5` (verified 2026-10-15) |
| license | MIT |
| engines | `node >= 22` |
| peer dependency | `typescript >= 5.4` (TS7 not yet supported — falls back to 6.0) |
| docs | https://tstyche.org/ |
| repository | https://github.com/tstyche/tstyche |
| config file | `tstyche.json` (root or `--config <path>`; comments/unquoted keys/trailing commas allowed) |
| config schema | `https://tstyche.org/schemas/config.json` (versioned: `config-7.0.json`; local: `./node_modules/tstyche/schemas/config.json`) |
| test file globs (default) | `**/*.tst.*`, `**/__typetests__/*.test.*`, `**/typetests/*.test.*` |
| fixture globs (default) | `**/__fixtures__/*.{ts,tsx}`, `**/fixtures/*.{ts,tsx}` |
| TS version store | global cache — `%LocalAppData%/TSTyche` (Windows), `$XDG_DATA_HOME/TSTyche` / `$HOME/.local/share/TSTyche` (Linux), `$HOME/Library/TSTyche` (macOS) |
| official agent skills | `tstyche/tstyche-skills` (`npx skills add tstyche/tstyche-skills`) |

## Exports (from `tstyche`)

| export | kind | purpose |
|--------|------|---------|
| `expect` / `expect<T>()` / `expect(expr)` | function | starts an assertion; must be followed by `.type` + matcher, optional `.not`, optional run flag |
| `test(name, cb)` / `it(name, cb)` | function | defines a test; name must be a string literal; flags `.only` `.skip` `.todo` |
| `describe(name, cb)` | function | groups tests, nestable; same flags, inherited |
| `_` | type placeholder | fills required type arguments in `.toBeInstantiableWith<...>` checks |
| `omit(obj, ...keys)` / `pick(obj, ...keys)` | function | reshapes an expression's type (like `Omit`/`Pick`); returns the same object at runtime |

## Matchers (after `.type`, optional `.not` prefix)

| matcher | signature | checks |
|---------|-----------|--------|
| `.toBe()` | `.toBe<T>()` / `.toBe(target)` | source type identical to target (structural) |
| `.toBeAssignableTo()` | `.toBeAssignableTo<T>()` / `(target)` | source assignable to target |
| `.toBeAssignableFrom()` | `.toBeAssignableFrom<T>()` / `(target)` | source assignable from target |
| `.toBeCallableWith()` | `(...args)` | function callable with arguments |
| `.toBeConstructableWith()` | `(...args)` | class constructable with arguments |
| `.toBeInstantiableWith()` | `.toBeInstantiableWith<[T, U]>()` | generic instantiable with tuple of type args |
| `.toHaveProperty()` | `.toHaveProperty(key)` | property key exists on type |
| `.toAcceptProps()` | `.toAcceptProps({...})` | JSX component accepts props (`.tsx` + `jsx` option only) |
| `.toBeApplicable` | used as a decorator | decorator applicable to class/member |
| `.toRaiseError()` | deprecated | removed in favor of ability matchers — never use |

## Configuration options (`tstyche.json`)

| option | default | type | meaning |
|--------|---------|------|---------|
| `checkDeclarationFiles` | `true` | boolean | check project `.d.ts` files for type errors (disable if `tsc` already does) |
| `checkSuppressedErrors` | `true` | boolean | verify `@ts-expect-error` messages in test files |
| `failFast` | `false` | boolean | stop after first failure |
| `fixtureFileMatch` | see globs above | string[] | fixture file globs |
| `quiet` | `false` | boolean | only errors/warnings in output |
| `rejectAnyType` | `true` | boolean | fail when `any` reaches `expect()`/matcher implicitly |
| `rejectNeverType` | `true` | boolean | fail when `never` reaches `expect()`/matcher implicitly |
| `reporters` | `["list", "summary"]` | string[] | `dot` / `list` / `summary` / package / path |
| `target` | `"*"` | string | TS version(s)/ranges, `\|\|`-separated; `*` = local installed else latest |
| `testFileMatch` | see globs above | string[] | test file globs (brace expansion supported) |
| `tsconfig` | `"findup"` | string | `findup` / `baseline` / path / inline JSON |
| `verbose` | `false` | boolean | detailed logging |

## Environment variables

| variable | default | meaning |
|----------|---------|---------|
| `TSTYCHE_FETCH_RETRIES` | `2` | HTTP retries for registry requests |
| `TSTYCHE_FETCH_TIMEOUT` | `30` | seconds before HTTP timeout (`0` disables) |
| `TSTYCHE_NO_COLOR` | `NO_COLOR` passthrough | disable colored output |
| `TSTYCHE_NO_INTERACTIVE` | `!isTTY` | disable interactive elements |
| `TSTYCHE_NPM_REGISTRY` | `https://registry.npmjs.org` | registry base URL for TS metadata/tarballs |
| `TSTYCHE_STORE_PATH` | per-OS path above | where fetched typescript versions are cached |
| `TSTYCHE_TYPESCRIPT_MODULE` | `typescript` | module/path used as installed TypeScript |
