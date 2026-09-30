# gpui-kit — Package Manifest

| Field | Value |
|-------|-------|
| Package | `gpui-kit` |
| Registry | crates.io — <https://crates.io/crates/gpui-kit> |
| Latest | v0.7.0 (docs latest tag; เช็คสดด้วย `cargo search gpui-kit` ทุกครั้ง) |
| Known versions | 0.6.0, 0.6.1, 0.6.2, 0.6.4, 0.6.6, 0.7.0 |
| Author | Longbridge — <https://github.com/longbridge> |
| License | Apache-2.0 (code) |
| Repository | <https://github.com/longbridge/gpui-kit> |
| Website | <https://gpui-kit.com> |
| API Docs | <https://docs.rs/gpui-kit>, <https://docs.rs/gpui-component> |
| Changelog | <https://gpui-kit.com/releases> |

## Install

```sh
cargo add gpui-kit
```

```toml
[dependencies]
gpui-kit = "0.7"  # verify latest before pinning
```

## Contents

Dependency เดียวรวม:

- `gpui` — UI framework (Zed Industries) re-exported ผ่าน `gpui_kit::*`
- GPUI Base — primitives
- GPUI Component — styled component library (`gpui_kit::component`)
- default icon assets (`assets::Assets` — Lucide + Isocons)

## Platform Requirements

ตาม `/docs/installation`: macOS / Windows (MSVC) / Linux (system libs เช่น fontconfig, x11/wayland deps) — เช็ค official installation page ต่อ platform. รองรับ WebAssembly target ผ่าน guide `/docs/webassembly`.
