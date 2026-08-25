# configuration

## index.md

# Configuration Reference - Lua

## Lua Environment

### Environment Variables

| Variable | Description |
|----------|-------------|
| LUA_PATH | Search path for Lua modules |
| LUA_CPATH | Search path for C modules |
| LUA_INIT | Script to run on startup |
| LUA_INIT_5_3 | Lua 5.3 specific init |

### Example Paths

```bash
# Add current directory
export LUA_PATH="./?.lua;./?/init.lua;;"

# With subdirectories
export LUA_PATH="./?.lua;./?/init.lua;/usr/local/share/lua/5.3/?.lua;;"
```

## LuaJIT Configuration

### JIT Compiler Options

```lua
jit.on()           -- Enable JIT
jit.off()          -- Disable JIT
jit.flush()        -- Flush JIT cache
jit.status()       -- Show JIT status
```

### Tracing

```bash
luajit -jv script.lua    # Verbose
luajot -jdump script.lua # Dump IR
```

## IDE Configuration

### Visual Studio Code

```json
{
  "Lua.diagnostics.globals": ["vim", "enumerate"],
  "Lua.runtime.version": "LuaJIT",
  "Lua.workspace.library": [
    "${3rd}/busted/library"
  ]
}
```

### Neovim LSP

```lua
-- Using nvim-lspconfig
require('lspconfig').lua_ls.setup({
  settings = {
    Lua = {
      runtime = { version = 'LuaJIT' },
      diagnostics = { globals = { 'vim' } }
    }
  }
})
```

## Module Search Paths

```lua
-- Add paths at runtime
package.path = package.path .. ";./?.lua"

-- For C modules
package.cpath = package.cpath .. ";./?.so"
```


---
