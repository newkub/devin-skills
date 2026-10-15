# Comark — Best Practices

Parse once, render anywhere — `MarkdownDocument` separates parse from render target

## Recommended Patterns

- Parse on the server/build then serialize the `MarkdownDocument` to render — content outlives the stack
- Pick the renderer by the real target: `@comark/html` (SSG/RSS/email), `@comark/ansi` (CLI), framework component (apps)
- Code highlighting via `comark/plugins/shiki` — already multi-theme + on-demand langs (see `/follow-lib-shiki`); smaller/faster → `comark/plugins/rangi` (rangi, ~13kB sync, dual-theme inline colors — suits dev tools/snippet preview)
- Register only the components you need — content is data, not executable code
- Streaming AI output → enable the streaming prop; auto-close makes every frame render completely
- Single-page docs from a README → dispatch to `/follow-create-web-docs` instead of wiring it yourself

## Common Pitfalls

- Vue `<Markdown>` outside `<Suspense>` → doesn't render / errors — always wrap
- components/attributes/frontmatter are opt-in — assume standard CommonMark works first, enable extras when needed
- Most markdown-it plugins work, but check compat — markdown-exit is a TS rewrite
- Untrusted content → sanitize the HTML output another layer (`/follow-lib-dompurify`) even though components are gated
- Streaming off → mid-token frames show raw syntax — always enable the prop for chat/AI UI

## UX/UI Integration

- Use in `/improve uxui` when: markdown content renders wrong, docs lack callouts/components, chat streaming shows raw markdown, code blocks have no highlighting (pair shiki)
- Attributes syntax `{.class}` → bind design-system classes (e.g. UnoCSS utilities) on content without writing HTML
- Component syntax → callouts, cards, alerts, embeds that stay consistent with the design system

## Do / Don't

| Do | Don't |
|----|-------|
| parse once → render many targets | re-parse per output target |
| register components explicit | trust content-embedded code |
| streaming prop for AI/chat UI | render raw chunks with auto-close off |
| official plugins before writing your own | rebuild shiki/mermaid/toc yourself |
| serialize `MarkdownDocument` for cache | re-parse every request |
