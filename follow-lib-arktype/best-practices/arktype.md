# Arktype — Best Practices

Recommended patterns for Arktype — runtime validation that infers TypeScript types from a single definition

## Recommended Patterns

- Write types with the `type()` DSL string as the main approach — concise and infers the TS type automatically: `type("{ name: string, age?: number }")`
- Use `type.infer` / `typeof t.infer` for the static type — the definition is the single source of truth (don't write a separate interface)
- Group related types with `scope()` — share aliases and reference each other within one scope
- Validate at the boundary only (API input, env, external data) — internal data doesn't need re-validation
- Use `.assert` for throw-on-invalid, `.allows` for a boolean check — choose per the error strategy

## Common Pitfalls

- `type()` throws immediately at compile time when the definition is wrong — parse errors are build-time not runtime; always test the definitions
- Arktype's traversal errors are a structured `ArkErrors` — iterate and format yourself, don't rely on a single raw `error.message` string
- Morphs (`.to()`/pipe) change the output type — check that downstream accepts the morphed type, not the input type
- Optional vs default differ: `key?:` = may be absent, `key = default` (in the scope syntax) = fills the value — pick what matches the intent

## Perf Notes

- Arktype JIT-compiles validators — compile once then reuse the `type` object; never create `type()` inside a loop/hot path
- `.assert`/`.allows` are faster than try/catch `parse` — use as appropriate

## Do / Don't

| Do | Don't |
|----|-------|
| `type()` + `type.infer` single source | write interface + validator separately |
| `scope()` for type families | scattered aliases across files |
| validate at the boundary only | re-validate at every function layer |
| reuse compiled `type` | `type()` inside a request handler |
