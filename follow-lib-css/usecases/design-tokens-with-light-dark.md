# Use Case — Design Tokens with Automatic Light and Dark

> One token set, one declaration, both themes — no duplicated dark-mode rule blocks and no flash of the wrong theme. Source: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark (accessed 2026-10-20)

## 1. Declare tokens, not components

```css
:root {
  color-scheme: light dark;              /* required for light-dark() and native controls */

  --surface: light-dark(#ffffff, #111114);
  --surface-raised: light-dark(#f7f7f8, #1b1b1f);
  --text: light-dark(#16181d, #e9eaee);
  --text-muted: light-dark(#5b6270, #a2a8b4);
  --border: light-dark(#d9dce3, #2b2d33);
  --accent: light-dark(#4f46e5, #8b8cf9);

  --radius: 0.5rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
}
```

Every component consumes the tokens; the theme is decided once by `color-scheme`.

## 2. Components stay theme-agnostic

```css
.card {
  background: var(--surface-raised);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-4);
}
.card__meta { color: var(--text-muted); }
```

No `@media (prefers-color-scheme: dark)` block per component — that is the duplication `light-dark()` removes.

## 3. Let the user override

```css
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"]  { color-scheme: dark; }
```

```html
<!-- set before paint, in <head>, to avoid a flash -->
<script>
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
</script>
```

With `color-scheme` set per `data-theme`, every `light-dark()` token follows without any extra CSS.

## 4. Fallback for older engines

```css
:root {
  color-scheme: light dark;
  --text: #16181d;
  --text: light-dark(#16181d, #e9eaee);   /* ignored by engines without light-dark() */
}
@media (prefers-color-scheme: dark) {
  :root { --text: #e9eaee; }
}
```

The plain declaration comes first and wins where the function is unsupported.

## Pitfalls

- `light-dark()` without `color-scheme` → the function falls back to the light value; the dark theme silently never appears.
- Setting `data-theme` after hydration → flash of the wrong theme; set it in a blocking inline script in `<head>`.
- Token names tied to appearance (`--white`, `--gray-900`) → renaming later touches every component; name by role (`--surface`, `--text-muted`).
- Mixing a raw colour with a token in the same component → the one hard-coded value breaks in the opposite theme.

## Related

- `references/apis.md`
- `best-practices/css.md`
- `usecases/container-queries.md`
