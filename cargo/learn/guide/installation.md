# Installation

## วิธีการติดตั้ง Cargo

Cargo มาพร้อมกับ Rust toolchain โดยติดตั้งผ่าน rustup

## วิธีที่ 1: ผ่าน rustup (แนะนำ)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

หรือบน Windows:

```powershell
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
.\rustup-init.exe
```

## วิธีที่ 2: ผ่าน Package Manager

### macOS (Homebrew)

```bash
brew install rust
```

### Windows (Chocolatey)

```powershell
choco install rust
```

### Linux (apt)

```bash
sudo apt install rustc cargo
```

## ตรวจสอบการติดตั้ง

```bash
cargo --version
rustc --version
```

## ตั้งค่า Environment Variables

```bash
# Cargo home directory
export CARGO_HOME="$HOME/.cargo"

# เพิ่ม PATH
export PATH="$CARGO_HOME/bin:$PATH"
```

## ตั้งค่า Cargo Config

สร้างไฟล์ `~/.cargo/config.toml`:

```toml
[build]
jobs = 4

[alias]
b = "build"
t = "test"
r = "run"
```

## การอัปเดต

```bash
rustup update
```

## การถอนการติดตั้ง

```bash
rustup self uninstall
```

## การติดตั้ง Nightly Version

```bash
rustup install nightly
rustup default nightly
```

## การติดตั้ง Multiple Toolchains

```bash
rustup install stable beta nightly
rustup default stable
```

## การติดตั้ง Components เพิ่มเติม

```bash
rustup component add rustfmt
rustup component add clippy
rustup component add rust-analyzer
```

## การติดตั้ง Targets เพิ่มเติม

```bash
rustup target add x86_64-unknown-linux-musl
rustup target add wasm32-unknown-unknown
rustup target add aarch64-apple-darwin
```

## การติดตั้งใน CI/CD

### GitHub Actions

```yaml
- uses: actions/checkout@v3
- uses: actions-rs/toolchain@v1
  with:
    toolchain: stable
    components: rustfmt, clippy
```

### Docker

```dockerfile
FROM rust:latest

WORKDIR /app
COPY . .

RUN cargo build --release
```

## การแก้ปัญหาทั่วไป

### ไม่พบ cargo

```bash
# ตรวจสอบ PATH
echo $PATH

# รีสตาร์ท terminal หรือ reload shell
source ~/.bashrc
```

### Permission errors

```bash
# ใช้ rustup แทนการ install manual
rustup install stable
```

### Network issues

```toml
# ~/.cargo/config.toml
[net]
retry = 3
git-fetch-with-cli = true
```

## References

- [Rustup Documentation](https://rust-lang.github.io/rustup/)
- [Cargo Installation Guide](https://doc.rust-lang.org/cargo/getting-started/installation.html)
