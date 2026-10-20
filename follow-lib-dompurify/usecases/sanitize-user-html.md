# Use Case — Render User Rich Text Safely in the Browser

> Accept formatted text from a CMS or editor and inject it with a strict allowlist instead of the default profile. Source: https://github.com/cure53/DOMPurify#readme (accessed 2026-10-20)

## 1. Install

```bash
bun add dompurify
```

`dompurify` ships its own TypeScript types; do not add `@types/dompurify`.

## 2. Define one sanitizer for the feature

```ts
import DOMPurify from "dompurify"

const config = {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "a", "code", "pre"],
  ALLOWED_ATTR: ["href", "title", "rel", "target"],
} as const

export function sanitizeRichText(dirty: string) {
  return DOMPurify.sanitize(dirty, config)
}
```

An explicit allowlist is the difference between "rich text" and "anything the browser understands", including `<iframe>` and `<form>`.

## 3. Harden outbound links with a hook

```ts
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("href")) {
    node.setAttribute("target", "_blank")
    node.setAttribute("rel", "noopener noreferrer")
  }
})
```

Hooks are global mutable state — register once during app bootstrap, not inside a component render.

## 4. Inject the result

```tsx
<div dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.body) }} />
```

```ts
element.innerHTML = sanitizeRichText(post.body)
```

Sanitize at the single render boundary, right before injection.

## 5. Prove the payloads are blocked

```ts
const payloads = [
  `<script>alert(1)</script>`,
  `<img src=x onerror=alert(1)>`,
  `<a href="javascript:alert(1)">x</a>`,
  `<svg onload=alert(1)>`,
]

for (const p of payloads) {
  expect(sanitizeRichText(p)).not.toMatch(/onerror|onload|javascript:/i)
}
```

## Pitfalls

- Sanitizing once when the content is saved and again with a different config when rendered → one of the two passes is always weaker; keep one function.
- Using `FORBID_TAGS` alone → every new dangerous tag defaults to allowed; prefer `ALLOWED_TAGS`.
- Trusting `rel` sent by the author → set `rel`/`target` in a hook after sanitizing.
- Mutating the sanitized string afterwards (string replace, template concatenation) → reintroduces the injection you just removed.

## Related

- `references/apis.md`
- `best-practices/dompurify.md`
- `usecases/server-side-sanitize.md`
