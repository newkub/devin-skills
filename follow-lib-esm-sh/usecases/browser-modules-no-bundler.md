# Use Case — Ship a Browser App With No Bundler

> Load pinned ESM packages straight from the CDN, keep one React copy, and map bare specifiers in the page. Source: https://esm.sh (accessed 2026-10-20)

## 1. Import pinned URLs

```html
<script type="module">
  import React from "https://esm.sh/react@19.3.0"
  import { createRoot } from "https://esm.sh/react-dom@19.3.0/client?deps=react@19.3.0"

  createRoot(document.getElementById("root")).render(React.createElement(App))
</script>
```

Pinning every version is what makes the page reproducible; `latest` can change between two loads.

## 2. Add an import map for bare specifiers

```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19.3.0",
    "react-dom/client": "https://esm.sh/react-dom@19.3.0&deps=react@19.3.0/client",
    "three": "https://esm.sh/three@0.180.0?exports=Scene,PerspectiveCamera,WebGLRenderer"
  }
}
</script>
```

After a version with a trailing slash, the second query parameter uses `&`, not `?` — the import map example above relies on that rule.

## 3. Avoid duplicate copies of a shared dependency

```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19.3.0",
    "react-dom": "https://esm.sh/*react-dom@19.3.0"
  }
}
</script>
```

The `*` prefix (or `?external=react`) makes `react-dom` resolve `react` from the page instead of bundling its own copy.

## 4. Trim what ships to the browser

```text
https://esm.sh/three@0.180.0?exports=Scene,PerspectiveCamera,WebGLRenderer
```

`?exports` tree-shakes the CDN build to the named exports; without it the whole package entry ships.

## 5. Manage the map with the CLI

```bash
bunx esm.sh add react@19.3.0
bunx esm.sh tidy
```

The CLI writes and cleans the `<script type="importmap">` block of `index.html` so versions are not hand-edited.

## Pitfalls

- Importing the same library with two different URLs → two module instances, broken context and hooks; route through one import-map entry.
- Using `?dev` in production → larger, unminified builds; reserve it for local work.
- Editing a URL and forgetting the map → the map wins for bare specifiers, so the page silently keeps the old version.
- Reaching for the CDN in a project that already has a bundler → keep normal `bun add` installs there.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/esm-sh.md`
- `usecases/pin-and-lock-dependencies.md`
