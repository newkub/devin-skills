# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `wasm-pack` |
| Registry | `crates.io` |
| Latest Version | `0.15.0` |
| Release Date | `2026-05-15` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | wasm-bindgen working group |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/wasm-bindgen/wasm-pack` |
| Website | `https://wasm-bindgen.github.io/wasm-pack/` |
| Documentation | `https://wasm-bindgen.github.io/wasm-pack/` |
| Releases / Changelog | `https://github.com/wasm-bindgen/wasm-pack/releases` |

## Install

```bash
cargo install wasm-pack
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `wasm-bindgen` | `crates.io` | `0.2.128` (2026-09-04) | JS bindings for `#[wasm_bindgen]` exports |
| `serde-wasm-bindgen` | `crates.io` | `0.6.5` (2024-02-27) | Serde-based object marshalling (`RReverser/serde-wasm-bindgen`, MIT) |
| Rust toolchain | `GitHub Releases` | `1.98.1` (2026-09-03) | `rustc`/`cargo` — `rust-lang/rust`; add `wasm32-unknown-unknown` target |
| `vite-plugin-wasm-pack` | `npm` | `0.1.12` (2022-05-20) | Vite plugin for `wasm-pack` crates — stale but still the standard option |
| `vite` | `npm` | `8.3.0` (2026-09-10) | Frontend build tool |
| `solid-js` | `npm` | `1.9.15` (2026-08-17) | Frontend framework (`vite --template solid-ts`) |
| `vite-plugin-wasm` | `npm` | `unknown` | Alternative when importing `.wasm` directly (pair with `vite-plugin-top-level-await`) |

## Notes

- Breaking changes in latest major: `wasm-pack` 0.15 keeps the same `--target web` flow; `crate-type = ["cdylib"]` still required in `Cargo.toml`
- `vite-plugin-wasm-pack` has not been published since 2022 — verify compatibility with Vite 8 before relying on it; fall back to manual `wasm-pack build` + ESM import if it fails
- Version pinned in SKILL.md: Rust `1.98.1`, `wasm-pack@0.15.0`, `wasm-bindgen@0.2.128`, `serde-wasm-bindgen@0.6.5`, `vite-plugin-wasm-pack@0.1.12` — all match latest as of 2026-09-12
