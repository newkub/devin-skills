---
title: Setup Lua Project
description: ตั้งค่าโปรเจกต์ Lua ตามมาตรฐาน
auto_execution_mode: 3
---

## Goal

สร้างโครงสร้างโปรเจกต์ Lua ที่เป็นมาตรฐานพร้อม tools และ configuration

## Scope

สำหรับโปรเจกต์ Lua ใหม่ทั้งหมด

## Execute

### 1. สร้างโครงสร้างโปรเจกต์

สร้าง folders ตามลำดับ:

```bash
# สร้าง folders
mkdir src
mkdir spec
mkdir assets
mkdir docs
mkdir scripts
```

### 2. สร้างไฟล์พื้นฐาน

สร้างไฟล์ต่อไปนี้:

- `src/main.lua` - Entry point
- `src/config.lua` - Configuration
- `src/utils.lua` - Utility functions
- `spec/main_spec.lua` - Tests
- `.luacheckrc` - Linter config
- `.luarc.json` - LuaLS config
- `README.md` - Documentation
- `.gitignore` - Git ignore

### 3. เขียน main.lua

```lua
-- src/main.lua
local config = require("config")
local utils = require("utils")

local function main()
    print("Lua Project Started")
    print("Debug mode:", config.debug)
end

main()
```

### 4. เขียน config.lua

```lua
-- src/config.lua
local M = {
    debug = false,
    log_level = "info",
    version = "1.0.0"
}

return M
```

### 5. เขียน utils.lua

```lua
-- src/utils.lua
local M = {}

function M.log(message, level)
    level = level or "info"
    print(string.format("[%s] %s", level:upper(), message))
end

return M
```

### 6. เขียน tests

```lua
-- spec/main_spec.lua
describe("Main", function()
    it("should start successfully", function()
        assert.is_true(true)
    end)
end)
```

### 7. ตั้งค่า .luacheckrc

```lua
-- .luacheckrc
std = "lua54"
ignore = {"213"}
globals = {}
files["src/"] = {
    allow_defined = true,
    allow_defined_top = true
}
```

### 8. ตั้งค่า .luarc.json

```json
{
  "runtime.version": "Lua 5.4",
  "diagnostics.globals": [],
  "workspace.library": ["./src"],
  "workspace.maxPreload": 2000
}
```

### 9. เขียน README.md

```markdown
# My Lua Project

## Installation

```bash
# Install Lua
brew install lua  # macOS
sudo apt install lua  # Linux

# Install LuaRocks
curl -R -O https://luarocks.github.io/luarocks/releases/luarocks-3.9.2.tar.gz
```

## Usage

```bash
lua src/main.lua
```

## Testing

```bash
luarocks install busted
busted
```

## Structure

- `src/` - Source code
- `spec/` - Tests
- `assets/` - Assets
- `docs/` - Documentation
```

### 10. ตั้งค่า .gitignore

```
# Lua
*.lua~
luarocks/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Build
build/
dist/
```

### 11. ติดตั้ง dependencies

```bash
# Install testing framework
luarocks install busted

# Install linter
luarocks install luacheck

# Install formatter (optional)
luarocks install luaformatter
```

### 12. ตั้งค่า VS Code (ถ้าใช้)

สร้าง `.vscode/settings.json`:

```json
{
  "Lua.diagnostics.globals": [],
  "Lua.runtime.version": "Lua 5.4",
  "Lua.workspace.library": ["./src"],
  "Lua.completion.displayContext": 3,
  "Lua.workspace.checkThirdParty": false
}
```

## Rules

### โครงสร้าง

- ใช้ `src/` สำหรับ source code
- ใช้ `spec/` สำหรับ tests
- ใช้ `assets/` สำหรับ static files
- ใช้ `docs/` สำหรับ documentation

### Naming

- ไฟล์: lowercase with underscores
- Functions: lowercase with underscores
- Constants: UPPERCASE
- Classes/Tables: PascalCase

### Module Pattern

```lua
local M = {}

function M.func()
    -- implementation
end

return M
```

### Testing

- ใช้ busted สำหรับ testing
- ตั้งชื่อ test files ด้วย `_spec.lua`
- เขียน tests สำหรับ functions สำคัญ

## Expected Outcome

- โครงสร้างโปรเจกต์ที่เป็นมาตรฐาน
- Configuration files พร้อมใช้งาน
- Tests framework ติดตั้งแล้ว
- Linter ติดตั้งแล้ว
- Documentation พร้อม
