# Integration - Lua

## ภาพรวมการเชื่อมต่อ Lua

Lua ถูกออกแบบมาเพื่อ embedding ใน applications ทำให้สามารถเชื่อมต่อกับภาษาและ platforms ต่างๆ ได้ง่าย

## C Integration

### พื้นฐาน Lua C API

```c
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>

int main() {
    // สร้าง Lua state
    lua_State *L = luaL_newstate();
    
    // เปิด standard libraries
    luaL_openlibs(L);
    
    // รัน Lua script
    luaL_dofile(L, "script.lua");
    
    // ปิด Lua state
    lua_close(L);
    return 0;
}
```

### การเรียก Lua Functions จาก C

```c
// เรียก Lua function
lua_getglobal(L, "my_function");  // push function
lua_pushnumber(L, 42);           // push argument
lua_pushstring(L, "hello");     // push argument

// call function (2 args, 1 result)
if (lua_pcall(L, 2, 1, 0) != LUA_OK) {
    fprintf(stderr, "Error: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1);
    return 1;
}

// รับ result
int result = lua_tointeger(L, -1);
lua_pop(L, 1);  // pop result
```

### การ Register C Functions ให้ Lua

```c
// C function ที่ Lua เรียกได้
static int add_numbers(lua_State *L) {
    double a = luaL_checknumber(L, 1);
    double b = luaL_checknumber(L, 2);
    lua_pushnumber(L, a + b);
    return 1;  // number of results
}

// Register functions
static const luaL_Reg mylib[] = {
    {"add", add_numbers},
    {NULL, NULL}
};

// Load library
int luaopen_mylib(lua_State *L) {
    luaL_newlib(L, mylib);
    return 1;
}
```

### การใช้งานใน Lua

```lua
-- ใน Lua
local mylib = require("mylib")
local result = mylib.add(10, 20)
print(result)  -- 30
```

## C++ Integration

### ใช้ LuaBridge

```cpp
#include "LuaBridge/LuaBridge.h"

int main() {
    lua_State* L = luaL_newstate();
    luaL_openlibs(L);
    
    // Register C++ function
    luabridge::getGlobalNamespace(L)
        .beginNamespace("game")
            .addFunction("getScore", getScore)
            .addFunction("setScore", setScore)
        .endNamespace();
    
    luaL_dofile(L, "script.lua");
    lua_close(L);
    return 0;
}
```

### ใช้ sol2

```cpp
#include <sol/sol.hpp>

int main() {
    sol::state lua;
    lua.open_libraries(sol::lib::base, sol::lib::math);
    
    // Register function
    lua.set_function("add", [](int a, int b) {
        return a + b;
    });
    
    // Call Lua function
    lua.script("function multiply(x, y) return x * y end");
    int result = lua["multiply"](5, 3);
    
    return 0;
}
```

## Python Integration

### ใช้ Lupa

```python
from lupa import LuaRuntime

lua = LuaRuntime()

# Execute Lua code
lua.execute('''
function greet(name)
    return "Hello, " .. name
end
''')

# Call Lua function
result = lua.greet("World")
print(result)  # Hello, World

# Pass Python objects to Lua
lua.globals()["python_func"] = lambda x: x * 2
lua.execute("print(python_func(5))")  # 10
```

### ใช้ lua-python

```python
import lua

lua.execute('''
function factorial(n)
    if n == 0 then return 1 end
    return n * factorial(n - 1)
end
''')

result = lua.eval('factorial(5)')
print(result)  # 120
```

## Java Integration

### ใช้ Luaj

```java
import org.luaj.vm2.*;
import org.luaj.vm2.lib.jse.*;

public class LuaIntegration {
    public static void main(String[] args) {
        Globals globals = JsePlatform.standardGlobals();
        
        // Load script
        LuaValue script = globals.loadfile("script.lua");
        script.call();
        
        // Call Lua function
        LuaValue func = globals.get("my_function");
        LuaValue result = func.call(LuaValue.valueOf(42));
        System.out.println(result);
    }
}
```

## C# Integration

### ใช้ MoonSharp

```csharp
using MoonSharp.Interpreter;

class Program {
    static void Main() {
        Script script = new Script();
        
        // Register C# function
        script.Globals["add"] = (Func<int, int, int>)((a, b) => a + b);
        
        // Execute Lua
        script.DoString(@"
            result = add(10, 20)
            print(result)
        ");
        
        // Get Lua variable
        int result = script.Globals["result"].Number;
    }
}
```

### ใช้ NLua

```csharp
using NLua;

class Program {
    static void Main() {
        using (Lua lua = new Lua()) {
            // Register C# object
            lua["myObject"] = new MyClass();
            
            // Execute Lua
            lua.DoFile("script.lua");
            
            // Call Lua function
            object[] result = lua.GetFunction("my_func").Call(42);
        }
    }
}
```

## Go Integration

### ใช้ gopher-lua

```go
import "github.com/yuin/gopher-lua"

func main() {
    L := lua.NewState()
    defer L.Close()
    
    // Register Go function
    L.SetGlobal("greet", L.NewFunction(func(L *lua.LState) int {
        name := L.ToString(1)
        L.Push(lua.LString("Hello, " + name))
        return 1
    }))
    
    // Execute Lua
    if err := L.DoString(`print(greet("World"))`); err != nil {
        panic(err)
    }
}
```

## Rust Integration

### ใช้ rlua

```rust
use rlua::{Lua, Result};

fn main() -> Result<()> {
    let lua = Lua::new();
    
    // Register Rust function
    lua.globals().set("add", lua.create_function(|_, (a, b): (i32, i32)| {
        Ok(a + b)
    })?)?;
    
    // Execute Lua
    lua.exec(r#"
        result = add(10, 20)
        print(result)
    "#)?;
    
    Ok(())
}
```

## JavaScript/Node.js Integration

### ใช้ fengari-web

```javascript
const fengari = require('fengari-web');
const lua = fengari.lua;
const lauxlib = fengari.lauxlib;
const lualib = fengari.lualib;

const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);

// Execute Lua
lauxlib.luaL_dostring(L, `
    function greet(name)
        return "Hello, " .. name
    end
`);

// Call Lua function
lua.lua_getglobal(L, "greet");
lua.lua_pushstring(L, "World");
lua.lua_pcall(L, 1, 1, 0);

const result = lua.lua_tostring(L, -1);
console.log(result);  // Hello, World
```

## Game Engine Integration

### Unity (C#)

```csharp
using MoonSharp.Interpreter;

public class LuaScript : MonoBehaviour {
    private Script script;
    
    void Start() {
        script = new Script();
        script.Globals["gameObject"] = this;
        script.DoFile("script.lua");
    }
    
    void Update() {
        script.Call(script.Globals["update"]);
    }
}
```

### Love2D (Lua Native)

```lua
-- main.lua
function love.load()
    -- Love2D ใช้ Lua เป็นภาษาหลัก
    player = {
        x = 100,
        y = 100,
        speed = 5
    }
end

function love.update(dt)
    if love.keyboard.isDown("left") then
        player.x = player.x - player.speed
    end
end

function love.draw()
    love.graphics.rectangle("fill", player.x, player.y, 32, 32)
end
```

### Roblox (Lua Native)

```lua
-- Roblox ใช้ Lua เป็นภาษาหลัก
local Players = game:GetService("Players")

local function onPlayerJoin(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
    
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerJoin)
```

## Web Integration

### fengari (Lua in Browser)

```html
<script src="fengari-web.js"></script>
<script>
    const fengari = require('fengari-web');
    const lua = fengari.lua;
    const lauxlib = fengari.lauxlib;
    const lualib = fengari.lualib;
    
    const L = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(L);
    
    lauxlib.luaL_dostring(L, `
        print("Hello from Lua in browser!")
    `);
</script>
```

## Database Integration

### SQLite (luasql)

```lua
local luasql = require "luasql.sqlite3"

env = luasql.sqlite3()
conn = env:connect("test.db")

-- Execute query
conn:execute("CREATE TABLE users (id INTEGER, name TEXT)")
conn:execute("INSERT INTO users VALUES (1, 'John')")

-- Query
cursor = conn:execute("SELECT * FROM users")
row = cursor:fetch({}, "a")
while row do
    print(row.id, row.name)
    row = cursor:fetch(row, "a")
end

cursor:close()
conn:close()
env:close()
```

### MySQL

```lua
local mysql = require "mysql"

local db, err = mysql.connect({
    host = "localhost",
    user = "root",
    password = "password",
    database = "test"
})

if db then
    local result, err = db:query("SELECT * FROM users")
    for i, row in ipairs(result) do
        print(row.id, row.name)
    end
    db:close()
end
```

## HTTP Integration

### lua-http

```lua
local http = require "http.request"

local req = http.new_from_uri("https://api.example.com/data")
req:set_header("Content-Type", "application/json")

local headers, stream = req:go()
local body, err = stream:read_body()

print(body)
```

### luasocket

```lua
local http = require "socket.http"
local ltn12 = require "ltn12"

local body, code, headers = http.request{
    url = "https://api.example.com/data",
    method = "GET",
    sink = ltn12.sink.table(response)
}

print(body)
```

## Best Practices

1. **ใช้ wrapper libraries** เพื่อลดความซับซ้อน
2. **จัดการ errors** จากทั้งสองฝั่ง
3. **จำกัด data transfer** ระหว่างภาษา
4. **ใช้ type conversion** อย่างระมัดระวัง
5. **เขียน tests** สำหรับ integration points
6. **Document API** ระหว่างภาษาชัดเจน
7. **ใช้ versioning** สำหรับ Lua bindings
