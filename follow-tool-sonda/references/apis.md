| key | value |
|---|---|
| package | `sonda` |
| install | `bun add -D sonda` |
| stable version | 0.14.0 (verified 2026-10-03) |
| license | MIT |
| docs | https://sonda.dev |
| repository | https://github.com/filipsobol/sonda |

| api | description | signature/example |
|---|---|---|
| `sonda/vite` | Vite plugin | `import Sonda from 'sonda/vite'` → `plugins: [Sonda()]` |
| `sonda/rollup` | Rollup plugin | `import Sonda from 'sonda/rollup'` |
| `sonda/rolldown` | Rolldown plugin | `import Sonda from 'sonda/rolldown'` |
| `sonda/esbuild` | esbuild plugin | `import Sonda from 'sonda/esbuild'` |
| `sonda/webpack` | webpack plugin | `import Sonda from 'sonda/webpack'` |
| `sonda/rspack` | Rspack plugin | `import Sonda from 'sonda/rspack'` |
| framework integrations | Next.js, Nuxt, Astro, SvelteKit, Angular CLI | see https://sonda.dev/getting-started.html |
| `enabled` | Enable/disable the plugin | `Sonda({ enabled: true })` (default) |
| `include` | RegExp patterns of assets to include | `Sonda({ include: [/\.js$/] })` |
| `exclude` | RegExp patterns of assets to exclude (wins over `include`; `.map`/`.d.ts` always excluded) | `Sonda({ exclude: [/\.css$/] })` |
| `format` | output format `'html'` \| `'json'` or an array | `Sonda({ format: ['html', 'json'] })` |
| `filename` | report file name (absolute path overrides `outputDir`) | `Sonda({ filename: 'sonda_[index]' })` (default) |
| `outputDir` | report directory | `Sonda({ outputDir: '.sonda' })` (default) |
| `open` | auto-open the report after build | `Sonda({ open: false })` for CI |
| `deep` | read source maps of imported modules, break deps into source files | `Sonda({ deep: true })` |
| `sources` | embed source code in the report (inspect code feature) | `Sonda({ sources: true })` |
| `gzip` | report GZIP compressed sizes | `Sonda({ gzip: true })` |
| `brotli` | report Brotli compressed sizes | `Sonda({ brotli: true })` |
| `server` | generate the report for server bundles (framework integrations only) | `Sonda({ server: true })` |
