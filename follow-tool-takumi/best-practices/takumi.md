# Takumi — Best Practices

JSX/HTML → images/PDFs without a browser — OG images, social cards, SVG, animations

## Recommended Patterns

- OG image spec: `1200×630` PNG/WebP — pair with the `summary_large_image` card
- Use `ImageResponse` (`takumi-js/response`) in route handlers — a drop-in replacement for `next/og`
- Register fonts once on a `Renderer` when rendering many images — don't load a font on every request
- The `googleFonts` helper fetches families in a single request — variable fonts via `axes` make `font-variation-settings` work
- Style with `tw="..."` (Tailwind) for fast layout + `style={{}}` for what Tailwind doesn't cover (gradient text, clip-path)
- Cache output by content hash — OG images are deterministic, no need to re-render on every request

## Common Pitfalls

- Never reads system fonts — the built-in is only Geist Latin; Thai/CJK/Arabic must always go through `fonts` or glyphs will be missing
- Migrating from Satori: Takumi's bare `<div>` defaults to block layout (Satori was flex) — keep the explicit flex styles
- The CSS subset is not a full browser — check the support matrix (grid, position, filters, mask) before designing
- Edge runtimes pick the WASM binding automatically — bundle size is larger than native; test cold start on Workers/Edge
- Animation output (WebP/APNG/GIF) is large — limit frames/duration; prefer WebP for size

## SEO Integration

- Use in `/improve seo` for missing or static `og:image`/`twitter:image` findings — generate per-page OG dynamically
- Route handler deterministic: input = title/slug → output = image; cache by slug hash
- Test with social debuggers (Facebook/Twitter card validators) after deploy

## Do / Don't

| Do | Don't |
|----|-------|
| preload fonts on `Renderer` | load a font on every render call |
| `1200×630` for OG images | render other sizes without checking platform spec |
| cache image bytes by content hash | render again on every request |
| check the CSS support matrix before designing | assume browser-parity CSS |
| `tw` + inline `style` mixed as needed | force Tailwind for everything |
