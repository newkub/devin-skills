# Nitro — Presets, Deploy and Runtime Portability

## Recommended Patterns

### Preset Selection

- Choose the preset by deploy target: `bun`, `node-server`, `cloudflare-module`, `deno-server`, `vercel`, `netlify`, other edge providers
- v3: the `nitro()` vite plugin does not accept a `preset` option — set it only via the `NITRO_PRESET` env or `nitro.config.ts`
- Pick one method — `process.env.NITRO_PRESET ??= 'bun'` in vite.config before defineConfig or `nitro.config.ts` — never set conflicting values
- Wrong preset = output that can't run on the target — check https://nitro.build/deploy for the latest preset names

### Build Output

- `bun run build` → `.output/` is a portable artifact — `bun .output/server/index.mjs` / `node .output/server/index.mjs` per preset
- `.output/public/` serves static assets automatically — the app's public dir is mapped into it
- `.output/` is generated — never commit, always gitignore
- portable = the same code runs on every runtime — conditional logic via env vars, not compile-time branches

### Cloudflare Bindings

- preset `cloudflare-module` → output is a Worker module — deploy with `wrangler deploy`
- declare bindings in `wrangler.jsonc`: `d1_databases`, `kv_namespaces`, `r2_buckets`, `vars`
- access via `env.*` in handlers — gen types with `wrangler types` → `worker-configuration.d.ts`
- secrets via `wrangler secret put` only — never `vars` or hardcode

### Custom Server Entry

- wrap the `fetch` handler when middleware/custom logic is needed:

```ts
export default {
  fetch(request: Request, env: unknown, ctx: unknown) {
    // pre-process → delegate to framework handler
  },
}
```

- use it for auth, logging, request transformation before reaching the framework handler

## Do / Don't

| Do | Don't |
|---|---|
| Set `NITRO_PRESET` env or `nitro.config.ts` | Pass `preset` into `nitro()` plugin options (v3 doesn't accept it) |
| Pick one preset-setting method | env + config conflicting |
| `.output/` in `.gitignore` | commit build artifacts |
| secrets via `wrangler secret` / env | `vars` or hardcode in config |
| conditional via runtime env | compile-time branches per preset |
| gen `worker-configuration.d.ts` with `wrangler types` | guess bindings types yourself |

## Common Pitfalls

- `nitro({preset: 'bun'})` → v3 doesn't accept it — use env or config file
- `NITRO_PRESET` + `nitro.config.ts` set to different values → undefined behavior
- deploying to Cloudflare without declaring bindings → `env.X` undefined at runtime
- assuming Node APIs on an edge preset → `fs`, `path` don't exist on Cloudflare — use portable APIs
- committing `.output/` → repo bloat + stale artifacts
- server entry `fetch` not delegating to the framework → app routes don't work

## Performance Notes

- the `.output` bundle is fast + low cold start on edge presets — Nitro tree-shakes well
- static assets in `.output/public/` are served from CDN/edge automatically — no separate CDN needed
- code splitting: Nitro splits routes/handlers — lazy load per request path
- cache headers set via route rules or custom entry — static assets have defaults

## Ecosystem / Integration

- TanStack Start, Analog, Nuxt already use Nitro — this skill is for Nitro when you must configure it yourself or understand the layer
- deploy docs: https://nitro.build/deploy — preset list + provider guides
- `/follow-service-cloudflare` for in-depth deploy/secrets/rollback
- `/follow-tool-vite` for Vite config integration
- `/deep-research` to confirm the latest preset names — Nitro adds providers often
