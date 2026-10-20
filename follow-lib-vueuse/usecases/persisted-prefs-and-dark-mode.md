# Use Case — Persisted Preferences and Dark Mode

> Keep a user's theme and layout choices across reloads, and follow the OS when they have not chosen. Source: https://vueuse.org/core/useLocalStorage/ (accessed 2026-10-20)

## 1. Install

```bash
bun add @vueuse/core
```

In Nuxt, add the module (`bunx nuxt@latest module add vueuse`) and let auto-imports handle the rest.

## 2. Persist the preference, not the resolved colour

```ts
// composables/usePreferences.ts
import { createSharedComposable, useLocalStorage } from "@vueuse/core";

export function usePreferences() {
  const mode = useLocalStorage<"auto" | "light" | "dark">("theme-mode", "auto");
  const sidebarOpen = useLocalStorage("sidebar-open", true);

  return { mode, sidebarOpen };
}

// One instance for the whole app — every caller sees the same refs
export const useSharedPreferences = createSharedComposable(usePreferences);
```

`useLocalStorage` serialises to JSON and syncs across tabs via the `storage` event. Storing the user's intent (`auto`) instead of the resolved value (`dark`) is what lets the app follow the OS when the schedule flips at sunset.

Without `createSharedComposable`, each caller builds its own instance. They stay in sync through storage events, but each one also parses and writes, and a rapid toggle can flap.

## 3. Derive the theme from the preference

```ts
// composables/useTheme.ts
import { computed, watchEffect } from "vue";
import { useDark, usePreferredDark } from "@vueuse/core";
import { useSharedPreferences } from "./usePreferences";

export function useTheme() {
  const { mode } = useSharedPreferences();
  const prefersDark = usePreferredDark();
  const isDark = useDark({ disableTransition: false });

  const resolved = computed(() =>
    mode.value === "auto" ? (prefersDark.value ? "dark" : "light") : mode.value,
  );

  watchEffect(() => {
    isDark.value = resolved.value === "dark";
  });

  return { resolved, isDark };
}
```

`useDark` toggles the `.dark` class on `<html>` and stores its own key. When the app already owns a `theme-mode` preference, drive `useDark` from it instead of letting two sources write the class.

## 4. Read the preference everywhere through the shared composable

```ts
const { mode } = useSharedPreferences(); // same ref in every component
```

Import `useSharedPreferences` from now on, not `usePreferences` directly. Two import paths for the same state is how a component ends up with a private copy that ignores the toggle in the header.

## 5. Verify

1. `/run-typecheck` + `/run-test`
2. Set dark, reload — the class is on `<html>` before first paint (no light flash)
3. Omit the preference and flip the OS theme — the app follows without a reload
4. Toggle in one tab — the other tab follows
5. Clear site data — the app falls back to `auto`, not to a broken state

## Pitfalls

- Reading `localStorage` during SSR, which renders one theme on the server and swaps on hydration; guard or set the class from a small inline script.
- Storing the resolved theme instead of the intent, so a user who never chose gets pinned to whatever the OS was that day.
- Two keys (`theme` and `theme-mode`) with different writers, producing a toggle that fights itself.
- Defaulting to `dark` while the CSS `.dark` block is the override — the light theme becomes the special case and drifts.

## Related

- `references/apis.md`
- `best-practices/vueuse.md`
- `usecases/element-observers-and-virtual-list.md`
