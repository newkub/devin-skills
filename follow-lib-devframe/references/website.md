# Devframe Website

> Source: <https://devfra.me> (verified 2026-09-18)

## Identity

- **Name**: Devframe
- **Tagline**: "Build a devtool once. Mount it anywhere."
- **Pitch**: Framework-neutral foundation for building devtools — one definition becomes a Web Standard handler, a CLI, a static report, an MCP server, or a hub dock. "unplugin for devtools."
- **Author**: Anthony Fu (antfu) — MIT licensed
- **Repo**: <https://github.com/devframes/devframe>

## Key Properties

- `devframe` npm package, ESM-only, no Vite dependency
- `defineDevframe()` → portable `DevframeDefinition`; `initDevframe()` → Web Standard `Request → Response` handler
- Type-safe bidirectional RPC on birpc, validated by any Standard Schema validator (valibot/zod/arktype)
- Shared state: observable, immutable-by-default, patch-synced, survives reconnects
- Transports: WebSocket + SSE fallback (serverless/buffering proxies safe)
- Security: localhost bind + OTP trust handshake by default
- Agent-native: opt-in `agent` field exposes RPC functions over MCP (node) / WebMCP (browser)
- `@devframes/hub` headless composition: docks, terminals, messages, command palette
- First flagship hub UI: Vite DevTools (<https://devtools.vite.dev>)

## Audiences

- Devtool authors — one tool, every environment, no per-framework forks
- Framework/build-tool teams — shared devtools infrastructure
- Anyone wanting one source of truth for human UI + coding agents

## Docs Access

- Human docs: <https://devfra.me/guide>
- Raw markdown per page: `https://devfra.me/raw/<path>.md`
- Full corpus: <https://devfra.me/llms-full.txt>
