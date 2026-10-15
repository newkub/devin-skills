# markdown-it — Plugin Ecosystem and Custom Rules

## Recommended Patterns

### Plugin Usage

- use `md.use(plugin, opts)` — a plugin is a function receiving the `md` instance + options
- popular plugins: `markdown-it-anchor` (heading links), `markdown-it-toc-done-right` (TOC), `markdown-it-footnote`, `markdown-it-container`, `markdown-it-attrs`
- find plugins via the npm keyword `markdown-it-plugin` — check last publish + issues before use (the ecosystem has many unmaintained plugins)
- plugin order matters — the anchor plugin must load before the toc plugin that reads anchors

### Custom Render Rules

- override output via `md.renderer.rules.<tokenType>` — e.g. `fence`, `heading_open`, `link_open`
- standard pattern: capture the default → wrap with extra logic → fall back to the default

```js
const defaultRender = md.renderer.rules.link_open ||
  ((tokens, idx, opts, env, self) => self.renderToken(tokens, idx, opts))
md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
  tokens[idx].attrSet('target', '_blank')
  tokens[idx].attrSet('rel', 'noopener')
  return defaultRender(tokens, idx, opts, env, self)
}
```

- write new rules (block/inline) via `md.block.ruler` / `md.inline.ruler` — when a renderer override isn't enough and you need a new token type
- toggle rules with `md.enable([...])` / `md.disable([...])` — disable unused rules to shrink the surface

### Plugin Development Guidelines

- a plugin is a function `(md, opts) => {}` — mutate the md instance inside
- prefer extending renderer rules first — write a parser rule only for genuinely new syntax
- keep per-render state in `env`, not in a closure — closure state leaks across renders
- test with both `md.render` and `md.parse` — renderer overrides don't affect parse

## Do / Don't

| Do | Don't |
|---|---|
| wrap the default rule then call the fallback | replace a rule and unintentionally drop the default behavior |
| check plugin maintenance before adopting | install an unmaintained plugin for production |
| use `env` for per-render state | closure state that leaks across renders |
| order plugins by dependencies | assume the order doesn't matter |
| audit plugin output when rendering untrusted input | trust every plugin to escape for you |

## Common Pitfalls

- assigning `md.renderer.rules.x` without keeping the fallback → default rendering disappears, the whole output changes
- a plugin that assumes `env` has certain fields → forgetting to pass `env` in `md.render(src)` → the plugin breaks silently
- using an unmaintained plugin → incompatibility with a new markdown-it major version
- anchor + toc plugin in the wrong order → the TOC has no anchors to link to
- a plugin that adds raw HTML → XSS hole when rendering user content

## Performance Notes

- plugins add cost per token — chaining many plugins = render slows down linearly
- `md.disable` on unused rules cuts parsing work
- plugins that walk every token (`core.ruler` rules) are expensive on large docs — write them to early-exit

## Ecosystem / Integration

- `@shikijs/markdown-it` for syntax highlighting — the async setup must be awaited before rendering
- the `markdown-it` token stream ≠ a full AST — for AST manipulation use unified/remark
- write plugins as pure functions taking `(md, opts)` — easy to test
- plugin conflicts: two plugins editing the same rule — the last-loaded wins — check the composed behavior
