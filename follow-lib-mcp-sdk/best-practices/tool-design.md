# MCP SDK — Tool Design and Schemas

## Recommended Patterns

### Naming and Description

- tool name = verb-noun snake_case — `get_user`, `list_issues`, `create_ticket` — the LLM picks tools from name + description
- write the description for the LLM to understand: what it does, when to use it, what input/output are — every tool needs a clear description
- title (human-readable) is separate from name — `title` for UI, `name` for machines
- few broad tools beat many narrow ones — the LLM gets confused by overlapping tools (~10-20 tools per server is the sweet spot)

### Input Schema (zod)

- `inputSchema` is a zod raw shape: `{userId: z.string().describe('...'), limit: z.number().optional()}` — `.describe()` on every field helps the LLM map args
- pick narrow types: `z.enum` instead of free strings, `z.number().int().positive()` instead of `z.number()`
- optional fields + defaults when sensible — less friction, the LLM doesn't have to guess
- flatten nested objects when possible — deep nesting increases validation errors

### Output / Response

- always return `{content: [{type: 'text', text: ...}]}` — text is the primary format
- `structuredContent` + `outputSchema` when the client must parse the response programmatically — dual format: text summary + structured data
- cap the response size — truncate/paginate results; an LLM context is not a database dump
- annotations: `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` — help client UX (confirm destructive ops)

### Elicitation

- a tool needs more input mid-execution → elicitation — `mode: 'form'` for non-sensitive, `mode: 'url'` for secrets/OAuth
- use it when the input schema isn't complete and the user must be asked — better than failing with a validation error

## Do / Don't

| Do | Don't |
|---|---|
| `describe()` every field in inputSchema | bare schemas the LLM must guess at |
| `z.enum` for constrained values | free `z.string()` when the values are limited |
| return `isError: true` + a text message | throwing or returning a malformed response |
| paginate/truncate list results | returning ten thousand rows in one shot |
| set `readOnlyHint`/`destructiveHint` | leaving the client unaware the tool mutates state |
| clear, consistent names | vague names like `handle_data`, `process_stuff` |

## Common Pitfalls

- empty/too-short descriptions → the LLM picks the wrong tool or calls with wrong args
- oversized responses → LLM context overflow, truncated mid-way — cap + paginate always
- a tool with side effects but no `destructiveHint` → the client auto-runs it without confirmation
- passing inputSchema as a zod object instead of a raw shape → registration fails (`{field: z.string()}` not `z.object({...})` in registerTool)
- creating one tool per CRUD endpoint → tool-count explosion; merge into parameterized tools

## Performance Notes

- handlers should be async + fast — send long ops' updates via `reportProgress`
- avoid serial API calls in a handler — `Promise.all` for independent fetches
- cache external API responses in the handler when appropriate — tools get called often
- schema validation happens before the handler — invalid input fails fast without wasted time

## Ecosystem / Integration

- complex schemas → `/follow-lib-zod`
- test with the MCP Inspector — interact with tools/resources/prompts through the UI
- tools that need auth → the OAuth flow via SDK auth helpers or elicitation `mode: 'url'`
- resources/prompts complement tools: resource = data source, prompt = reusable template — not everything is a tool
