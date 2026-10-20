# Use Case — Runtime Icon Component for Data-Driven Icons

> Render icon names that come from data, with an offline collection registered for the icons the app actually uses. Source: https://iconify.design/docs/ (accessed 2026-10-20)

## 1. Install the framework component

```bash
bun add @iconify/react
bun add @iconify-json/lucide
```

## 2. Render an icon from a string

```tsx
import { Icon } from "@iconify/react"

export function FeatureIcon({ name }: { name: string }) {
  return <Icon icon={name} height={24} aria-hidden="true" />
}
```

```tsx
<FeatureIcon name="lucide:search" />
```

Without a registered collection the component fetches the icon from the Iconify API at runtime.

## 3. Register the collection for offline use

```ts
import { addCollection } from "@iconify/react"
import lucide from "@iconify-json/lucide/icons.json"

addCollection(lucide)
```

Register once during app bootstrap. This removes the API request but adds the whole set to the bundle, so prefer the per-icon path when the set is large.

## 4. Keep accessible names

```tsx
<button aria-label="Search">
  <Icon icon="lucide:search" aria-hidden="true" />
</button>
```

An icon is decoration; the accessible name belongs on the interactive element.

## 5. Validate names coming from data

```ts
const ALLOWED = new Set(["lucide:search", "lucide:settings", "lucide:user"])

const safeName = ALLOWED.has(name) ? name : "lucide:circle-help"
```

Treat icon names from a CMS or API as input: an unknown name renders an empty box, and an arbitrary URL-backed name can trigger unexpected network requests.

## Pitfalls

- Rendering names from untrusted data without an allowlist → missing icons or requests to arbitrary hosts.
- Registering several full sets → bundle size grows fast; register one set or use `@iconify/utils` to subset.
- Forgetting `aria-hidden` on decorative icons → screen readers announce meaningless labels.
- Setting size/color in inline SVG props instead of `height`/`style` → inconsistent sizing across icons.

## Related

- `references/apis.md`
- `best-practices/icons.md`
- `usecases/offline-icons-unocss.md`
