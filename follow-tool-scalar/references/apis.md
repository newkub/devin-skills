# Tool Scalar API & Dependencies

## Install

```sh
# API reference renderer (project dependency)
bun add @scalar/api-reference
# CLI สำหรับ validate/bundle OpenAPI
bun add -D @scalar/cli
```

## Version

- `@scalar/api-reference`: `1.68.0` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/@scalar/api-reference)
- [Repository](https://github.com/scalar/scalar)

## Dependencies

- `@scalar/api-reference` ใช้กับ framework integrations เช่น `@scalar/elysiajs-api-reference`, `@scalar/hono-api-reference`, `@scalar/nestjs-api-reference`, `@scalar/express-api-reference`
- ใช้กับ Elysia → plugin `@elysiajs/openapi` มี Scalar UI built-in

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `bun add @scalar/api-reference` | Install renderer | latest | framework subpath เช่น `/elysiajs` |
| `scalar validate` | Validate OpenAPI doc | file arg | --watch |
| `scalar bundle` | Bundle $refs | file arg | --output |
| `scalar format` | Format OpenAPI | file arg | --write |

## Source

- Official docs: https://scalar.com / https://guides.scalar.com
- Description: API documentation renderer + OpenAPI toolchain.
