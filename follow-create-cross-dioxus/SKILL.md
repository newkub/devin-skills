---
name: follow-create-cross-dioxus
description: Set up and develop Desktop, Web, and Mobile applications with the Dioxus Rust framework
argument-hint: "[scope]"
related:
  - follow-best-practice
  - setup-cicd
  - deep-review

---

## Goal

Set up and develop Desktop, Web, and Mobile applications with the Dioxus Rust framework

## Scope

Configure Dioxus to build cross-platform applications (Desktop, Web, Mobile) with Rust and React-like components

- Install the Dioxus CLI and dependencies
- Configure `Cargo.toml` and `Dioxus.toml`
- Develop the application with Rust
- Build for multiple platforms

- Packages: `dioxus` crate + `dioxus-cli` (`dx`) — always confirm the latest version via `/deep-research` + `/follow-best-practice` (0.8.x is pre-release — never adopt without checking migration notes; no pins in this file, per `/update-agents-skills-global`)

## Execute

### 1. Check Precondition

> Goal: verify the environment before starting

1. Run `/deep-research` + `/follow-best-practice` to confirm the latest version and patterns, then run `/deep-review` to summarize the tech stack
2. Confirm Rust/Cargo are installed (`rustc --version`, `cargo --version`)
3. Install the `wasm32-unknown-unknown` target for Web (`rustup target add wasm32-unknown-unknown`)
4. Linux desktop builds require WebKitGTK — `sudo apt install libwebkit2gtk-4.1-dev build-essential libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`; Windows uses WebView2 (ships with Edge); macOS needs nothing extra
5. After installing the CLI, run `dx doctor` to check for missing toolchains per platform

### 2. Setup

> Goal: install the Dioxus CLI and create the project

1. Install the Dioxus CLI (pick one method):
   - prebuilt binary: `curl -sSL https://dioxus.dev/install.sh -o /tmp/dioxus-install.sh && bash /tmp/dioxus-install.sh`
   - `cargo binstall dioxus-cli --force`
   - build from source (slow): `cargo install dioxus-cli`
2. Verify `dx --version`
3. Create a project: `dx new my-dioxus-app` and pick a template (Bare-bones, Jumpstart, Workspace)
4. Or init in an existing directory: `dx init` / hand-write `Cargo.toml` with the `dioxus` dependency

### 3. Configure

> Goal: set up `Cargo.toml` and `Dioxus.toml`

1. Declare the `dioxus` dependency in `Cargo.toml` with features matching the target
2. Create `Dioxus.toml` defining `default_platform`, `out_dir`, `asset_dir`
3. Set `web.proxy` when connecting to an API backend
4. Check the release profile: `opt-level = 3` and `lto = true`

### 4. Develop

> Goal: build components and run the development server

1. Create `src/main.rs` with `launch(app)` and the component tree
2. Use `use_signal` for state
3. Split reusable components into `src/components/`
4. Run `dx serve` or `dx serve --platform desktop`

### 5. Build

> Goal: build for production

1. Desktop: `dx build --release`
2. Web: `dx build --release --platform web`
3. Use `dx bundle` when a distributable bundle (installer/app image) is needed
4. Verify `dist/` contains the correct output

## Rules

### 1. Project Structure

- `Cargo.toml` for Rust dependencies
- `Dioxus.toml` for Dioxus config
- `src/main.rs` for the entry point
- `src/components/` for reusable components
- `dist/` for build output

### 2. Rust Requirements

- Rust must be installed
- Install `dioxus-cli` via `cargo install dioxus-cli`
- Use the `dioxus` crate in `Cargo.toml`
- Use `dx serve` for development

### 3. Platform Targets

- Desktop: default platform
- Web: requires the `wasm32-unknown-unknown` target
- Mobile: use the Dioxus mobile target per official docs

- Use /follow-create-mobile-cross-with-capacitor if needed (create cross dioxus)
- Use /follow-best-practice if needed
- Use /setup-cicd if needed
- Use /deep-review if needed

## Expected Outcome

- Dioxus CLI installed and working
- Project created successfully
- Development server runs
- Production build produces a working executable
