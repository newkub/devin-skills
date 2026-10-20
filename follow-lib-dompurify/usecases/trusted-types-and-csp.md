# Use Case — Trusted Types and a Strict CSP

> Make DOMPurify the only producer of HTML under `require-trusted-types-for 'script'`, so a missed sanitize call fails loudly. Source: https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API (accessed 2026-10-20)

## 1. Sanitize through a named policy

```ts
import DOMPurify from "dompurify";

const policy = window.trustedTypes?.createPolicy("sanitized-html", {
  createHTML: (dirty) => DOMPurify.sanitize(dirty),
});

export function toTrustedHtml(dirty: string): TrustedHTML | string {
  return policy ? policy.createHTML(dirty) : DOMPurify.sanitize(dirty);
}
```

The guard keeps the code working in browsers without Trusted Types and in SSR, while using the policy where it exists. Name the policy — `default` hides which code path produced the HTML and defeats the audit value.

`DOMPurify.sanitize` returns a string by default; the policy wrapper is what turns it into a `TrustedHTML` the DOM will accept.

## 2. Assign only trusted output

```ts
const el = document.querySelector("#article");
if (el) el.innerHTML = toTrustedHtml(article.body) as TrustedHTML;
```

Under the CSP below, every other `innerHTML` assignment throws a `TypeError` at runtime. That is the point: a missed sanitize call becomes a visible failure in development instead of a silent XSS hole in production.

For frameworks, the equivalent is a small component that takes `TrustedHTML` and sets `innerHTML` — never a generic `html` prop that accepts strings.

## 3. Enforce with the response header

```http
Content-Security-Policy:
  require-trusted-types-for 'script';
  trusted-types sanitized-html;
  default-src 'self';
  img-src 'self' https: data:;
```

List every policy name you create; an unlisted one is blocked. `require-trusted-types-for 'script'` covers `innerHTML`, `insertAdjacentHTML`, `<script src>`, and `eval` sinks.

Roll it out in report-only first (`Content-Security-Policy-Report-Only`) to find the sinks you missed, then switch to enforcing.

## 4. Verify

1. `/run-dev` with the enforcing header — the article renders; a stray `el.innerHTML = raw` throws
2. Check the console: no `TrustedHTML` violations on any route
3. `/run-test` — the sanitizer output is assigned through the policy, not `as any`
4. SSR: the policy is absent on the server, and the fallback path still sanitizes
5. `/deep-test website` — no violation reports in the browser console after navigation

## Pitfalls

- Creating a `default` policy, which every `innerHTML` assignment silently uses and which hides the unsanitized paths.
- Casting a raw string to `TrustedHTML` with `as`, which compiles and fails at runtime.
- Enabling the header before listing the policy names, blocking your own sanitizer.
- Forgetting a second policy (for example from a UI library) and blaming DOMPurify for the violation.
- Assuming Trusted Types replaces sanitization — it forces everything through the policy, including a policy that does nothing.

## Related

- `references/apis.md`
- `best-practices/dompurify.md`
- `usecases/sanitize-user-html.md`
- `usecases/hooks-for-links-and-images.md`
