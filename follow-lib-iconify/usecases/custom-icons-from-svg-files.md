# Use Case — Custom Icons From SVG Files

> Turn a folder of brand and product SVGs into an icon collection the existing pipeline understands, instead of pasting SVG strings into config. Source: https://iconify.design/docs/libraries/tools/ (accessed 2026-10-20)

## 1. Load the folder through UnoCSS

```bash
bun add -D @iconify/utils unocss
```

```ts
// uno.config.ts
import { defineConfig, presetIcons } from "unocss";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";

export default defineConfig({
  presets: [
    presetIcons({
      collections: {
        app: FileSystemIconLoader("./assets/icons", (svg) =>
          svg.replace(/fill="#[0-9a-fA-F]{3,6}"/g, 'fill="currentColor"'),
        ),
      },
    }),
  ],
});
```

```html
<span class="i-app-logo" aria-hidden="true"></span>
```

`FileSystemIconLoader` reads `assets/icons/logo.svg` for the class `i-app-logo`. The transform callback is the place to normalize `fill`, so one CSS rule themes every custom icon instead of editing each file.

## 2. Treat icon file names as an API

```text
assets/icons/logo.svg          -> i-app-logo
assets/icons/nav/settings.svg  -> i-app-nav-settings
```

Directories become part of the class name. Renaming a file silently removes an icon from the UI, so rename through `/rename` and grep for the old class before committing.

## 3. Build a JSON set when several projects share the icons

```ts
// scripts/build-icons.ts
import {
  cleanupSVG,
  importDirectory,
  isEmptyColor,
  parseColors,
} from "@iconify/tools";

const set = await importDirectory("assets/icons", { prefix: "app" });

await set.forEach(async (name, type) => {
  if (type !== "icon") return;

  const svg = set.toSVG(name);
  if (!svg) return;

  cleanupSVG(svg);
  parseColors(svg, {
    defaultColor: "currentColor",
    callback: (attr, colorStr, color) => {
      if (!color) throw new Error(`Unexpected color ${colorStr} in ${name}`);
      if (color.type === "none" || isEmptyColor(color)) return colorStr;
      return "currentColor";
    },
  });
  set.fromSVG(name, svg);
});

await Bun.write("dist/icons/app.json", JSON.stringify(set.export(), null, 2));
```

`cleanupSVG` strips editor metadata and fixed dimensions, `parseColors` rewrites every literal colour, and the thrown error fails the build on a gradient or a named colour the pipeline cannot flatten. Add `runSVGO(svg)` before `set.fromSVG` when the source files come from a design tool. Writing the export yourself keeps the filename predictable and the output byte-stable.

## 4. Consume the built set

```ts
import { addCollection } from "iconify-icon";
import app from "../dist/icons/app.json";

addCollection(app);
```

```html
<iconify-icon icon="app:logo" width="32" height="32"></iconify-icon>
```

The exported JSON carries the same shape as an `@iconify-json/*` package, so every consumer — UnoCSS `presetIcons`, `iconify-icon`, `@iconify/react` — reads it without a special case.

## 5. Regenerate on change, never by hand

```json
{ "scripts": { "build:icons": "bun scripts/build-icons.ts" } }
```

Run it in CI before the app build. A committed `dist/icons/` that nobody regenerated is the usual cause of "the new icon is missing in production but fine locally".

## 6. Verify

1. `bun run build:icons` — the JSON body contains `currentColor`, no `width`/`height` attributes
2. `/run-build` — the custom class compiles and no network request is made for the icon
3. Toggle the theme — the icon follows the text colour
4. Reference a name that does not exist — nothing renders, and the inspector reports it as missing
5. Run the script twice — the output is byte-identical, so the build stays reproducible

## Pitfalls

- Hand-editing an exported icon JSON, then regenerating and losing the edit.
- Leaving a hard-coded `fill="#1f2937"` in one file, so that icon ignores the theme.
- Keeping fixed `width`/`height` attributes in the source SVG, which fights `width` and CSS sizing.
- Naming a directory the same as a set prefix, producing classes that resolve to the wrong collection.
- Committing only the generated output and not the source SVGs, so nobody can rebuild the set.

## Related

- `references/apis.md`
- `best-practices/icons.md`
- `usecases/offline-icons-unocss.md`
- `usecases/tailwind-plugin-and-web-component.md`
- `usecases/per-icon-imports-and-bundle-budget.md`
