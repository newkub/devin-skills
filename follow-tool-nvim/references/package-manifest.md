# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `neovim` |
| Registry | `GitHub Releases` |
| Latest Version | `0.12.5` |
| Release Date | `2026-08-23` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Neovim team` (neovim org) |
| License | `Apache-2.0` |
| Repository | `https://github.com/neovim/neovim` |
| Website | `https://neovim.io` |
| Documentation | `https://neovim.io/doc/` |
| Releases / Changelog | `https://github.com/neovim/neovim/releases` |

## Install

```bash
mise use -g neovim
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `lazy.nvim` | `GitHub Releases` | `11.17.5` | Plugin manager bootstrapped by this skill — latest release `v11.17.5` (2025-11-06) |
| `plenary.nvim` | `GitHub` | — | Lua utility lib used for `PlenaryBusted*` unit tests |
| `stylua` | `crates.io` | — | Lua formatter used in CI (`stylua --check .`) |

## Notes

- Breaking changes in latest major: `Neovim 0.12 adds built-in vim.pack plugin manager — lazy.nvim still supported but optional for minimal configs`
- Version pinned in SKILL.md: `neovim 0.12.5` / `lazy.nvim 11.17.5`
- Alternative installs: `scoop install neovim` (Windows), `brew install neovim` (macOS), distro package managers
- Source: `https://api.github.com/repos/neovim/neovim/releases/latest`
