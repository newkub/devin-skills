| key | value |
|---|---|
| package | catalog skill — no package of its own; dispatches to `workflows/unified/SKILL.md` + `workflows/frontend-lib/SKILL.md` |
| install | per plugin: `bun add -D <plugin>` — pin a version published ≥7 days ago |
| version | resolved per plugin at install time — never pin the catalog skill |
| license | per plugin — verify on npm before adding |
| docs | https://vite.dev/plugins/ (official plugin list) |
| catalog | `workflows/unified/` (unplugin-*), `workflows/frontend-lib/` (framework, css, assets, routing, PWA, platform) |
| discovery | `/search-github-star`, `/search-raindrop`, awesome-vite — stars + last publish for maintenance |

| api | description | signature/example |
|---|---|---|
| `vite-plugin-react` / `@vitejs/plugin-react` | official React adapter — Fast Refresh + JSX transform (catalog lists `vite-plugin-react` as the successor) | `plugins: [react()]` |
| `vite-plugin-react-swc` / `@vitejs/plugin-react-swc` | React via SWC instead of Oxc | `plugins: [reactSwc()]` |
| `@vitejs/plugin-vue` | Vue 3 SFC compiler | `plugins: [vue()]` |
| `@sveltejs/vite-plugin-svelte` | Svelte/SvelteKit official | `plugins: [svelte()]` |
| `vite-plugin-solid` | Solid JSX transform | `plugins: [solid()]` |
| `unplugin-auto-import` | on-demand API imports + `auto-imports.d.ts` | `AutoImport({ imports: ['vue'] })` |
| `unplugin-vue-components` | auto component registration with resolvers | `Components({ resolvers: [ElementPlusResolver()] })` |
| `unplugin-icons` | any Iconify set as components | `Icons({ compiler: 'vue3' })` |
| `unplugin-vue-router` | type-safe file-based routing (Vue) | `VueRouter({ routesFolder: 'src/pages' })` |
| `unplugin-fonts` | Google/local font loading | `Fonts({ fonts: { google: { families: [...] } } })` |
| `unplugin-unused` | unused export/file audit | dev-only diagnostic |
| `unplugin-turbo-console` | console with jump-to-source | dev-only DX |
| `vite-plugin-singlefile` | inline all assets into one HTML file | per frontend-lib catalog |
| rolldown compat | plugin must support Vite 8 / Rolldown hooks | check before adding a Rollup-only plugin |
