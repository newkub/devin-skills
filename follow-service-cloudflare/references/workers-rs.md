# Cloudflare Workers in Rust (workers-rs)

Write Cloudflare Workers in 100% Rust via WebAssembly — the `worker` crate (Apache-2.0, `cloudflare/workers-rs`) compiles to `wasm32-unknown-unknown` and deploys with the same Wrangler tooling

Latest: crate `worker` (check the current version via `/follow-up-to-date` before use)

## 1. Create From Template

```sh
cargo generate cloudflare/workers-rs
```

- Pick the template matching the use case; generation asks about `panic=unwind` + abort recovery (panic recovery) — enable it when the worker must not crash on panic
- Project layout: `src/lib.rs` is the entrypoint; any crate/module works as long as it compiles to `wasm32-unknown-unknown`

## 2. Fetch Handler

```rust
use worker::*;

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    console_log!("{} {}", req.method(), req.path());
    Response::ok("Hello from Rust!")
}
```

- `#[event(fetch, respond_with_errors)]` when errors should become responses instead of throwing
- `Router::new()` supports `:param` and `*wildcard` routes — `Router::with_data(D)` shares arbitrary data with handlers

## 3. Bindings Config (wrangler.toml / jsonc)

- `env` reads secrets/vars from the same config as TS Workers (see `references/bindings.md`)
- Durable Objects: `#[durable_object]` annotation on the struct + a binding under `[durable_objects]` in the wrangler config; DO SQL storage via `SqlStorage`
- Queue and cron events use `#[event(queue)]` / `#[event(scheduled)]` handlers

## 4. Run And Deploy

```sh
bunx wrangler dev      # local dev — identical to the TS path
bunx wrangler deploy   # configure routes/zones in the wrangler config first
```

- Deploy/watch/rollback reuse this skill's workflows (`workflows/deploy-worker/`, `workflows/verify-connection/`) — workers-rs changes nothing in tooling
- CI keeps using `CLOUDFLARE_API_TOKEN` (see `references/ci-cd.md`); the runner needs the Rust toolchain + `wasm32-unknown-unknown` target (`/follow-tool-mise` can manage it)

## 5. http Feature

- The `worker` crate has an `http` feature flag that starts replacing custom types with types from the `http` crate — enable when interop with ecosystem crates matters more than API stability

## Rules

- Build with the `release` profile + `wasm-opt` per the template — bundle size limits still apply to wasm
- TS type generation (`wrangler types`) does not cover Rust — read bindings from `env` against the config by hand
- WASM Workers CPU/memory limits differ from JS Workers — check current official limits before heavy compute (`/deep-research`)
- Debugging: `console_log!` + `wrangler tail` (see `references/tail-and-logs.md`)

## Source

- https://github.com/cloudflare/workers-rs
- https://developers.cloudflare.com/workers/languages/rust/
