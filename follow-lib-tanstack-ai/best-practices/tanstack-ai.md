# TanStack AI — Best Practices

Provider-agnostic AI SDK — server adapters, streaming chat, tools, agent loops

## Recommended Patterns

- Keep the adapter and `chat()` on the server; the client only receives a stream through `useChat` + an SSE connection
- Declare tools with `toolDefinition` and a Standard Schema `inputSchema` so argument types and validation are shared
- Side-effecting tools execute with `.server(fn)`; interactive/UI tools stay on the client behind an approval step
- Render `message.parts` by type (text, tool-call, tool-result) instead of parsing raw text
- Use `outputSchema` when the model must return structured JSON
- Bound agent loops with `maxIterations` and always wire cancellation (`stop()`) into the UI
- Swap providers by changing the server adapter import only — the client contract stays the same
- Validate tool input again inside the handler before touching the database

## Common Pitfalls

- Importing a provider adapter or API key into a client-reachable module leaks credentials into the bundle
- Reading `message.content` text and ignoring parts loses tool calls and their results
- An unbounded agent loop can call tools forever and burn quota
- Client-side execution of a destructive tool puts trust in the browser
- Buffering the whole stream before rendering defeats streaming UX and hides latency
- Assuming tool-call arguments arrive complete — partial JSON is normal mid-stream
- Treating the 0.x API as stable across minor upgrades

## Perf Notes

- Stream tokens to the UI as they arrive; do not accumulate into one render
- Send only the tools a request needs — every tool schema costs prompt tokens
- Use a smaller model for routing/classification and the larger one for generation

## Do / Don't

| Do | Don't |
|----|-------|
| adapter + keys server-side | provider SDK imported in the client |
| render by `parts` | parse concatenated text |
| `.server()` for side effects | destructive tool executed client-side |
| approval step for risky tools | auto-executing every tool call |
| bounded `maxIterations` | open-ended agent loop |
