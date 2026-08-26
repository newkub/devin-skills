# Install Bun

## Install Script

macOS and Linux:

`curl -fsSL https://bun.com/install | bash`

Windows (PowerShell):

`powershell -c "irm bun.sh/install.ps1|iex"`

Bun requires Windows 10 version 1809 or later.
On Linux, ensure `unzip` is installed and use kernel 5.6 or higher for best results.

## Verify

- `bun --version` — check installed version
- `bun --revision` — check precise build commit

## Package Managers

- npm: `npm install -g bun` (installs Bun runtime itself, not a project dependency)
- Homebrew: `brew install oven-sh/bun/bun`
- Scoop: `scoop install bun`

## Docker

`docker pull oven/bun`

`docker run --rm --init --ulimit memlock=-1:-1 oven/bun`

Image variants: `debian`, `slim`, `distroless`, `alpine`.

## Upgrade

- `bun upgrade`
- `bun upgrade --canary`
- `bun upgrade --stable`
- Homebrew: `brew upgrade bun`
- Scoop: `scoop update bun`

Canary builds upload crash reports automatically.

## System Requirements

- CPU: x64 with SSE4.2 (Intel Nehalem or newer, AMD Bulldozer or newer)
- macOS: macOS 13.0 or later
- Linux: glibc 2.17 or newer; use musl binary for musl-based distros
- Windows: Windows 10 version 1809 or later

## PATH

- macOS/Linux: add `export BUN_INSTALL="$HOME/.bun"` และ `export PATH="$BUN_INSTALL/bin:$PATH"` ไปยัง shell config
- Windows: add `%USERPROFILE%\.bun\bin` ไปยัง `Path` environment variable

## Uninstall

- macOS/Linux: `rm -rf ~/.bun`
- Windows: `powershell -c ~\.bun\uninstall.ps1`

## Reference

- https://bun.com/docs/installation
