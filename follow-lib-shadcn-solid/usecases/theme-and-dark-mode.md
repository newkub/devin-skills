# Use Case — Theme Tokens and Dark Mode

> Drive colors and radius from CSS variables so one toggle switches the whole UI. Source: https://shadcn-solid.com/docs (accessed 2026-10-20)

## 1. Define tokens in the global CSS

```css
/* src/styles/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --radius: 0.5rem;
}

[data-kb-theme="dark"] {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
}
```

Components consume tokens (`bg-background`, `text-foreground`, `rounded-md`). Only the variable block changes between themes.

## 2. Map tokens for Tailwind or UnoCSS

```js
// tailwind.config.js (Tailwind path)
export default {
  darkMode: ["class", '[data-kb-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
      },
      borderRadius: { md: "calc(var(--radius) - 2px)", lg: "var(--radius)" },
    },
  },
};
```

The `darkMode` selector must match the attribute Kobalte writes — with UnoCSS, register the same tokens through the theme config instead.

## 3. Toggle the attribute, not a class

```tsx
import { createSignal, createEffect } from "solid-js";

const [dark, setDark] = createSignal(
  localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches),
);

createEffect(() => {
  const value = dark() ? "dark" : "light";
  document.documentElement.setAttribute("data-kb-theme", value);
  localStorage.setItem("theme", value);
});

export const ThemeToggle = () => (
  <button aria-label="Toggle theme" onClick={() => setDark((v) => !v)}>
    {dark() ? "Light" : "Dark"}
  </button>
);
```

Write the attribute on `<html>` so portals and overlays (dialogs, popovers) inherit the theme.

## 4. Respect the system preference first

```tsx
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
systemDark.addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) setDark(e.matches);
});
```

A first-time visitor should match the OS setting; only an explicit choice should override it.

## 5. Check that every component follows

Open a dialog, a dropdown, and a toast in both themes. Portaled content is where a hard-coded `bg-white` shows up as a white card on a dark page.

## Pitfalls

- Storing the theme in state only — a reload flashes light before hydration; set the attribute in a small inline script or before the app mounts.
- Using Tailwind's default `dark:` class strategy while the app toggles `data-kb-theme`, so nothing switches.
- Hard-coding `bg-white` / `text-black` in a component; tokens are what make theming possible.
- Forgetting portaled components: dialogs, popovers, and toasts render outside the app root unless they inherit from `<html>`.
- Editing `:root` in one file and the dark block in another, so a new token exists in one theme only.
- Applying `rounded-lg` while overriding `--radius`, producing inconsistent corner sizes across components.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/shadcn-solid.md`
- `usecases/add-and-customize-component.md`
