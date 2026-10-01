# Neovim (lazy.nvim) — Best Practices

Config discipline ด้วย lazy.nvim — startup speed และ maintainable setup

## Recommended Patterns

- lazy.nvim เป็น plugin manager — `~/.config/nvim/lua/plugins/*.lua` per-plugin specs, `init.lua` เล็กสุด
- Lazy-load aggressively: `event`, `ft`, `cmd`, `keys` triggers — อย่า `lazy=false` ทุก plugin
- `opts` table แทน `config` function เมื่อพอ — lazy.nvim call setup ให้; `config` เมื่อต้อง custom logic
- LSP ผ่าน `nvim-lspconfig` + mason (auto-install servers) — pin mason registry versions สำหรับ reproducibility
- Keymaps ใน `lua/config/keymaps.lua` หรือ per-plugin spec `keys` — centralized/discoverable

## Common Pitfalls

- Startup time: `:Lazy profile` / `--startuptime` — plugin ที่ lazy=false เพิ่มทีละ ms; audit เป็นระยะ
- Plugin ล้มเงียบ — `:checkhealth` + `:Lazy` log เมื่อ feature หาย
- Spec fragmentation: plugin config กระจาย = debug ยาก; รวม per-plugin file
- mason auto-install ใน headless/CI = ช้า — skip บน CI หรือ cache mason dir
- Treesitter parsers: `:TSUpdate` หลัง upgrade; ensure_installed list ใน config

## Maintenance

- `:Lazy sync` updates ทั้งหมด — review changelog ของ breaking plugins (lsp, treesitter) ก่อน
- Lockfile `lazy-lock.json` commit เข้า dotfiles repo — rollback ได้
- Minimal config test: `nvim --clean` เมื่อ debug ว่าปัญหามาจาก config หรือ plugin

## Do / Don't

| Do | Don't |
|----|-------|
| lazy-load via triggers | `lazy=false` defaults |
| per-plugin spec files | giant single plugins.lua |
| commit lazy-lock.json | floating plugin versions |
| profile startup เป็นระยะ | accept slow boot |
