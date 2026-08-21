---
title: Create Lua Module
description: สร้าง Lua module ตามมาตรฐาน
auto_execution_mode: 3
---

## Goal

สร้าง Lua module ที่เป็นมาตรฐานพร้อม documentation และ tests

## Scope

สำหรับการสร้าง module ใหม่ในโปรเจกต์ Lua

## Execute

### 1. ตั้งชื่อ module

ตั้งชื่อ module ตาม convention:
- lowercase with underscores
- สื่อความหมายชัดเจน
- ไม่ใช้ reserved words

ตัวอย่าง: `database`, `http_client`, `user_manager`

### 2. สร้างไฟล์ module

สร้างไฟล์ใน `src/`:

```bash
touch src/my_module.lua
```

### 3. เขียน module template

```lua
-- src/my_module.lua
local M = {}

-- Private variables
local private_var = 42

-- Private functions
local function private_func()
    return private_var
end

-- Public API

--- Description of function
-- @param param1 Description
-- @return Description
function M.public_func(param1)
    -- implementation
    return param1
end

return M
```

### 4. เขียน documentation

ใช้ LDoc format:

```lua
--- My Module Description
-- @module my_module
-- @author Your Name
-- @license MIT

--- Public function description
-- @param param1 Parameter description
-- @param param2 Parameter description
-- @return result Result description
function M.my_function(param1, param2)
    -- implementation
end
```

### 5. เขียน tests

สร้าง `spec/my_module_spec.lua`:

```lua
-- spec/my_module_spec.lua
local my_module = require("my_module")

describe("My Module", function()
    describe("public_func", function()
        it("should return expected result", function()
            local result = my_module.public_func(42)
            assert.equals(42, result)
        end)
    end)
end)
```

### 6. เพิ่ม module ใน package.loaded (ถ้าจำเป็น)

สำหรับ development:

```lua
-- ใน main.lua หรือ test helper
package.loaded.my_module = nil
local my_module = require("my_module")
```

### 7. ตั้งค่า LuaLS (ถ้าจำเป็น)

เพิ่มใน `.luarc.json`:

```json
{
  "workspace.library": ["./src"],
  "diagnostics.globals": []
}
```

### 8. ทดสอบ module

รัน tests:

```bash
busted spec/my_module_spec.lua
```

### 9. ทดสอบด้วย Lua REPL

```bash
lua
> local my_module = require("my_module")
> my_module.public_func(42)
```

### 10. เขียน usage example

เพิ่มใน README หรือ docs/:

```markdown
## Usage

```lua
local my_module = require("my_module")

local result = my_module.public_func(42)
print(result)
```
```

## Rules

### Module Pattern

ใช้ pattern มาตรฐาน:

```lua
local M = {}

function M.func()
    -- implementation
end

return M
```

### Private vs Public

- Private: ใช้ `local function`
- Public: ใช้ `M.func = function`

### Documentation

- ใช้ LDoc format
- Document ทุก public functions
- อธิบาย parameters และ return values

### Testing

- เขียน tests สำหรับทุก public functions
- ใช้ describe/it จัดกลุ่ม
- Test edge cases

### Error Handling

ใช้ `error` หรือ return `nil, err`:

```lua
function M.func(param)
    if not param then
        return nil, "param is required"
    end
    -- or
    if not param then
        error("param is required", 2)
    end
end
```

## Expected Outcome

- Module ที่เป็นมาตรฐาน
- Documentation ครบถ้วน
- Tests ครอบคลุม
- ใช้งานได้จริง
