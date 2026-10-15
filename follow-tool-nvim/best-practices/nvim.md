# Neovim (lazy.nvim) — Best Practices

Config discipline with lazy.nvim — startup speed and a maintainable setup

## Recommended Patterns

- lazy.nvim is the plugin manager — `~/.config/nvim/lua/plugins/*.lua` per-plugin specs, `init.lua` kept minimal
- Lazy-load aggressively: `event`, `ft`, `cmd`, `keys` triggers — don't set `lazy=false` on every plugin
- Prefer the `opts` table over a `config` function when enough — lazy.nvim calls setup for you; use `config` only for custom logic
- LSP via `nvim-lspconfig` + mason (auto-installs servers) — pin mason registry versions for reproducibility
- Keymaps in `lua/config/keymaps.lua` or per-plugin spec `keys` — centralized/discoverable

## Common Pitfalls

- Startup time: `:Lazy profile` / `--startuptime` — each lazy=false plugin adds ms; audit periodically
- Plugins failing silently — check `:checkhealth` + the `:Lazy` log when a feature disappears
- Spec fragmentation: plugin config scattered = hard to debug; keep one file per plugin
- mason auto-install in headless/CI = slow — skip on CI or cache the mason dir
- Treesitter parsers: run `:TSUpdate` after upgrades; keep an ensure_installed list in config

## Maintenance

- `:Lazy sync` updates everything — review the changelog of breaking-prone plugins (lsp, treesitter) first
- Commit the `lazy-lock.json` lockfile into the dotfiles repo — enables rollback
- Minimal config test: `nvim --clean` to tell whether a problem comes from the config or a plugin

## Do / Don't

| Do | Don't |
|----|-------|
| Lazy-load via triggers | `lazy=false` defaults |
| Per-plugin spec files | One giant plugins.lua |
| Commit lazy-lock.json | Floating plugin versions |
| Profile startup periodically | Accept slow boot |
