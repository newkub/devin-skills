# Use Case — Allowlisted HTML and Safe Embeds

> Let authored markdown include a narrow set of raw HTML and rich embeds, with the allowlist in one module instead of scattered conditionals. Source: https://tanstack.com/markdown/latest (accessed 2026-10-20)

## 1. Decide the HTML policy before the first post

| Source | Allowed | Rendered as |
|---|---|---|
| Author HTML (`<details>`, `<kbd>`, `<br>`) | yes, allowlisted tags + attributes | sanitized node |
| Script, event handlers, `style` | never | stripped |
| A link to a known embed host | yes | provider embed |
| Arbitrary `<iframe>` | never | plain link |

The table is the contract. Anything not in the first and third rows is a link, not markup.

## 2. Sanitize at parse output, not at render time

```ts
// src/markdown/sanitize.ts
import DOMPurify from "isomorphic-dompurify";

const ALLOW = {
  ALLOWED_TAGS: ["details", "summary", "kbd", "br", "sub", "sup", "mark", "abbr"],
  ALLOWED_ATTR: ["title", "lang", "datetime"],
};

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, ALLOW);
}
```

Sanitizing in the renderer means a second renderer added later renders raw HTML. Sanitize where the node is produced, so every consumer receives a clean string.

## 3. Resolve links to embeds by host allowlist

```ts
// src/markdown/embeds.ts
export type Embed = { provider: "youtube" | "gist"; id: string };

const HOSTS: Record<string, (url: URL) => Embed | null> = {
  "youtube.com": (u) => {
    const id = u.searchParams.get("v");
    return id ? { provider: "youtube", id } : null;
  },
  "youtu.be": (u) => ({ provider: "youtube", id: u.pathname.slice(1) }),
  "gist.github.com": (u) => ({ provider: "gist", id: u.pathname.split("/").pop() ?? "" }),
};

export function toEmbed(href: string): Embed | null {
  const url = new URL(href, "https://example.invalid");
  const resolve = HOSTS[url.host.replace(/^www\./, "")];
  return resolve ? resolve(url) : null;
}
```

Only the host decides; the id is taken from the URL, never from the author's HTML. A link to any other host stays a link.

## 4. Render click-to-load, not an eager iframe

```tsx
function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  if (!loaded) {
    return (
      <button type="button" onClick={() => setLoaded(true)} className="embed-poster">
        <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
        <span>Play: {title}</span>
      </button>
    );
  }
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${id}`}
      title={title}
      loading="lazy"
      allow="accelerometer; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}
```

The poster image keeps the page's privacy and performance profile until the reader asks for the video. `youtube-nocookie` avoids the tracking cookie on load.

## 5. Verify

1. `/run-test` — `<script>alert(1)</script>`, `<img onerror=…>` and `style="…"` are all stripped; `<details>` survives
2. A link to `https://evil.example/embed/x` renders as a link, not an iframe
3. The allowlist test imports the sanitizer module, not the renderer
4. The embed loads only after a click; the initial page makes no request to the video host
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Sanitizing with the default config → it permits far more than the policy table; pass an explicit allowlist.
- Trusting `node.href` to build an iframe `src` → `javascript:` and data URLs in an iframe become clickjacking; allowlist the host first.
- Sanitizing on the client only → a server-rendered page ships the raw HTML in the payload before sanitizing.
- An eager iframe per embed → five videos on a page mean five third-party requests before any is played.
- Adding a new provider by editing the renderer → add a `HOSTS` entry; the renderer stays provider-agnostic.

## Related

- `references/apis.md`
- `best-practices/tanstack-markdown.md`
- `usecases/custom-node-renderers.md`
- `usecases/doc-model-over-the-wire.md`
