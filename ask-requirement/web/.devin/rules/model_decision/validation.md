# Model Decision Rules

## Zod Validation

- Use Zod for all runtime validation
- Infer types from schemas with `z.infer`
- All MCP tool inputs must have Zod schemas
- Never use `any` when a Zod schema can be defined
- Use Zod v4 API consistently across all workspaces

## MCP Tools

- Each tool must have explicit input schema with Zod
- Tool descriptions must be clear and actionable
- Return content as array of `{ type: "text", text: string }`
- Use `StdioServerTransport` for stdio transport
- Tool names use kebab-case (e.g., `generate-requirement`)

## SolidJS

- Use `createSignal`, `createMemo` for reactivity
- Use `For` and `Show` for conditional rendering
- Never use React patterns - SolidJS has different reactivity
- Use `classList` for conditional classes
- Use `splitProps` for prop destructuring when needed
