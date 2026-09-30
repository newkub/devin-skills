| key | value |
|---|---|
| install | `bun add zod` |
| version | 4.6.4 |
| package registry | https://www.npmjs.com/package/zod |
| repository | https://github.com/colinhacks/zod |
| docs | https://zod.dev |

| commands | description | default | options |
|---|---|---|---|
| `z.object({...})` | Define object schema | — | `.strict()`, `.loose()`, `.partial()` |
| `z.infer<typeof Schema>` | Infer TypeScript type from schema | — | (none) |
| `schema.parse(input)` | Validate or throw `ZodError` | — | (none) |
| `schema.safeParse(input)` | Validate, return `{ success, data, error }` | — | (none) |
| `z.string()/.number()/...` | Primitive schemas | — | `.min()`, `.max()` refinements |
| `z.email()`/`z.uuid()`/... | String format validators (top-level in v4) | — | (none) |
| `error.flatten()` | Field-level error map `{ fieldErrors, formErrors }` | — | (none) |
