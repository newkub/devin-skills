# Integration

## Tool Integration กับ Cargo

## IDE Integration

### VS Code

ติดตั้ง extensions:

- **rust-analyzer** - Language server
- **CodeLLDB** - Debugger
- **Even Better TOML** - TOML support

ตั้งค่า `.vscode/settings.json`:

```json
{
  "rust-analyzer.cargo.loadOutDirsFromCheck": true,
  "rust-analyzer.checkOnSave.command": "clippy",
  "rust-analyzer.cargo.features": "all"
}
```

### IntelliJ IDEA

ติดตั้ง **Rust plugin** จาก marketplace

### Neovim

ใช้ `rust-tools.nvim` หรือ `nvim-lspconfig`:

```lua
require('lspconfig').rust_analyzer.setup({
  settings = {
    ['rust-analyzer'] = {
      cargo = {
        loadOutDirsFromCheck = true,
      },
    },
  },
})
```

## Build Tools Integration

### Make

```makefile
.PHONY: build test clean

build:
	cargo build --release

test:
	cargo test

clean:
	cargo clean
```

### CMake

```cmake
find_package(Rust)

add_rust_target(my_crate
    CARGO_PROJECT ${CMAKE_SOURCE_DIR}
    CRATE my_crate
)
```

### Meson

```meson
rust_exe = executable('my_crate',
  'src/main.rs',
  rust_std: ['std'],
  dependencies: [rust_dep],
)
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Rust CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        rust: [stable, beta, nightly]
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: ${{ matrix.rust }}
          components: rustfmt, clippy
      - run: cargo test
      - run: cargo clippy -- -D warnings
      - run: cargo fmt -- --check
```

### GitLab CI

```yaml
test:
  image: rust:latest
  script:
    - cargo test
    - cargo clippy
    - cargo fmt -- --check
```

### Travis CI

```yaml
language: rust
rust:
  - stable
  - beta
  - nightly
script:
  - cargo test
  - cargo clippy
```

## Docker Integration

### Multi-stage Build

```dockerfile
# Build stage
FROM rust:1.70 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim
COPY --from=builder /app/target/release/my-app /usr/local/bin/
CMD ["my-app"]
```

### Alpine Build

```dockerfile
FROM rust:alpine as builder
RUN apk add --no-cache musl-dev
WORKDIR /app
COPY . .
RUN cargo build --release
```

## Package Manager Integration

### Homebrew Formula

```ruby
class MyApp < Formula
  desc "My Rust Application"
  homepage "https://github.com/user/my-app"
  url "https://github.com/user/my-app/archive/v1.0.0.tar.gz"
  sha256 "..."
  
  depends_on "rust"
  
  def install
    system "cargo", "install", "--locked", "--root", prefix, "--path", "."
  end
end
```

### AUR Package (Arch Linux)

```bash
pkgname=my-app
pkgver=1.0.0
pkgrel=1
pkgdesc="My Rust Application"
arch=('x86_64')
url="https://github.com/user/my-app"
license=('MIT')
makedepends=('rust')
source=("$url/archive/v$pkgver.tar.gz")
sha256sums=('...')

build() {
  cd "$pkgname-$pkgver"
  cargo build --release
}

package() {
  cd "$pkgname-$pkgver"
  install -Dm755 target/release/my-app "$pkgdir/usr/bin/my-app"
}
```

## Cross-Compilation

### Cross Tool

```bash
cargo install cross
cross build --target x86_64-unknown-linux-musl
```

### Manual Cross-Compilation

```bash
rustup target add x86_64-unknown-linux-musl
cargo build --target x86_64-unknown-linux-musl
```

## Testing Integration

### Tarpaulin (Coverage)

```bash
cargo install cargo-tarpaulin
cargo tarpaulin --out Html
```

### Criterion (Benchmarking)

```toml
[dev-dependencies]
criterion = "0.5"
```

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 1,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("fibonacci 20", |b| {
        b.iter(|| fibonacci(black_box(20)))
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
```

## Documentation Integration

### mdBook

```bash
cargo install mdbook
mdbook build
```

### Cargo Doc

```bash
cargo doc --no-deps --open
```

## Linting Integration

### Clippy

```bash
cargo clippy
cargo clippy --fix
```

### Rustfmt

```bash
cargo fmt
cargo fmt --check
```

## Pre-commit Hooks

### Husky

```bash
cargo install cargo-husky
cargo husky install
```

```bash
# .husky/pre-commit
cargo fmt
cargo clippy
cargo test
```

### Lefthook

```yaml
# lefthook.yml
pre-commit:
  commands:
    fmt:
      run: cargo fmt
      glob: "*.rs"
    clippy:
      run: cargo clippy
      glob: "*.rs"
    test:
      run: cargo test
```

## Next Steps

- อ่าน [architecture.md](./architecture.md) สำหรับ system architecture
- อ่าน [structure.md](./structure.md) สำหรับ project structure
