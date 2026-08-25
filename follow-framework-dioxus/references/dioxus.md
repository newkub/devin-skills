# Dioxus (Rust Framework for Desktop/Web/Mobile) Reference

## Install

### Install Rust

```bash
rustup toolchain install stable
rustup target add wasm32-unknown-unknown
```

### Install `cargo-binstall` (for prebuilt binaries)

```bash
curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
```

### Install Dioxus CLI

```bash
cargo binstall dioxus-cli
```

Or build from source (takes several minutes):

```bash
cargo install dioxus-cli
```

Verify:

```bash
dx --version
```

## Version Info

- Latest stable: `0.6.3`
- Also available: `0.7.0`
- The `dioxus` crate is the core framework; `dx` is the CLI tool

## Create a New Project

```bash
dx new hot_dog
```

Templates available:
- Bare-bones: simple setup with `main.rs` and `assets` folder
- Jumpstart: scaffolded app with components, views, and suggested structure
- Workspace: full cargo workspace setup with different crates per platform

Run the project:

```bash
cd hot_dog
dx serve
```

## Project Structure

```
├── Cargo.lock
├── Cargo.toml
├── Dioxus.toml
├── README.md
├── assets
│   ├── favicon.ico
│   ├── header.svg
│   └── main.css
└── src
    └── main.rs
```

## `Cargo.toml` Configuration

```toml
[dependencies]
dioxus = { version = "0.6.0" }

[features]
default = ["web"]
web = ["dioxus/web"]
desktop = ["dioxus/desktop"]
mobile = ["dioxus/mobile"]
```

## Basic App (`main.rs`)

```rust
use dioxus::prelude::*;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    rsx! { "HotDog!" }
}
```

## Component with Props

```rust
#[derive(Props, PartialEq, Clone)]
struct DogAppProps {
    breed: String,
}

#[component]
fn DogApp(breed: String) -> Element {
    rsx! {
        "Breed: {breed}"
    }
}
```

## Composing Components

```rust
#[component]
fn App() -> Element {
    rsx! {
        Header {}
        DogApp { breed: "corgi" }
        Footer {}
    }
}
```

## State with `use_signal`

```rust
#[component]
fn DogView() -> Element {
    let img_src = use_hook(|| "https://images.dog.ceo/breeds/pitbull/dog-3981540_1280.jpg");

    rsx! {
        div { id: "dogview",
            img { src: "{img_src}" }
        }
    }
}
```

## Event Handlers

```rust
#[component]
fn DogView() -> Element {
    let skip = move |evt| {};
    let save = move |evt| {};

    rsx! {
        div { id: "buttons",
            button { onclick: skip, id: "skip",  "skip" }
            button { onclick: save, id: "save",  "save!" }
        }
    }
}
```

## Global State with Context

```rust
#[derive(Clone)]
struct TitleState(String);

fn App() -> Element {
    use_context_provider(|| TitleState("HotDog".to_string()));
    rsx! {
        Title {}
    }
}

fn Title() -> Element {
    let title = use_context::<TitleState>();
    rsx! {
        h1 { "{title.0}" }
    }
}
```

## Global Signals

```rust
static SONG: GlobalSignal<String> = Signal::global(|| "Drift Away".to_string());

#[component]
fn Player() -> Element {
    rsx! {
        h3 { "Now playing {SONG}" }
        button {
            onclick: move |_| *SONG.write() = "Vienna".to_string(),
            "Shuffle"
        }
    }
}
```

## CLI Commands

```bash
dx new my-dioxus-app              # Create a new project
dx serve                          # Start dev server (web by default)
dx serve --platform desktop       # Serve for desktop
dx build --release                # Build for production (desktop)
dx build --release --platform web # Build for web
```

## Platform-Specific Dependencies

### Linux (Ubuntu)

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

### Windows

Depends on WebView2 (installed with Edge). If missing, install from Microsoft.

### macOS

No extra dependencies required.

## Source

- https://dioxuslabs.com/learn/0.6/getting_started/
- https://dioxuslabs.com/learn/0.6/guide/new_app/
- https://dioxuslabs.com/learn/0.6/guide/component/
- https://dioxuslabs.com/learn/0.6/guide/state/
