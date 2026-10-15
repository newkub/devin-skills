# DOMPurify — Best Practices

Safely sanitize untrusted HTML — the correct XSS prevention

## Recommended Patterns

- Sanitize **every** untrusted HTML before injecting: `DOMPurify.sanitize(dirty)` — user input, markdown render output, CMS content
- The default config is safe enough for most cases — tighten when the threat model is higher: `FORBID_TAGS`, `FORBID_ATTR`, `ALLOWED_TAGS` allowlist
- Use `RETURN_TRUSTED_TYPE: true` when the app uses a Trusted Types CSP — sanitize then get TrustedHTML directly
- Hooks (`addHook`) for enforcing extra rules — e.g. `afterSanitizeAttributes` adds `rel="noopener"` to `target="_blank"`
- Server-side: use via `dompurify` + `jsdom` — sanitize on both server and client if data flows both ways

## Common Pitfalls

- After sanitizing, don't inject via `innerHTML` unless necessary — prefer `textContent` when no markup is needed at all
- `sanitize()` returns a string — don't double-sanitize a result that was already sanitized (idempotent but wastes perf)
- Custom elements/web components: removed by default — requires `CUSTOM_ELEMENT_HANDLING` if you intend to use them
- SVG/MathML have mutation-XSS vectors — DOMPurify handles them, but don't bypass yourself with `ALLOWED_NAMESPACES` without understanding it
- Config is per-call — there is no global mutable config; wrap it as one `sanitizeHTML()` utility for the project

## Security Rules

- Never take `RETURN_DOM`/`RETURN_DOM_FRAGMENT` then append without checking context — use only when a DocumentFragment is truly needed
- Don't sanitize only on the client if content is stored in the DB — sanitize before save or before render every time (defense in depth: both)
- `data-*` attributes are allowed by default — if the app reads data-* as code/config → forbid or whitelist specific keys

## Do / Don't

| Do | Don't |
|----|-------|
| sanitize every untrusted HTML | inject raw `dangerouslySetInnerHTML` |
| allowlist (`ALLOWED_TAGS`) when the schema is known | blocklist (`FORBID_*`) alone |
| wrap as one util of the project | config scattered at every call site |
| Trusted Types + `RETURN_TRUSTED_TYPE` | strip CSP to let HTML through |
