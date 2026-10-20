# Use Case — Type-Test a Public API Contract

> Pin the inferred types of a library's exports so a refactor cannot silently widen them. Source: https://tstyche.org (accessed 2026-10-20)

## 1. Install and name the files so runtime runners skip them

```bash
bun add -D tstyche
```

Name type tests `*.tst.ts`. The default globs also match `__typetests__/*.test.*` and `typetests/*.test.*`, but a `.tst.ts` suffix keeps `vitest` and `bun test` from treating them as runtime suites — those files never execute.

## 2. Keep the config to overrides only

```json
{
  "$schema": "https://tstyche.org/schemas/config.json"
}
```

That is a complete, valid config. `testFileMatch`, `reporters`, and `tsconfig` already have defaults; add a key only when the project deviates.

## 3. Assert the shape and the call surface

```ts
// src/query-params.tst.ts
import { describe, expect, test } from "tstyche";
import { parseQuery, type QueryParams } from "./index.js";

describe("parseQuery", () => {
  test("returns the declared shape", () => {
    expect(parseQuery({ page: "2" })).type.toBe<QueryParams>();
  });

  test("accepts the documented input", () => {
    expect(parseQuery).type.toBeCallableWith({ page: "2", sort: "name" });
  });

  test("rejects a numeric page", () => {
    expect(parseQuery).type.not.toBeCallableWith({ page: 2 });
  });
});
```

`.toBe<T>()` is structural identity, `.toBeAssignableTo<T>()` allows a subtype. Use identity for a return type you intend to freeze, assignability when callers legitimately narrow.

## 4. Prefer negated matchers over `@ts-expect-error`

The negated ability matcher erases the assertion, re-checks the file, and requires that specific error. `@ts-expect-error` suppresses whatever fails on the line, so a lost import or a renamed export passes the test. Reserve `@ts-expect-error <message>` for the rare case where only the message matters, and turn on `checkSuppressedErrors` so the text is verified.

## 5. Wire it as a normal test layer

```json
{
  "scripts": {
    "test:types": "tstyche"
  }
}
```

1. `bunx tstyche --showConfig` — confirm the resolved config is what you wrote
2. `bunx tstyche` — the suite passes
3. Break an export on purpose (change a parameter type) and confirm the test fails — a type test that cannot fail is decoration
4. `/run-check` and `/run-test` still pass; the type files must not disturb the runtime suite

## Pitfalls

- `rejectAnyType`/`rejectNeverType` turned off to make a test pass, which hides every accidental `any` in the file.
- Asserting `.toBeAssignableTo<any>()`, which passes for every type including the broken one.
- Putting type tests in `src/` with a `.test.ts` name, so vitest tries to execute them and fails on the matcher syntax.
- Duplicating the same assertion in both a vitest `expectTypeOf` block and a tstyche file — one owner per file type.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/tstyche.md`
- `usecases/multi-version-target.md`
