# Use Case — Safe Head Values From Untrusted Content

> CMS, user-generated, or remote values in the head. Source: https://unhead.unjs.io/ (accessed 2026-10-24)

## 1. Recognize the unsafe path

```ts
// unsafe — any attribute or tag name from the value can survive
useHead({
  meta: [{ name: 'description', content: cmsPage.description }],
  script: [{ innerHTML: cmsPage.trackingSnippet }],
})
```

`useHead` trusts its input. A CMS field that reaches `name`, `property`, `rel`, or `innerHTML` can inject attributes or executable script.

## 2. Route untrusted values through `useHeadSafe`

```ts
useHeadSafe({
  title: cmsPage.title,
  meta: [
    { name: 'description', content: cmsPage.description },
    { property: 'og:title', content: cmsPage.title },
  ],
})
```

`useHeadSafe` allowlists tags and attributes (title, meta, link, and safe attribute names) and drops anything outside the list. Values are still text — do not pass HTML into `innerHTML` through it.

## 3. Keep scripts on the loader

```ts
const analytics = useScript('https://cdn.example.com/analytics.js', {
  use: () => window.analytics,
})
analytics.proxy.page(cmsPage.slug)
```

Script URLs must be constants you control. Never build a script URL or `innerHTML` from CMS or user input, with or without `useHeadSafe`.

## 4. Bound what a tenant can set

```ts
const safeTitle = cmsPage.title.slice(0, 120)
const safeImage = new URL(cmsPage.ogImage, 'https://example.com') // same-origin allowlist
```

Length limits and URL allowlists are application policy; Unhead only stops attribute/tag injection.

## 5. Verify the rendered output

```ts
const payload = renderSSRHead(head)
// payload.headTags must contain only allowlisted tags and escaped values
```

Check a page that carries hostile input and confirm no extra `<script>`, event handler, or `javascript:` URL appears.

## Pitfalls

- Using `useHeadSafe` but still passing a user-controlled URL to `<link rel="canonical">` — allowlist origins.
- Assuming `useHeadSafe` sanitizes arbitrary HTML — it allowlists tags/attributes, not rich content.
- Keeping `useSeoMeta` for values that include user input; it is a convenience mapper, not a sanitizer.
- Secrets in head entries — every head value is public HTML, on every page that renders it.

## Related

- `references/apis.md`
- `best-practices/unhead.md`
- `usecases/spa-head-setup.md`
