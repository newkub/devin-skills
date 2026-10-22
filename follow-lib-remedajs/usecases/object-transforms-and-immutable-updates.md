# Use Case — Typed Object Transforms and Immutable Updates

> Most application code is not array work but object work: shaping a DTO, reading a nested field with a fallback, and updating one deep key without cloning the whole tree by hand. Source: https://remedajs.com/docs (accessed 2026-10-20)

## 1. Shape a public DTO with an allowlist

```ts
import { omit, pick } from "remeda";

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  passwordHash: string;
  totpSecret: string | null;
};

const toPublicUser = (user: User) => pick(user, ["id", "name", "email", "avatarUrl"]);

const toAuditLog = (user: User) => omit(user, ["passwordHash", "totpSecret"]);
```

`pick` takes a list of keys and returns `Pick<User, ...>`, so the output type shrinks with the object — a field added later to `User` cannot leak through the DTO by default. Use `pick` for anything that leaves the process, and `omit` only for internal redaction where a denylist is acceptable.

## 2. Read a nested path with a fallback

```ts
import { defaultTo, prop } from "remeda";

const city = defaultTo(prop(user, "profile", "address", "city"), "Unknown");
```

`prop` is variadic and type-checked path by path: a wrong segment is a compile error rather than a runtime `undefined`. `defaultTo(data, fallback)` replaces the deprecated `pathOr` and only falls back for `null`/`undefined`, so `""` and `0` survive.

## 3. Use a runtime path only when it really is dynamic

```ts
import { prop, stringToPath } from "remeda";

const readColumn = (row: Record<string, unknown>, column: string) =>
  prop(row, ...stringToPath(column));

readColumn(row, "billing.address.city");
```

`stringToPath("a.b[0].c")` parses the Lodash-style string into the array `prop` expects. Keep this at the boundary (a config file, a user-provided column) — hardcoded paths should stay literal so the compiler can check them.

## 4. Transform values and keys in one pass

```ts
import { evolve, mapKeys, mapValues } from "remeda";

const prices = mapValues(priceBook, (cents) => cents / 100);

const headers = mapKeys(rawHeaders, (key) => key.toLowerCase());

const nextSettings = evolve(settings, {
  retries: (count) => count + 1,
  display: { label: (text) => text.trim() },
});
```

`mapValues` keeps the keys and rewrites the values; `mapKeys` keeps the values and rewrites the keys — its mapper receives `(key, value)`, so read the key first. `evolve` applies a function at each declared path and returns a new object; a function is skipped when its key is absent, which makes it safe for partial input.

## 5. Filter keys by value shape

```ts
import { omitBy, pickBy } from "remeda";

const defined = pickBy(payload, (value) => value !== undefined);

const withoutEmpty = omitBy(payload, (value) => value === "" || value === null);
```

These are the object counterparts of `filter`: `pickBy` keeps entries whose value passes, `omitBy` drops them. Use them to strip `undefined` before a network write or to drop empty query parameters, instead of a `for` loop with `delete`.

## 6. Update one deep key without mutating

```ts
import { mergeDeep, setPath } from "remeda";

const nextState = setPath(state, ["user", "preferences", "theme"], "dark");

const withDefaults = mergeDeep(defaultConfig, overrides);
```

`setPath` returns a new object with only the path rebuilt — the untouched siblings keep their references, which is what memoized selectors compare against. `merge` is shallow and replaces a nested object wholesale, so a partial override loses the sibling keys; reach for `mergeDeep` whenever the override is partial.

## 7. Round-trip through entries when the key decides

```ts
import { entries, fromEntries, pipe, filter } from "remeda";

const publicEnv = pipe(
  entries(process.env),
  filter(([key]) => key.startsWith("PUBLIC_")),
  fromEntries,
);
```

`entries()` and `keys()`/`values()` are data-last iterators and need the parentheses. `fromEntries` rebuilds the record after filtering, which is clearer than deleting keys on a copy.

## Verify

1. `tsc --noEmit` — `toPublicUser` returns no `passwordHash`, and a nested typo in `prop` fails to compile
2. A user with `city: undefined` — `defaultTo` returns `"Unknown"`; `city: ""` returns `""`
3. `stringToPath("billing.address.city")` — the parsed path matches the nested key order used by `prop`
4. `evolve` against an object missing `retries` — the function is not called and the key stays absent
5. `setPath` — the original `state` is unchanged, and untouched siblings are reference-equal
6. `mergeDeep` with a partial override — sibling nested keys survive; `merge` with the same input drops them
7. `/run-test` — a test asserting the DTO keys and the immutability of `setPath`

## Pitfalls

- `omit` used as a security boundary, so a new sensitive field is exposed until someone adds it to the list.
- `defaultTo` used as a truthiness check — it does not replace `0`, `""`, or `false`.
- `prop` called with a dotted string (`prop(user, "profile.city")`) — it treats the whole string as one key.
- Spreading the object before `setPath` (`{ ...state, ...setPath(...) }`), which re-copies the top level and nullifies the reference benefit.
- `merge` used where a deep merge was intended — nested objects are replaced, not merged.
- `mapKeys` mapper written as `(value, key)`, so keys are derived from values.
- `entries`/`keys`/`values` passed without `()`, which forwards the function itself.
- `evolve` expected to create missing keys — it only transforms keys that already exist.

## Related

- `references/apis.md`
- `best-practices/remedajs.md`
- `usecases/data-pipeline-pipe.md`
- `usecases/narrow-types-with-guards.md`
