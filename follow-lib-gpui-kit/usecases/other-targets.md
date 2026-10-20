# Use Case — Running on Other Targets (WebAssembly)

> Browser showcase of the same Rust views. Source: https://gpui-kit.com/docs/webassembly (accessed 2026-10-20)

Scope first (docs' own words): WASM support is used primarily to showcase and try components in a browser — the gallery builds and runs, but full-application distribution over WASM is not validated in the repo. Treat browser support, a11y, input, startup cost, and deployment as work to verify per product.

## Run the gallery locally (verified from docs)

```sh
cd crates/story-web
rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli --version 0.2.121   # must match Cargo.lock's wasm-bindgen
make dev                                            # builds WASM + bindings, installs deps, starts Vite
```

Open `http://localhost:3000/gallery/` (not the server root). The `rust-toolchain.toml` there selects nightly. After Rust edits run `make build-wasm-dev` in another terminal and reload — Vite does not compile Rust. Production: `make build-prod` → `www/dist/` on the `/gallery/` base path.

## Entry-point shape (verified from docs)

| Stage | File or API | Establishes |
|---|---|---|
| Compile | `scripts/build-wasm.sh` | `cargo rustc` cdylib for `wasm32-unknown-unknown`, then `wasm-bindgen --target web` writes bindings into `www/src/wasm/` |
| Load | `www/index.html` + `www/src/main.js` | loader imports generated bindings, awaits default initializer (JS→Rust boundary) |
| Start | `#[wasm_bindgen] run(...)` in `src/lib.rs` | `gpui_kit::platform::web_init()`, web `Application`, assets, `run_embedded`; the returned `ApplicationHandle` is retained in thread-local storage |
| Open | launch closure in `src/lib.rs` | graphics ready → `init(cx)`, load fonts, apply theme, `gpui_kit::open_window` — first paint happens only here |

Platform constraints: `WebPlatform::new_with_backend_and_font_fallback`; backend `Auto` tries WebGPU then WebGL2; ONE document canvas and ONE top-level window — a second window or reopening a closed one is unsupported; render dialogs through Kit's `Root` inside that window. `gpui_kit::web` re-exports `gpui-pre-web` — never add it as a direct dependency.

## Fonts (verified from docs)

The web platform starts with no installed font database. The gallery embeds `include_bytes!` subsets — Inter (UI), JetBrains Mono (code), Noto Sans SC (CJK used by stories), IBM Plex Sans (`.SystemUIFont`) — loaded before the first window, then re-forced after theme application (a theme can name a desktop-only family).

Post-startup font download works: `cx.text_system().add_fonts(vec![Cow::Owned(font_bytes)])?; cx.refresh_windows();` with a raw TTF (not a CSS service response); pair with `cx.on_missing_glyphs(...)` retained subscription + task, check HTTP status and nonempty body. Canvas fallback `CanvasFontFallback::EmojiAndCjk` lets the browser draw eligible missing emoji/Han/kana/Hangul — chosen at `WebPlatform` construction, applied before missing-glyph reporting (Canvas-drawn CJK never triggers `on_missing_glyphs`).

## Verification order (from docs)

1. terminal reaches Vite's URL with no Rust/wasm-bindgen error
2. Network panel: generated JS and `.wasm` requests succeed at `/gallery/`
3. loading indicator gives way to the gallery AND a button click reaches the Rust view — indicator removal alone only proves the loader called `run(...)`

Serve `.wasm` as `application/wasm`; mismatched `wasm-bindgen-cli` vs lockfile versions is the top instantiation failure. Blank icons: the asset loader concatenates `endpoint + "/assets/icons/..."` literally — no trailing slash on your endpoint.

## Plan-for checklist (condensed from docs table)

| Concern | What to check in your app |
|---|---|
| Assets | host requested paths; endpoint matches deploy path; failed fetch leaves icons blank |
| Keyboard/IME | hidden input drives composition; test focus, Tab order, on-screen keyboards per device |
| Accessibility | painted canvas — verify screen-reader/keyboard behavior in-browser; provide HTML alternatives where needed |
| Native services | file dialogs, clipboard, notifications differ per target — capability-gate and test the browser path |
| Package size | subset fonts ride inside the WASM payload; measure compressed transfer + cold vs warm load on a throttled connection |

## Pitfalls

- shipping a full app on WASM assuming desktop parity — docs mark this path unvalidated; measure startup/download first
- two `gpui` stacks: keep `gpui-kit` as the single dependency; `gpui-pre-web` comes in as `gpui_kit::web`
- nightly-only target toolchain — pin per-crate `rust-toolchain.toml` like `crates/story-web`, don't force the whole workspace nightly
- changed `Cargo.lock` without reinstalling the matching `wasm-bindgen-cli` (`cargo install -f wasm-bindgen-cli --version <locked>`)
