---
name: follow-lang-rust-setup-project
description: Scaffold a new Rust crate or workspace with toolchain pin and quality gates
argument-hint: "[project-name]"
related:
  - follow-lang-rust
  - follow-tool-cargo
  - follow-architecture
  - follow-create-rust-cli
  - follow-create-rust-crate
  - setup-cicd
  - resolve-errors
  - deep-research
---

## Goal

Create a new Rust project (crate, binary, or workspace) with a pinned toolchain and quality gates wired from the first commit

## Scope

For a fresh Rust project; live-check the current stable toolchain, edition, and Cargo behavior via `/deep-research` first — read `/follow-lang-rust` for the language rules, `/follow-create-rust-cli`/`/follow-create-rust-crate` when building a CLI or published library

## Execute

### 1. Pin The Toolchain

> Goal: Pin The Toolchain.

1. `mise use -g rust` (or rustup — `rustup-init.exe` on Windows, MSVC build tools required); verify `rustc --version` and `cargo --version`
2. Pin the channel and components in `rust-toolchain.toml` (live-checked version, never copied from a template)

### 2. Scaffold

> Goal: Scaffold.

1. `cargo new my_project` (binary) or `cargo new my_lib --lib`
2. Workspace instead of single crate when multiple deliverables share code: root `Cargo.toml` with `[workspace] members`
3. Layout: `src/` source, `crates/` workspace members, `tests/` integration tests, `benches/` criterion benchmarks, `examples/` usage docs
4. Architecture: flat type-grouped folders for a single app, or Clean layers (`domain`/`application`/`infrastructure`) — run `/follow-architecture` for the choice

### 3. Configure Quality Gates

> Goal: Configure Quality Gates.

1. Follow the Configuration step of [../../SKILL.md](../../SKILL.md) for the `Cargo.toml`/lint/profile details and run `/follow-tool-cargo` for lint rules — apply them from the first commit
2. Create a `justfile` for dev scripts (`mise use -g just`)

### 4. Verify

> Goal: Verify.

1. `cargo check --workspace` → `cargo clippy` → `cargo fmt --check` → `cargo test` all green on the skeleton
2. On failure → run `/resolve-errors`

## Rules

- Commit `Cargo.toml` + `Cargo.lock` (binaries) + `rust-toolchain.toml`; CI → `/setup-cicd`

## Expected Outcome

- New Rust project compiling with a pinned toolchain, forbidden `unsafe`, strict Clippy gates, and green fmt/clippy/test from the start
