# Use Case — Themes And Typography

> Ship light/dark/system themes from one parse, and match the product type scale without forking component CSS. Source: `@pierre/diffs@1.6.1`.

## 1. Theme pair + mode

```ts
const options = {
  theme: { light: 'github-light', dark: 'github-dark' },
  themeType: 'system' as const,
}
```

- `themeType: 'system'` follows `prefers-color-scheme` and updates live
- `'light'` / `'dark'` pin the mode; changing it is an options update, not a re-parse
- Theme families include `pierre`, `github`, `one`, `vitesse`, `catppuccin` — keep light/dark from the same family so add/remove contrast matches

If the product has its own tokens, register a theme that reads CSS variables:

```ts
import { createCSSVariablesTheme, registerCustomTheme } from '@pierre/diffs'

registerCustomTheme('product', createCSSVariablesTheme({
  name: 'product',
  variablePrefix: '--product-diff',
  variableDefaults: { /* token → fallback color */ },
}))
```

`createCSSVariablesTheme` produces a theme whose colors resolve from your CSS variables — map those variables to product tokens in `theme.css` instead of duplicating hex values in JS.


## 2. Drive mode from your app state

```ts
type Mode = 'system' | 'light' | 'dark'

function applyMode(view: CodeView, mode: Mode) {
  view.setOptions({ ...currentOptions, themeType: mode })
}
```

React:

```tsx
<CodeView items={items} options={{ ...options, themeType: mode }} />
```

Do not rebuild item metadata or re-parse the patch on a theme change — theme is a render option.

## 3. Typography variables

```css
.diff-host {
  --diffs-font-family: 'JetBrains Mono', ui-monospace, monospace;
  --diffs-font-size: 13px;
  --diffs-line-height: 20px;
  --diffs-tab-size: 2;
}
```

- Set them on the host (or a theme class), never inline per row
- When the diff is nested inside a page with a different base size, set the four variables explicitly — inherited `font-size` alone won't update row metrics
- Font zoom multiplies all three: `--diffs-font-size: calc(13px * var(--diff-font-scale))` works because `CodeView` re-measures on option/variable change

## 4. Scaling from app settings

```ts
function setScale(view: CodeView, host: HTMLElement, scale: number) {
  view.setOptions({ ...currentOptions, themeType: mode })
  host.style.setProperty('--diffs-font-size', `${13 * scale}px`)
  host.style.setProperty('--diffs-line-height', `${20 * scale}px`)
  view.render()
}
```

Call `render()` after changing variables so row metrics are recomputed. `transform: scale()` on the host is not equivalent — it stretches rendered rows while the virtualizer keeps unscaled measurements.

## 5. CSS classes instead of inline styles

```ts
const options = { useCSSClasses: true, theme: pair, themeType: 'system' }
```

- Colors land on classes so a product-level `.dark` switch applies instantly
- DOM shrinks for very large diffs
- Custom CSS can target the generated classes, but prefer the documented CSS variables for anything theme-related

## 6. Checklist

| Check | Pass condition |
|-------|----------------|
| Theme switch | no re-parse, no scroll jump, no flash of unstyled diff |
| System mode | follows OS change while the tab is open |
| Typography | line numbers align with code at every zoom level |
| Long lines | `overflow: 'scroll'` keeps alignment; `'wrap'` hides horizontal scroll |
| Contrast | add/remove tints readable in both modes (check with `/review-a11y`) |
