# Use Case — Hooks for Safe Links and Images

> Post-process the sanitized DOM once, at module level, so every link opens safely and no image can phone home with a script. Source: https://github.com/cure53/DOMPurify#hooks (accessed 2026-10-20)

## 1. Register hooks once at startup

```ts
import DOMPurify from "dompurify";

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("rel", "noopener noreferrer nofollow");
    node.setAttribute("target", "_blank");
  }
});
```

`addHook` writes to a module-level registry — registering inside a component or a request handler stacks duplicate hooks and slows every sanitize call. Call it once, next to the sanitizer module.

`afterSanitizeAttributes` runs per element after attributes are clean, so it is the right place to add safe attributes and the wrong place to re-introduce any HTML.

## 2. Drop links and images that cannot be trusted

```ts
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    const href = node.getAttribute("href") ?? "";
    if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href)) node.removeAttribute("href");
  }

  if (node.tagName === "IMG") {
    const src = node.getAttribute("src") ?? "";
    if (!/^https:\/\//i.test(src)) {
      node.removeAttribute("src");
      node.setAttribute("alt", node.getAttribute("alt") ?? "image unavailable");
    }
    if (!node.getAttribute("loading")) node.setAttribute("loading", "lazy");
  }
});
```

`ALLOWED_URI_REGEXP` already blocks the obvious cases; this hook handles what remains after decoding, and it can add `loading="lazy"` and a fallback `alt` in the same pass.

Mutating the node here does not trigger another sanitize pass — do not rely on the hook to sanitize nested HTML. It only runs on the nodes DOMPurify produced.

## 3. Reset hooks in tests

```ts
afterEach(() => {
  DOMPurify.removeAllHooks();
  registerSanitizerHooks();
});
```

A test that registers hooks without cleanup leaks them into later tests in the same file, producing order-dependent failures. `removeAllHooks()` then re-register is the reliable reset.

## 4. Verify

1. `/run-test` — every anchor carries `rel="noopener noreferrer nofollow"` and `target="_blank"`
2. `href="//evil.example"` is removed; `href="/docs"` survives
3. An `http://` image is dropped; an `https://` image keeps `src` plus `loading="lazy"`
4. Run the suite twice in one process — results are identical (no duplicated hooks)

## Pitfalls

- Registering the hook inside a React component body or a request handler, stacking one hook per render.
- Using `afterSanitizeElements` to edit attributes — the attributes are not final there.
- Re-inserting markup from the hook, which bypasses the sanitizer entirely.
- Forgetting `removeAllHooks` in tests, causing cross-test contamination.
- Relying on the server to add `rel` and shipping client-side sanitize without it.

## Related

- `references/apis.md`
- `best-practices/dompurify.md`
- `usecases/allowlist-for-rich-content.md`
- `usecases/trusted-types-and-csp.md`
