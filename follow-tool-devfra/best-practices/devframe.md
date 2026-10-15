# Devframe — Best Practices

Build-a-devtool-once, mount-anywhere — SPA, CLI, static, MCP, hub

## Recommended Patterns

- Write the devtool as a single definition once — mounts: SPA, CLI, static HTML, MCP server, hub; choose the mount by consumer, do not rewrite per target
- Tool surface = commands + views + actions — define declaratively; the mount adapters handle runtime differences
- Keep tool logic pure/portable — never bind DOM/stdio directly in the core; render through devframe's adapter layer
- Export every wanted mount from one definition — the hub aggregates several devtools into one place

## Common Pitfalls

- Logic tied to one mount (e.g. direct `console.log` or DOM calls) = other mounts break — use the frame's abstractions
- State isolation: shared state across mounts = surprise; scope state per mount instance
- MCP mount: tool schemas must describe inputs clearly — MCP clients see no UI, so they must be self-documenting
- Static/CLI mounts have no persistent backend — features that need a server must degrade gracefully per mount

## Perf Notes

- Mount only what is needed — a heavy devtool on the CLI mount = slow startup; lazy-load views
- Hub mode: aggregating many tools is heavy — lazy-mount per tool on demand

## Do / Don't

| Do | Don't |
|----|-------|
| one definition → many mounts | duplicate tool logic per mount |
| adapter abstractions for I/O | direct DOM/stdio in core logic |
| degrade gracefully per mount | assume a backend always exists |
| self-documenting MCP schemas | rely on UI text in the MCP mount |
