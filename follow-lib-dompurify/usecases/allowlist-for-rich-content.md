# Use Case — Allowlist for Rich User Content

> Define exactly which tags and attributes survive a rich-text editor, instead of starting from "everything" and blocking a few. Source: https://github.com/cure53/DOMPurify (accessed 2026-10-20)

## 1. Start from an explicit allowlist

```ts
import DOMPurify from "dompurify";

const RICH_TEXT = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "s",
    "a", "ul", "ol", "li", "blockquote",
    "h2", "h3", "h4", "code", "pre", "hr",
    "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
  ],
  ALLOWED_ATTR: ["href", "title", "src", "alt", "width", "height", "colspan", "rowspan", "class"],
  ALLOWED_URI_REGEXP: /^(?:https?|mailto):|^\/|^#/i,
} as const;

export function sanitizeRichText(dirty: string) {
  return DOMPurify.sanitize(dirty, RICH_TEXT);
}
```

An allowlist is a closed set: a tag added by a future editor version is dropped until you add it, which is the safe direction. `ALLOWED_URI_REGEXP` blocks `javascript:` and `data:` URLs on `href`/`src` in one place.

`ALLOWED_ATTR` applies across all tags; a tag-specific attribute such as `colspan` is lost everywhere else, which is fine. Do not reach for `ADD_ATTR` to fix a missing attribute — add the tag/attribute pair deliberately.

## 2. Keep profiles per surface

```ts
const COMMENT = {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "a", "code", "blockquote"],
  ALLOWED_ATTR: ["href", "title"],
} as const;

const CMS_PAGE = {
  ALLOWED_TAGS: [...RICH_TEXT.ALLOWED_TAGS, "section", "details", "summary"],
  ALLOWED_ATTR: [...RICH_TEXT.ALLOWED_ATTR, "id", "aria-label", "open"],
} as const;
```

A comment box and a CMS page are different trust levels. One shared config ends up wide enough for the CMS, which then also applies to comments.

Widen only by spreading an existing profile, so a new tag shows up in one diff rather than being retyped.

## 3. Sanitize once, at the boundary

```ts
const clean = sanitizeRichText(article.body);
return <div dangerouslySetInnerHTML={{ __html: clean }} />;
```

Sanitize on the server for stored content, and again on render for content that may have been written before the current profile existed. Sanitizing in three components is how one of them ends up missing the call.

## 4. Verify

1. `/run-test` — `<script>`, `<iframe>`, `onerror=`, and `href="javascript:alert(1)"` are all removed
2. `<img src=x onerror=alert(1)>` keeps the element and drops the handler
3. A `data:` image URL is stripped under the profile above; confirm that is the intent
4. `/deep-test api` — a stored payload is sanitized on write and reads back sanitized

## Pitfalls

- Building the allowlist by blocking known-bad tags — the list is endless and the default stays open.
- `ALLOW_DATA_ATTR: true` left on by default while the profile claims to allow only listed attributes.
- Sanitizing on write but rendering legacy rows unsanitized after a profile change.
- Allowing `style` for "just one component", which reopens CSS-based injection.
- Trusting `innerHTML` on an element that was sanitized for a different profile.

## Related

- `references/apis.md`
- `best-practices/dompurify.md`
- `usecases/sanitize-user-html.md`
- `usecases/hooks-for-links-and-images.md`
