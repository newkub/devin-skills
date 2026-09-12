# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `lazy.nvim` |
| Registry | `GitHub Releases` |
| Latest Version | `11.17.5` (tag `v11.17.5`) |
| Release Date | `2025-11-06` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Folke Lemaitre (folke)` |
| License | `Apache-2.0` |
| Repository | `<https://github.com/folke/lazy.nvim>` |
| Website | `<https://lazy.folke.io>` |
| Documentation | `<https://lazy.folke.io>` |
| Releases / Changelog | `<https://github.com/folke/lazy.nvim/releases>` |

## Install

```lua
-- bootstrap in init.lua: git clone folke/lazy.nvim into lazypath, then
require('lazy').setup('plugins')
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `neovim` | `GitHub Releases` | `0.12.5` (2026-08-23, tag `v0.12.5`) | host editor; >= 0.8.0 required; 0.12 ships built-in `vim.pack` as lazy.nvim alternative |
| `git` | `system` | `unknown` | >= 2.19.0 required for plugin installs |

## Notes

- Breaking changes in latest major: `lazy.nvim 11.x requires Neovim >= 0.8; Neovim 0.12 adds built-in vim.pack plugin manager`
- Version pinned in SKILL.md: `lazy.nvim 11.17.5`, `Neovim 0.12.5` (verified 2026-09-12)
