# Configuration - Lua

## ภาพรวมการตั้งค่า Lua

Lua มีหลายวิธีในการตั้งค่า ตั้งแต่ environment variables ไปจนถึง runtime configuration

## Environment Variables

### ตัวแปรสำคัญ

| Variable | Description | Example |
|----------|-------------|---------|
| `LUA_PATH` | Search path สำหรับ Lua modules | `./?.lua;./?/init.lua;;` |
| `LUA_CPATH` | Search path สำหรับ C modules | `./?.so;./?.dll;;` |
| `LUA_INIT` | Script ที่รันก่อนเริ่ม | `@/etc/lua/init.lua` |
| `LUA_INIT_5_4` | Lua 5.4 specific init | `@/etc/lua/init54.lua` |

### การตั้งค่า LUA_PATH

```bash
# Linux/macOS
export LUA_PATH="./?.lua;./?/init.lua;/usr/local/share/lua/5.4/?.lua;;"

# Windows
set LUA_PATH=.\?.lua;.\?\init.lua;C:\lua\?.lua;;

# Multiple paths (semicolon separated)
export LUA_PATH="./src/?.lua;./lib/?.lua;./?.lua;;"
```

### การตั้งค่า LUA_CPATH

```bash
# Linux
export LUA_CPATH="./?.so;/usr/local/lib/lua/5.4/?.so;;"

# macOS
export LUA_CPATH="./?.dylib;/usr/local/lib/lua/5.4/?.dylib;;"

# Windows
set LUA_CPATH=.\?.dll;C:\lua\?.dll;;
```

## Lua Runtime Configuration

### การตั้งค่าผ่าน Code

```lua
-- เพิ่ม path ที่ runtime
package.path = package.path .. ";./custom/?.lua"
package.cpath = package.cpath .. ";./custom/?.so"

-- ตั้งค่า GC
collectgarbage("setpause", 200)  -- default 200
collectgarbage("setstepmul", 200) -- default 200

-- ตรวจสอบ GC status
print(collectgarbage("count"))   -- memory in KB
print(collectgarbage("isrunning")) -- GC running?
```

### การตั้งค่า Module Loading

```lua
-- ปิดการใช้งาน package.loaded cache
package.loaded = {}

-- Custom loader
table.insert(package.loaders, function(module)
  -- custom loading logic
  return nil, "not found"
end)
```

## LuaJIT Configuration

### JIT Compiler Settings

```lua
-- เปิด/ปิด JIT
jit.on()   -- เปิด JIT
jit.off()  -- ปิด JIT

-- Flush JIT cache
jit.flush()

-- ตรวจสอบสถานะ
print(jit.status())

-- ตั้งค่า JIT options
jit.opt.start(3)  -- optimization level 0-3
```

### JIT Tracing

```bash
# Enable verbose tracing
luajit -jv script.lua

# Dump JIT IR
luajit -jdump script.lua

# Disable JIT
luajit -joff script.lua
```

## IDE Configuration

### Visual Studio Code

ติดตั้ง extension: **Lua** (by sumneko)

```json
{
  "Lua.diagnostics.globals": ["vim", "game"],
  "Lua.runtime.version": "LuaJIT",
  "Lua.runtime.path": [
    "?.lua",
    "?/init.lua",
    "/usr/local/share/lua/5.4/?.lua"
  ],
  "Lua.workspace.library": [
    "${3rd}/luv/library",
    "${3rd}/busted/library"
  ],
  "Lua.completion.displayContext": 3,
  "Lua.workspace.checkThirdParty": false
}
```

### Neovim LSP

```lua
-- init.lua
require('lspconfig').lua_ls.setup {
  settings = {
    Lua = {
      runtime = {
        version = 'LuaJIT',
        path = vim.split(package.path, ';')
      },
      diagnostics = {
        globals = { 'vim' }
      },
      workspace = {
        library = vim.api.nvim_get_runtime_file('', true),
        checkThirdParty = false
      },
      telemetry = {
        enable = false
      }
    }
  }
}
```

### VS Code (LuaLS)

```json
{
  "Lua.workspace.library": [
    "c:/Users/Veerapong/.codeium/windsurf/skills/lang-lua"
  ],
  "Lua.diagnostics.globals": [
    "it",
    "describe",
    "before_each",
    "after_each"
  ]
}
```

## LuaRocks Configuration

### การตั้งค่า LuaRocks

```bash
# ตรวจสอบ config
luarocks config

# ตั้งค่า rocks server
luarocks config rocks_servers https://luarocks.org

# ตั้งค่า local tree
luarocks config --scope=user rocks_trees
```

### config.lua ตัวอย่าง

```lua
-- ~/.luarocks/config.lua
rocks_trees = {
  {
    name = "user",
    root = home .. "/.luarocks"
  },
  {
    name = "system",
    root = "/usr/local"
  }
}

variables = {
  LUA_DIR = "/usr/local",
  LUA_BINDIR = "/usr/local/bin",
  LUA_INCDIR = "/usr/local/include",
  LUA_LIBDIR = "/usr/local/lib"
}
```

## Project Configuration

### โครงสร้างโปรเจกต์

```
my-lua-project/
├── .luacheckrc          # Luacheck config
├── .luarc.json          # LuaLS config
├── .luarocks/           # Local rocks
├── src/
│   └── main.lua
└── spec/
    └── main_spec.lua
```

### .luacheckrc

```lua
-- .luacheckrc
std = "lua54"
ignore = {"213"}  -- unused loop variable
globals = {
  "vim",  -- Neovim globals
  "game"  -- Game engine globals
}
files["src/"] = {
  allow_defined = true,
  allow_defined_top = true
}
```

### .luarc.json

```json
{
  "runtime.version": "Lua 5.4",
  "diagnostics.globals": ["vim"],
  "workspace.library": ["./src"],
  "workspace.maxPreload": 2000
}
```

## Performance Configuration

### GC Tuning

```lua
-- สำหรับ high-performance applications
collectgarbage("setpause", 100)   -- ลด pause
collectgarbage("setstepmul", 500) -- เพิ่ม step

-- สำหรับ memory-constrained
collectgarbage("setpause", 400)   -- เพิ่ม pause
collectgarbage("setstepmul", 100) -- ลด step

-- Manual GC control
function gc_tick()
  collectgarbage("step", 1024)
end
```

### Table Optimization

```lua
-- Pre-allocate table size
local t = {}
for i = 1, 1000 do
  t[i] = i
end

-- หรือใช้ table.new (LuaJIT)
local t = table.new(1000, 0)
```

## Security Configuration

### Sandboxing

```lua
-- สร้าง sandboxed environment
local sandbox = {
  print = print,
  math = math,
  string = string
}

setmetatable(sandbox, {
  __index = function()
    error("Access denied")
  end,
  __newindex = function()
    error("Write denied")
  end
})

-- Execute code in sandbox
local function run_sandboxed(code)
  local fn, err = load(code, "sandbox", "t", sandbox)
  if not fn then error(err) end
  return fn()
end
```

### จำกัด Functions

```lua
-- ปิด dangerous functions
local safe_env = {
  io = nil,
  os = {
    clock = os.clock,
    date = os.date,
    time = os.time
  }
}
```

## Debugging Configuration

### Debug Flags

```bash
# Enable debug info
lua -l script.lua

# Stack trace on error
lua -e "debug.traceback = function() print('trace') end"
```

### Debug Library

```lua
-- Enable debug hooks
debug.sethook(function()
  print("hook called")
end, "crl", 1000)

-- Get stack info
local info = debug.getinfo(1)
print(info.name, info.source, info.linedefined)
```

## Cross-Platform Configuration

### Platform Detection

```lua
-- Detect platform
local function get_platform()
  local platform = package.config:sub(1, 1)
  if platform == "\\" then
    return "windows"
  elseif platform == "/" then
    return "unix"
  end
end

-- Path separator
local path_sep = package.config:sub(1, 1)
```

### Conditional Configuration

```lua
local config = {
  paths = {}
}

if get_platform() == "windows" then
  config.paths.lua = "C:\\Lua\\?.lua"
else
  config.paths.lua = "/usr/local/share/lua/5.4/?.lua"
end
```

## Best Practices

1. **ใช้ environment variables** สำหรับ global settings
2. **ใช้ project-specific config** สำหรับ local settings
3. **ปกป้อง sandbox** เมื่อ execute untrusted code
4. **ปรับ GC** ตาม use case
5. **ใช้ version control** สำหรับ config files
6. **Document custom configurations** ใน README
