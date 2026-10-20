# Use Case — Escaping and Raw HTML

> Know exactly which syntax escapes, and keep the one legitimate raw-HTML path behind a sanitizer. Source: https://edgejs.dev/docs/interpolation (accessed 2026-10-20)

## 1. Escaped by default

```edge
<h1>{{ post.title }}</h1>
<p class="byline">{{ post.author.name }}</p>
```

`{{ }}` HTML-escapes the output. A title containing `<script>` renders as text, which is the behaviour you want for every user-supplied value.

Escaping happens at render time, so storing a raw title in the database is fine — the template is the boundary.

## 2. Raw output only for reviewed HTML

```edge
<article class="prose">
  {{{ post.bodyHtml }}}
</article>
```

`{{{ }}}` writes unescaped HTML. Reserve it for content that passed a sanitizer or is authored by a trusted editor, and keep the sanitize call next to the data source:

```ts
import DOMPurify from "isomorphic-dompurify";

const bodyHtml = DOMPurify.sanitize(post.bodyMarkdownRendered);
```

If a second `{{{ }}}` appears for a field that also comes from users, the allowlist is missing a rule — fix the sanitizer, not the template.

## 3. Keep attributes and URLs in check

```edge
<a href="{{ post.url }}" rel="noopener noreferrer">{{ post.title }}</a>
<img src="{{ post.imageUrl }}" alt="{{ post.imageAlt }}" loading="lazy">
```

Attribute interpolation uses the same escaping, but a `javascript:` URL survives escaping. Validate the protocol in the controller (`new URL(url).protocol` must be `https:`) before rendering, or run the value through the sanitizer's URI allowlist.

Never put user input inside an inline event handler (`onclick="{{ x }}"`) — the attribute is code, not data.

## 4. Verify

1. `/run-test` — render `<script>alert(1)</script>` as a title; the output is escaped text
2. Render a `javascript:` URL; the controller rejects it before the template sees it
3. `/deep-test website` — no inline script from user content executes in the browser
4. `grep -c "{{{" views/**/*.edge` — every hit is a field with a sanitizer in its data path

## Pitfalls

- Reaching for `{{{ }}}` because the escaped output "looks wrong" when the real bug is double-encoding upstream.
- Escaping in the controller and again in the template, producing `&amp;lt;`.
- A sanitizer applied on write but not on read, so rows stored before the rule are rendered raw.
- Interpolating into an attribute without quotes, which lets a space break out of the attribute.
- Assuming the template engine blocks `javascript:` URLs — it does not.

## Related

- `references/apis.md`
- `best-practices/edgejs.md`
- `usecases/edge-instance-and-render.md`
- `usecases/forms-and-validation.md`
