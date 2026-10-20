# Use Case — Production Build, Preview and Deploy

> Build once, verify the built output locally, and deploy only what `dist/` contains. Source: https://vite.dev/guide/build (accessed 2026-10-20)

## 1. Build config

```ts
// vite.config.ts
export default defineConfig({
  base: "/app/",                 // sub-path deploys; "/" for a root domain
  build: {
    outDir: "dist",
    sourcemap: true,             // upload to the error tracker, do not serve publicly
    target: "es2022",
    assetsInlineLimit: 4096,
    rollupOptions: { output: { manualChunks: { vendor: ["react", "react-dom"] } } },
  },
})
```

`build.target` must match the browsers you support — Vite no longer down-levels legacy syntax by default.

## 2. Verify the artifact, not the dev server

```bash
bunx vite build
bunx vite preview --port 4173
```

`vite preview` serves `dist/` with production semantics: check the SPA fallback, asset URLs (`base`), and inlined env here before deploying.

## 3. Deploy

- Static hosting of an SPA: rewrite unknown paths to `index.html`.
- Cloudflare Workers / Nitro: use the target preset instead of static files (`/follow-service-cloudflare`).
- Hashed assets: `immutable` cache headers; `index.html`: `no-cache`.

## Pitfalls

- `base` left at `/` when deploying under a sub-path → every asset 404s.
- Judging performance from `vite preview` → it is not a CDN; measure the deployed build.
- Committing `dist/` → artifacts in git; fix with `/update-gitignore`.
- No SPA fallback → deep links work in dev and 404 in production.

## Related

- `references/apis.md`
- `usecases/dev-proxy-and-env.md`
