# Rust Install and Version Info

## Install

Install Rust via `rustup` (recommended):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

On Windows, download and run `rustup-init.exe` from https://win.rustup.rs then follow on-screen instructions. The MSVC build tools for Visual Studio 2013 or later are required.

Update an existing installation:

```bash
rustup update stable
```

Verify installation:

```bash
rustc --version
cargo --version
```

## Version Info

- Latest stable: `1.98.0` (as of Aug 2026)
- Rust has a 6-week rapid release process
- Channels: `stable`, `beta`, `nightly`
- Tools installed to `~/.cargo/bin` (Unix) or `%USERPROFILE%\.cargo\bin` (Windows)
