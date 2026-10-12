# Theme Tokens — canonical set and config map

`theme.css` is the single source of truth. Values are stored as **channel components**
(`H S% L%`) so UnoCSS opacity modifiers work (`bg-primary/50`), and the config wraps them
with `hsl(var(--color-*))`.

## 1. Token Set (compact list)

| Token | Role | Notes |
|-------|------|-------|
| `--color-background` | page background | pairs with `--color-foreground` |
| `--color-foreground` | default text | AA on `background` |
| `--color-surface` | card / panel | `-elevated` for raised, `-foreground` for text on it |
| `--color-muted` | subtle surface | `-foreground` for secondary text |
| `--color-border` | hairlines | `-hover` for interactive borders |
| `--color-primary` | brand action | `-hover`, `-active`, `-foreground` |
| `--color-secondary` | alt action | `-hover`, `-active`, `-foreground` |
| `--color-accent` | highlight | `-hover`, `-foreground` |
| `--color-success` / `--color-warning` / `--color-destructive` | status | each with `-foreground` (+ `-hover`/`-active` for destructive) |
| `--color-focus` | focus ring | used as `ring-focus/40` |
| `--color-overlay` | modal scrim | alpha baked in |
| `--color-skeleton` | loading | `-shine` for the sweep |

Non-color: `--radius-sm|md|lg`, `--shadow-sm|md|lg`, `--font-sans`, `--font-mono`.

## 2. theme.css

```css
:root {
  --color-background: 40 33% 98%;
  --color-foreground: 260 13% 12%;
  --color-surface: 0 0% 100%;
  --color-surface-elevated: 0 0% 100%;
  --color-surface-foreground: 260 13% 12%;
  --color-muted: 38 30% 94%;
  --color-muted-foreground: 262 8% 43%;
  --color-border: 36 28% 88%;
  --color-border-hover: 14 76% 52%;
  --color-primary: 14 76% 52%;
  --color-primary-hover: 14 80% 46%;
  --color-primary-active: 14 82% 40%;
  --color-primary-foreground: 0 0% 100%;
  --color-secondary: 174 62% 30%;
  --color-secondary-hover: 174 62% 26%;
  --color-secondary-active: 174 62% 22%;
  --color-secondary-foreground: 0 0% 100%;
  --color-accent: 14 76% 52%;
  --color-accent-hover: 14 80% 46%;
  --color-accent-foreground: 0 0% 100%;
  --color-success: 152 60% 36%;
  --color-success-foreground: 0 0% 100%;
  --color-warning: 36 92% 55%;
  --color-warning-foreground: 30 60% 12%;
  --color-destructive: 4 65% 46%;
  --color-destructive-hover: 4 68% 40%;
  --color-destructive-active: 4 70% 34%;
  --color-destructive-foreground: 0 0% 100%;
  --color-focus: 14 76% 52%;
  --color-overlay: 260 20% 5%;
  --color-skeleton: 38 25% 90%;
  --color-skeleton-shine: 38 30% 96%;

  --radius-sm: 0.5rem;
  --radius-md: 0.875rem;
  --radius-lg: 1.25rem;
  --shadow-sm: 0 1px 2px hsl(var(--color-foreground) / 0.06);
  --shadow-md: 0 10px 30px hsl(var(--color-foreground) / 0.1);
  --shadow-lg: 0 24px 60px hsl(var(--color-foreground) / 0.18);
  --font-sans: "Noto Sans Thai", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  color-scheme: light;
}

/* class strategy — toggle `.dark` on <html> (pair with presetWind4({ dark: 'class' })) */
.dark {
  --color-background: 260 12% 8%;
  --color-foreground: 270 20% 95%;
  --color-surface: 260 10% 11%;
  --color-surface-elevated: 260 10% 15%;
  --color-surface-foreground: 270 20% 95%;
  --color-muted: 260 10% 15%;
  --color-muted-foreground: 264 8% 62%;
  --color-border: 262 12% 21%;
  --color-border-hover: 14 90% 62%;
  --color-primary: 14 90% 62%;
  --color-primary-hover: 14 90% 68%;
  --color-primary-active: 14 90% 74%;
  --color-primary-foreground: 0 0% 100%;
  --color-destructive: 4 62% 62%;
  --color-destructive-foreground: 0 0% 100%;
  --color-overlay: 260 25% 3%;
  --color-skeleton: 260 10% 18%;
  --color-skeleton-shine: 260 10% 24%;

  color-scheme: dark;
}

/* no-JS / system fallback — keep in sync with .dark */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* …same declarations as .dark… */
  }
}
```

Every token declared in `:root` must also exist in the dark block (theme-lint enforces parity).

## 3. uno.config.ts

```ts
import { defineConfig, presetIcons, presetTypography, presetWind4, transformerDirectives, transformerVariantGroup } from "unocss"
import { globSync } from "node:fs"

const sources = globSync("./src/**/*.{tsx,ts}", { cwd: import.meta.dirname })

export default defineConfig({
  presets: [
    presetWind4({ dark: "class" }),
    presetIcons({ scale: 1.2, extraProperties: { display: "inline-block", "vertical-align": "middle" } }),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  content: { filesystem: sources },
  theme: {
    font: { sans: "var(--font-sans)", mono: "var(--font-mono)" },
    radius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)" },
    shadow: { sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)" },
    colors: {
      background: "hsl(var(--color-background))",
      foreground: "hsl(var(--color-foreground))",
      surface: {
        DEFAULT: "hsl(var(--color-surface))",
        elevated: "hsl(var(--color-surface-elevated))",
        foreground: "hsl(var(--color-surface-foreground))",
      },
      muted: { DEFAULT: "hsl(var(--color-muted))", foreground: "hsl(var(--color-muted-foreground))" },
      border: { DEFAULT: "hsl(var(--color-border))", hover: "hsl(var(--color-border-hover))" },
      primary: {
        DEFAULT: "hsl(var(--color-primary))",
        hover: "hsl(var(--color-primary-hover))",
        active: "hsl(var(--color-primary-active))",
        foreground: "hsl(var(--color-primary-foreground))",
      },
      secondary: { DEFAULT: "hsl(var(--color-secondary))", hover: "hsl(var(--color-secondary-hover))", foreground: "hsl(var(--color-secondary-foreground))" },
      accent: { DEFAULT: "hsl(var(--color-accent))", hover: "hsl(var(--color-accent-hover))", foreground: "hsl(var(--color-accent-foreground))" },
      success: { DEFAULT: "hsl(var(--color-success))", foreground: "hsl(var(--color-success-foreground))" },
      warning: { DEFAULT: "hsl(var(--color-warning))", foreground: "hsl(var(--color-warning-foreground))" },
      destructive: { DEFAULT: "hsl(var(--color-destructive))", hover: "hsl(var(--color-destructive-hover))", foreground: "hsl(var(--color-destructive-foreground))" },
      focus: "hsl(var(--color-focus))",
      overlay: "hsl(var(--color-overlay))",
      skeleton: { DEFAULT: "hsl(var(--color-skeleton))", shine: "hsl(var(--color-skeleton-shine))" },
    },
    maxWidth: { content: "87.5rem" },
    minHeight: { auth: "70vh", error: "50vh" },
    zIndex: { toast: "100" },
  },
  /* no shortcut layer — UI uses the theme utilities above directly
   * (bg-surface, text-muted-foreground, border-border, rounded-md, shadow-lg, ring-focus/40) */
})
```

Resulting utilities (used directly in UI): `bg-surface`, `text-muted-foreground`, `border-border`, `hover:bg-primary-hover`, `rounded-md`, `shadow-lg`, `ring-focus/40`, `bg-skeleton-shine`, …

## 4. Dark Mode Wiring

```html
<!-- in <head>, before the stylesheet — prevents FOUC -->
<script>
  const saved = localStorage.getItem("theme")
  const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches
  document.documentElement.classList.toggle("dark", dark)
</script>
```

```ts
// toggle
const setTheme = (mode: "light" | "dark") => {
  document.documentElement.classList.toggle("dark", mode === "dark")
  localStorage.setItem("theme", mode)
}
```

`presetWind4({ dark: 'class' })` is required for `dark:` variants to follow the class; the theme
itself does **not** need `dark:` — tokens switch at the variable layer.

## 5. Lint Checks (theme-lint.ts)

| Severity | Check | Meaning |
|----------|-------|---------|
| Critical | `dark-parity` | token defined in one block only |
| Critical | `dark-strategy` | `dark:'media'` + `.dark` selector, or `.dark` block with no class strategy |
| High | `config-orphan` | `uno.config.ts` maps a token `theme.css` never defines |
| High | `config-missing` | `theme.css` token not mapped in the config |
| High | `undefined-token` | UI uses `bg-x`/`text-x` where `x` is not a token |
| High | `palette-hardcode` | `bg-blue-500`-style palette class in UI |
| Medium | `dark-redundant` | `dark:` variant on a theme color |
| Medium | `inline-color` | raw color in an inline style |
| Info | `foreground-pair` | surface without its own `*-foreground` |
| Info | `unused-token` | token defined but never used by a utility |
