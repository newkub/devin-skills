# Use Case — Import Maps and One Shared Dependency

> Map bare specifiers once, so app code and third-party libraries resolve the same React instance. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap (accessed 2026-10-20)

## 1. Declare the map before any module

```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19.2.0",
    "react/jsx-runtime": "https://esm.sh/react@19.2.0/jsx-runtime",
    "react-dom/client": "https://esm.sh/react-dom@19.2.0/client?deps=react@19.2.0",
    "react/": "https://esm.sh/react@19.2.0/"
  }
}
</script>

<script type="module" src="/src/main.jsx"></script>
```

The map must appear before the first module script — a module that resolves before the map is parsed fails with a bare-specifier error. One `importmap` per document.

The trailing-slash key (`"react/"`) covers deep imports; without it, `react/jsx-runtime` resolves only if listed explicitly.

## 2. Pin libraries to the same dependency

```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19.2.0",
    "zustand": "https://esm.sh/zustand@5?deps=react@19.2.0",
    "sonner": "https://esm.sh/sonner@2?deps=react@19.2.0"
  }
}
</script>
```

`?deps=react@19.2.0` rewrites the library's import of `react` to that exact URL, so the hook dispatcher is the same object. Without it you get "Invalid hook call" or a context that is always `null` — two Reacts, both valid.

## 3. Scope the map for a micro-frontend

```html
<script type="importmap">
{
  "imports": { "shared/ui": "/packages/ui/index.js" },
  "scopes": {
    "/legacy/": { "shared/ui": "/legacy/ui/index.js" }
  }
}
</script>
```

`scopes` lets one subtree use a different resolution without a second document. Use it during a migration; two live versions of a component library is a deliberate, temporary cost.

## 4. Verify

1. Console — no "Failed to resolve module specifier" errors on first paint
2. React DevTools shows one root and one version, not two
3. A component using a hook imported from `react` works inside a library component
4. `/run-test` — the map file is asserted in a snapshot; an accidental version bump shows as a diff

## Pitfalls

- Placing the import map after a module script, so the first imports fail.
- Listing `react` but not `react/jsx-runtime`, which breaks the automatic JSX transform.
- Forgetting `?deps=` on a library, producing a second React copy.
- Two import maps in one document — only the first is honored.
- Mapping a bare specifier to a version range instead of an exact version.

## Related

- `references/apis.md`
- `best-practices/esm-sh.md`
- `usecases/browser-modules-no-bundler.md`
- `usecases/bundle-options-and-targets.md`
