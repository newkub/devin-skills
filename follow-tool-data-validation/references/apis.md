# Tool Validator API & Dependencies

## Install

```sh
bun add zod
```

## Version

- Latest: `4.6.4` (verified 2026-09-13)
- [Package Registry](https://www.npmjs.com/package/zod)
- [Repository](https://github.com/colinhacks/zod)

## Dependencies

- Zero external dependencies — works in Node.js and all modern browsers
- Requires `strict: true` in `tsconfig.json`; tested against TypeScript v5.5+

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `z.object({...})` | Define object schema | — | `.strict()`, `.loose()`, `.partial()` |
| `z.infer<typeof Schema>` | Infer TypeScript type from schema | — | (none) |
| `schema.parse(input)` | Validate or throw `ZodError` | — | (none) |
| `schema.safeParse(input)` | Validate, return `{ success, data, error }` | — | (none) |
| `z.string()/.number()/...` | Primitive schemas | — | `.min()`, `.max()` refinements |
| `z.email()`/`z.uuid()`/... | String format validators (top-level in v4) | — | (none) |
| `error.flatten()` | Field-level error map `{ fieldErrors, formErrors }` | — | (none) |

## Source

- Official docs: https://zod.dev
- Description: TypeScript-first schema validation with static type inference
