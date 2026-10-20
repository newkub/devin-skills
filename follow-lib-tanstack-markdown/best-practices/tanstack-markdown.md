# TanStack Markdown — Best Practices

Markdown as a serializable document model — parsing, streaming, rendering

## Recommended Patterns

- Keep the document model pure data: typed nodes only, no components or functions, so it survives JSON transport
- Serialize the model for RSC/SSR payloads and re-render on the client instead of re-parsing the source
- Map node types to design-system components (headings, lists, tables) with a node-type registry
- Route `code` nodes to the highlighter and `link` nodes to the router's `<Link>` for SPA navigation
- Sanitize raw HTML nodes before rendering — markdown is untrusted input
- Tolerate incomplete documents while streaming: an unclosed fence or table renders as a pending block
- Incrementally parse appended chunks instead of re-parsing the entire document per token
- Cover edge cases in tests: unclosed fence mid-stream, nested lists, tables, inline code inside a heading

## Common Pitfalls

- Embedding React components in nodes breaks serialization and hydration
- Rendering raw HTML without sanitization is an XSS hole
- Assuming a complete document during streaming causes crashes or layout jumps
- Re-parsing the whole string on every chunk makes long outputs quadratic
- Losing stable keys on list items causes flicker as items stream in
- Reaching for this library on static markdown where a lighter parser is enough
- Hand-rolled regex post-processing of rendered HTML instead of node-level renderers

## Perf Notes

- Parse incrementally and memoize per-chunk work; keep a single document instance
- Virtualize or collapse very long documents only when rendering cost is measured
- Precompute static docs at build time and ship the model, not the parser

## Do / Don't

| Do | Don't |
|----|-------|
| pure data nodes | components embedded in the tree |
| sanitize HTML nodes | render raw HTML directly |
| incremental parse while streaming | re-parse the full text per chunk |
| node-type registry | regex over rendered markup |
| router link node renderer | full page reloads on internal links |
