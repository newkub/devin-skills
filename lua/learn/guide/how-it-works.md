# How It Works - Lua

## ภาพรวมการทำงานของ Lua

Lua เป็นภาษา scripting ที่ถูกออกแบบมาเพื่อ embedding ใน applications อื่นๆ โดยมี architecture ที่เป็น lightweight และมีการทำงานแบบ stack-based virtual machine

## Lua Virtual Machine (VM)

### โครงสร้างพื้นฐาน

```
┌─────────────────────────────────────┐
│         Host Application            │
│  (C/C++, C#, Java, Python, etc.)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Lua C API                    │
│  (lua_State, lua_push*, lua_to*)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Lua Virtual Machine            │
│  ┌──────────────────────────────┐  │
│  │  Stack (Register-based)      │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Bytecode Interpreter        │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────�  │
│  │  Garbage Collector           │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### การทำงานของ Lua VM

1. **Parsing**: Lua source code ถูก parse เป็น bytecode
2. **Execution**: Bytecode ถูก execute บน VM
3. **Stack Management**: ข้อมูลถูกจัดการผ่าน stack
4. **Garbage Collection**: หน่วยความจำที่ไม่ใช้ถูก clean อัตโนมัติ

## Garbage Collection

### ประเภท Garbage Collection

Lua ใช้ **Incremental Garbage Collector** แบบ generational:

| Phase | Description |
|-------|-------------|
| **Mark** | ตรวจสอบ object ที่ยังถูกใช้งาน |
| **Sweep** | ลบ object ที่ไม่ถูกใช้งาน |
| **Atomic** | ทำงานจุดที่ไม่สามารถ interrupt ได้ |

### การทำงาน

```lua
-- Manual GC control
collectgarbage("collect")    -- Force full collection
collectgarbage("step", 1024) -- Incremental step
collectgarbage("setpause", 200) -- Set pause
collectgarbage("setstepmul", 200) -- Set step multiplier
```

### Generational GC

Lua 5.2+ มี generational GC ที่แบ่ง object เป็น:
- **Young generation**: Object ใหม่ ตรวจสอบบ่อย
- **Old generation**: Object เก่า ตรวจสอบน้อย

## Table Implementation

### โครงสร้าง Table

Tables ใน Lua เป็น hybrid structure ที่รวม array และ hash table:

```
Table Structure:
┌─────────────────────────────────┐
│  Array Part (1..n)               │
│  [1] -> value1                   │
│  [2] -> value2                   │
│  [3] -> nil                      │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  Hash Part (key -> value)       │
│  "name" -> "John"                │
│  "age" -> 30                     │
└─────────────────────────────────┘
```

### Rehashing

เมื่อ table เติมเต็ม:
1. Lua คำนวณ size ใหม่
2. Rehash ข้อมูลทั้งหมด
3. ปรับสมดุลระหว่าง array และ hash part

## Metatables

### การทำงานของ Metatables

Metatables ใช้สำหรับ override behavior ของ tables:

```lua
local t = {}
local mt = {
  __index = function(table, key)
    return "default: " .. key
  end,
  __newindex = function(table, key, value)
    rawset(table, key, value)
  end,
  __add = function(a, b)
    return a.value + b.value
  end
}

setmetatable(t, mt)
```

### Metamethods

| Metamethod | Triggered When |
|------------|----------------|
| `__index` | Access missing key |
| `__newindex` | Assign missing key |
| `__add` | Use `+` operator |
| `__sub` | Use `-` operator |
| `__mul` | Use `*` operator |
| `__div` | Use `/` operator |
| `__mod` | Use `%` operator |
| `__pow` | Use `^` operator |
| `__concat` | Use `..` operator |
| `__eq` | Use `==` operator |
| `__lt` | Use `<` operator |
| `__le` | Use `<=` operator |
| `__call` | Call table as function |
| `__tostring` | Convert to string |
| `__len` | Use `#` operator |

## Coroutines

### การทำงานของ Coroutines

Coroutines เป็น cooperative multitasking:

```
Main Thread
    │
    ├─► create coroutine
    │
    ├─► resume ──────────────┐
    │                        │
    │                  Coroutine
    │                        │
    │                  yield ──┘
    │                        │
    ├─► resume ──────────────┘
    │
    └─► coroutine ends
```

### States

| State | Description |
|-------|-------------|
| **suspended** | ยังไม่เริ่ม หรือ yield แล้ว |
| **running** | กำลัง execute |
| **normal** | resume coroutine อื่น |
| **dead** | จบการทำงานแล้ว |

## Module System

### การทำงานของ require()

```lua
-- require() flow:
-- 1. Check package.loaded cache
-- 2. Search package.path for .lua files
-- 3. Search package.cpath for .so/.dll files
-- 4. Load and execute module
-- 5. Cache in package.loaded
-- 6. Return module
```

### Search Path

```lua
-- Default LUA_PATH
./?.lua
./?/init.lua
/usr/local/share/lua/5.4/?.lua
/usr/local/share/lua/5.4/?/init.lua
```

## Error Handling

### การทำงานของ pcall/xpcall

```lua
-- pcall: protected call
local success, result = pcall(function()
  -- code that might error
end)

-- xpcall: with error handler
local success, result = xpcall(
  function()
    -- code that might error
  end,
  function(err)
    -- error handler
    return "Handled: " .. err
  end
)
```

## Performance Characteristics

### ตัวแปรที่มีผลต่อ performance

| Factor | Impact |
|--------|--------|
| **Table access** | O(1) โดยเฉลี่ย |
| **String concatenation** | ใช้ `..` สร้าง string ใหม่ทุกครั้ง |
| **Function calls** | Lightweight แต่มี overhead |
| **GC pauses** | ขึ้นกับจำนวน object |
| **Local variables** | เร็วกว่า global |

### Optimization Tips

```lua
-- 1. Cache frequently accessed functions
local string_len = string.len

-- 2. Pre-allocate tables
local t = {}
for i = 1, 1000 do t[i] = i end

-- 3. Use local variables
local function fast()
  local x = 1  -- local is faster
  return x
end
```

## LuaJIT Differences

### JIT Compilation

LuaJIT เพิ่ม JIT compiler:

```
Source Code
    │
    ├─► Interpreter (slow)
    │
    └─► JIT Compiler (fast)
         │
         └─► Native Machine Code
```

### Trace Recording

LuaJIT ใช้ trace-based JIT:
1. บันทึก hot loops
2. Compile เป็น native code
3. Execute native code
4. Deoptimize ถ้า assumption ผิด
