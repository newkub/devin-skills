# Lua Toolchain

| key | value |
|-----|-------|
| language | Lua (dialect choice is per host: PUC Lua 5.x, LuaJIT, Luau, or embedded) |
| interpreter install | `mise use -g lua` (or the host's bundled runtime) |
| package manager | LuaRocks |
| official docs | https://www.lua.org/manual/ |
| version policy | never pinned here — live-check dialect/version + library availability via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `lua` / `luajit` | interpreter / REPL | `mise use -g lua`; host-bundled for embedded use |
| `luarocks` | package manager (`install`, `search`, `list`, `which`) | bundled with LuaRocks install |
| `luacheck` | linter / static analysis (`.luacheckrc`, `std` per dialect) | `luarocks install luacheck` |
| `busted` | BDD test runner (`*_spec.lua`) | `luarocks install busted` |
| `luacov` | coverage for busted | `luarocks install luacov` |
| StyLua / `luaformatter` | formatter (pick one per project) | cargo/rustx or `luarocks install luaformatter` |
| lua-language-server (LuaLS) | LSP: diagnostics, completion, debugger (`.luarc.json`) | editor extension or `mise use -g lua-language-server` |
| ZeroBrane Studio | interactive debugger alternative | per-platform installer |
