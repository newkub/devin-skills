# Troubleshooting - Lua

## ภาพรวมการแก้ปัญหา Lua

คู่มือนี้รวบรวมปัญหาที่พบบ่อยและวิธีแก้ไขในการพัฒนาด้วย Lua

## ข้อผิดพลาดทั่วไป

### ตารางสรุปปัญหา

| Error | สาเหตุ | วิธีแก้ไข |
|-------|--------|-------------|
| `attempt to index a nil value` | พยายามเข้าถึง property ของ nil | ตรวจสอบว่าตัวแปรไม่ใช่ nil ก่อนเข้าถึง |
| `attempt to call a nil value` | พยายามเรียก function ที่เป็น nil | ตรวจสอบว่า function ถูก define หรือ require แล้ว |
| `module 'xxx' not found` | Module ไม่พบใน search path | ตรวจสอบ LUA_PATH และชื่อไฟล์ |
| `syntax error near 'xxx'` | ไวยากรณ์ผิด | ตรวจสอบการใช้ `end`, `)`, `,` |
| `attempt to perform arithmetic on a string` | ดำเนินการคณิตศาสตร์กับ string | แปลง string เป็น number ก่อน |
| `stack overflow` | Recursion ลึกเกินไป | เพิ่ม base case หรือใช้ iteration |
| `out of memory` | ใช้หน่วยความจำเกิน limit | ปรับ GC หรือลด object creation |

## Module Loading Issues

### Module Not Found

**Problem:**
```lua
local mymodule = require("mymodule")
-- error: module 'mymodule' not found
```

**Solutions:**

1. ตรวจสอบ search path:
```lua
print(package.path)
print(package.cpath)
```

2. เพิ่ม path:
```lua
package.path = package.path .. ";./src/?.lua"
```

3. ตรวจสอบชื่อไฟล์:
```bash
# ถ้าไฟล์ชื่อ mymodule.lua
require("mymodule")  -- ถูก

# ถ้าไฟล์ชื่อ my-module.lua
require("my-module")  -- ถูก
```

### Circular Dependencies

**Problem:**
```lua
-- a.lua
local b = require("b")

-- b.lua
local a = require("a")
```

**Solution:**
```lua
-- a.lua
local M = {}
local b

function M.init()
    b = require("b")
end

return M
```

## Table Issues

### Attempt to Index Nil

**Problem:**
```lua
local user = nil
print(user.name)  -- error
```

**Solution:**
```lua
local user = nil
if user then
    print(user.name)
end

-- หรือใช้ and/or
print(user and user.name or "N/A")
```

### Array Indexing

**Problem:**
```lua
local arr = {10, 20, 30}
print(arr[0])  -- nil (Lua arrays start at 1)
```

**Solution:**
```lua
local arr = {10, 20, 30}
print(arr[1])  -- 10
```

### Table Iteration

**Problem:**
```lua
local t = {a = 1, b = 2, c = 3}
for i, v in ipairs(t) do
    print(i, v)  -- ไม่ print อะไรเลย
end
```

**Solution:**
```lua
-- ใช้ pairs สำหรับ dictionary
for k, v in pairs(t) do
    print(k, v)
end

-- ใช้ ipairs สำหรับ array
local arr = {1, 2, 3}
for i, v in ipairs(arr) do
    print(i, v)
end
```

## Function Issues

### Nil Function Call

**Problem:**
```lua
local func = nil
func()  -- error
```

**Solution:**
```lua
local func = nil
if func then
    func()
end

-- หรือใช้ pcall
local ok, err = pcall(func)
if not ok then
    print("Error:", err)
end
```

### Variable Arguments

**Problem:**
```lua
function sum(...)
    return ...  -- error: can't return varargs directly
end
```

**Solution:**
```lua
function sum(...)
    local total = 0
    for _, v in ipairs({...}) do
        total = total + v
    end
    return total
end
```

## String Issues

### String Concatenation Performance

**Problem:**
```lua
local s = ""
for i = 1, 10000 do
    s = s .. "x"  -- ช้ามาก
end
```

**Solution:**
```lua
-- ใช้ table.concat
local t = {}
for i = 1, 10000 do
    t[i] = "x"
end
local s = table.concat(t)
```

### String to Number

**Problem:**
```lua
local s = "10"
print(s + 5)  -- 15 (Lua converts automatically)
local s2 = "10abc"
print(s2 + 5)  -- error
```

**Solution:**
```lua
local s = "10"
local n = tonumber(s)
if n then
    print(n + 5)
end
```

## Performance Issues

### Slow Table Access

**Problem:**
```lua
for i = 1, 1000000 do
    _G.my_func()  -- ช้าเพราะ global access
end
```

**Solution:**
```lua
local my_func = _G.my_func
for i = 1, 1000000 do
    my_func()  -- เร็วขึ้น
end
```

### GC Pauses

**Problem:**
Application lag เมื่อ GC ทำงาน

**Solution:**
```lua
-- ปรับ GC parameters
collectgarbage("setpause", 200)
collectgarbage("setstepmul", 200)

-- หรือ manual GC
function gc_tick()
    collectgarbage("step", 1024)
end
```

## Memory Issues

### Memory Leak

**Problem:**
หน่วยความจำเพิ่มขึ้นเรื่อยๆ

**Solution:**
```lua
-- ตรวจสอบ memory usage
print(collectgarbage("count"))

-- ตรวจสอบ references
local weak_table = setmetatable({}, {__mode = "v"})
```

### Out of Memory

**Problem:**
```lua
-- error: out of memory
```

**Solution:**
```lua
-- 1. ลด object creation
-- 2. ใช้ object pooling
-- 3. เพิ่ม GC frequency
collectgarbage("setpause", 100)
collectgarbage("setstepmul", 500)
```

## Metatable Issues

### __index Not Working

**Problem:**
```lua
local t = {}
local mt = {__index = {x = 10}}
setmetatable(t, mt)
print(t.x)  -- nil
```

**Solution:**
```lua
local t = {}
local mt = {__index = {x = 10}}
setmetatable(t, mt)
-- ต้องเข้าถึง key ที่ไม่มี
print(t.y)  -- 10 (จาก __index)
```

### Metamethod Not Triggered

**Problem:**
```lua
local a = {value = 10}
local b = {value = 20}
local mt = {__add = function(x, y) return x.value + y.value end}
setmetatable(a, mt)
setmetatable(b, mt)
print(a + b)  -- error
```

**Solution:**
```lua
local a = {value = 10}
local b = {value = 20}
local mt = {
    __add = function(x, y)
        return {value = x.value + y.value}
    end
}
setmetatable(a, mt)
setmetatable(b, mt)
local result = a + b
print(result.value)  -- 30
```

## Coroutine Issues

### Coroutine Not Resuming

**Problem:**
```lua
local co = coroutine.create(function()
    print("running")
end)
-- ไม่ print อะไร
```

**Solution:**
```lua
local co = coroutine.create(function()
    print("running")
end)
coroutine.resume(co)  -- ต้อง resume
```

### Coroutine Dead

**Problem:**
```lua
local co = coroutine.create(function()
    return 42
end)
coroutine.resume(co)
coroutine.resume(co)  -- false, cannot resume dead coroutine
```

**Solution:**
```lua
local co = coroutine.create(function()
    return 42
end)
local ok, result = coroutine.resume(co)
if ok then
    print(result)
end
-- สร้าง coroutine ใหม่ถ้าต้องการรันอีกครั้ง
```

## File I/O Issues

### File Not Found

**Problem:**
```lua
local f = io.open("nonexistent.txt", "r")
-- f เป็น nil
```

**Solution:**
```lua
local f = io.open("file.txt", "r")
if not f then
    print("File not found")
    return
end
f:close()
```

### File Permission Error

**Problem:**
```lua
local f = io.open("/root/file.txt", "w")
-- permission denied
```

**Solution:**
```lua
-- ตรวจสอบ permissions
-- ใช้ path ที่มีสิทธิ์เขียน
local f = io.open("./file.txt", "w")
```

## C Integration Issues

### Lua State Not Initialized

**Problem:**
```c
lua_State *L = NULL;
luaL_dofile(L, "script.lua");  // crash
```

**Solution:**
```c
lua_State *L = luaL_newstate();
luaL_openlibs(L);
luaL_dofile(L, "script.lua");
lua_close(L);
```

### Stack Imbalance

**Problem:**
```c
lua_pushnumber(L, 42);
lua_pushstring(L, "hello");
lua_pcall(L, 2, 1, 0);  // stack imbalance
```

**Solution:**
```c
lua_pushnumber(L, 42);
lua_pushstring(L, "hello");
lua_pcall(L, 2, 1, 0);
lua_pop(L, 1);  // pop result
```

## Debugging Tips

### Enable Debug Info

```lua
-- เปิด debug info
debug.sethook(function()
    print("Debug hook")
end, "crl", 1000)
```

### Stack Trace

```lua
-- รับ stack trace
local function get_traceback()
    local trace = {}
    local level = 2
    while true do
        local info = debug.getinfo(level, "Sl")
        if not info then break end
        table.insert(trace, string.format("%s:%d", info.short_src, info.currentline))
        level = level + 1
    end
    return table.concat(trace, "\n")
end
```

### Print Variables

```lua
-- Debug print function
local function debug_print(...)
    local args = {...}
    for i, v in ipairs(args) do
        print(tostring(v))
    end
end
```

## IDE/Editor Issues

### VS Code LuaLS Not Working

**Problem:**
IntelliSense ไม่ทำงาน

**Solution:**
```json
{
  "Lua.workspace.library": ["./src"],
  "Lua.runtime.version": "Lua 5.4",
  "Lua.diagnostics.globals": ["vim"]
}
```

### Neovim LSP Not Working

**Problem:**
LSP ไม่ทำงาน

**Solution:**
```lua
-- ตรวจสอบ config
:checkhealth lspconfig

-- ตรวจสอบ installation
:LspInfo
```

## Best Practices for Troubleshooting

1. **ใช้ pcall** สำหรับ code ที่อาจ error
2. **ตรวจสอบ nil** ก่อนเข้าถึง
3. **ใช้ debug library** เมื่อจำเป็น
4. **เขียน tests** สำหรับ critical code
5. **ตรวจสอบ logs** อย่างละเอียด
6. **ใช้ linter** (luacheck) เพื่อหา errors
7. **Document errors** ที่พบบ่อย
