# API Reference - Lua

## Standard Library API

### Global Functions

| Function | Description | Example |
|----------|-------------|---------|
| `print(...)` | Print values to stdout | `print("Hello")` |
| `type(v)` | Get type of value | `type(42)` → `"number"` |
| `assert(v, message)` | Assert condition | `assert(x > 0, "x must be positive")` |
| `error(message, level)` | Throw error | `error("Something went wrong")` |
| `pcall(f, ...)` | Protected call | `pcall(func, arg1, arg2)` |
| `xpcall(f, handler)` | Protected call with handler | `xpcall(func, handler)` |
| `ipairs(t)` | Iterate array | `for i, v in ipairs(t) do` |
| `pairs(t)` | Iterate table | `for k, v in pairs(t) do` |
| `load(chunk, name)` | Load chunk | `load("print('hello')")` |
| `loadfile(filename)` | Load file | `loadfile("script.lua")` |
| `dofile(filename)` | Execute file | `dofile("script.lua")` |
| `require(modname)` | Load module | `require("mymodule")` |
| `next(t, index)` | Get next key | `next(t)` |
| `select(index, ...)` | Select argument | `select(2, a, b, c)` → `b` |

## String Library

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `string.len(s)` | Get length | `string.len("hello")` → `5` |
| `string.sub(s, i, j)` | Get substring | `string.sub("hello", 2, 4)` → `"ell"` |
| `string.upper(s)` | Convert to uppercase | `string.upper("hello")` → `"HELLO"` |
| `string.lower(s)` | Convert to lowercase | `string.lower("HELLO")` → `"hello"` |
| `string.reverse(s)` | Reverse string | `string.reverse("hello")` → `"olleh"` |
| `string.rep(s, n)` | Repeat string | `string.rep("a", 3)` → `"aaa"` |
| `string.byte(s, i)` | Get byte value | `string.byte("a")` → `97` |
| `string.char(...)` | Create string from bytes | `string.char(97)` → `"a"` |
| `string.find(s, pattern)` | Find pattern | `string.find("hello", "el")` → `2, 3` |
| `string.match(s, pattern)` | Match pattern | `string.match("hello", "h..")` → `"hel"` |
| `string.gmatch(s, pattern)` | Global match | `for w in string.gmatch(s, "%w+") do` |
| `string.gsub(s, pattern, repl)` | Global replace | `string.gsub("hello", "l", "x")` → `"hexxo"` |
| `string.format(fmt, ...)` | Format string | `string.format("%s %d", "age", 42)` |

### Patterns

| Pattern | Description |
|---------|-------------|
| `.` | Any character |
| `%a` | Letter |
| `%c` | Control character |
| `%d` | Digit |
| `%l` | Lowercase letter |
| `%u` | Uppercase letter |
| `%w` | Alphanumeric |
| `%x` | Hexadecimal digit |
| `%s` | Whitespace |
| `%p` | Punctuation |
| `%bxy` | Balanced between x and y |

## Table Library

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `table.insert(t, pos, value)` | Insert element | `table.insert(t, 1, "first")` |
| `table.remove(t, pos)` | Remove element | `table.remove(t, 1)` |
| `table.concat(t, sep, i, j)` | Concatenate | `table.concat({"a", "b"}, ",")` → `"a,b"` |
| `table.sort(t, comp)` | Sort table | `table.sort(t)` |
| `table.unpack(t, i, j)` | Unpack table | `table.unpack({1, 2, 3})` → `1, 2, 3` |
| `table.move(t1, f, e, t, t2)` | Move elements | `table.move(t1, 1, 3, 1, t2)` |
| `table.pack(...)` | Pack arguments | `table.pack(1, 2, 3)` |

## Math Library

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `math.abs(x)` | Absolute value | `math.abs(-5)` → `5` |
| `math.ceil(x)` | Round up | `math.ceil(3.2)` → `4` |
| `math.floor(x)` | Round down | `math.floor(3.8)` → `3` |
| `math.max(...)` | Maximum | `math.max(1, 2, 3)` → `3` |
| `math.min(...)` | Minimum | `math.min(1, 2, 3)` → `1` |
| `math.random()` | Random number | `math.random()` |
| `math.random(n)` | Random 1 to n | `math.random(10)` |
| `math.random(m, n)` | Random m to n | `math.random(1, 10)` |
| `math.sqrt(x)` | Square root | `math.sqrt(16)` → `4` |
| `math.pow(x, y)` | Power | `math.pow(2, 3)` → `8` |
| `math.sin(x)` | Sine | `math.sin(math.pi/2)` |
| `math.cos(x)` | Cosine | `math.cos(0)` |
| `math.tan(x)` | Tangent | `math.tan(math.pi/4)` |
| `math.asin(x)` | Arc sine | `math.asin(1)` |
| `math.acos(x)` | Arc cosine | `math.acos(0)` |
| `math.atan(x)` | Arc tangent | `math.atan(1)` |
| `math.atan2(y, x)` | Arc tangent 2 args | `math.atan2(1, 1)` |
| `math.exp(x)` | Exponential | `math.exp(1)` |
| `math.log(x)` | Natural log | `math.log(10)` |
| `math.log10(x)` | Base 10 log | `math.log10(100)` |
| `math.rad(x)` | Degrees to radians | `math.rad(180)` |
| `math.deg(x)` | Radians to degrees | `math.deg(math.pi)` |

### Constants

| Constant | Value |
|----------|-------|
| `math.pi` | 3.1415926535898 |
| `math.huge` | Infinity |
| `math.inf` | Infinity (Lua 5.3+) |

## IO Library

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `io.open(filename, mode)` | Open file | `io.open("file.txt", "r")` |
| `io.close(file)` | Close file | `file:close()` |
| `io.read(...)` | Read from stdin | `io.read("*line")` |
| `io.write(...)` | Write to stdout | `io.write("Hello")` |
| `io.flush()` | Flush output | `io.flush()` |
| `io.lines(filename)` | Iterate lines | `for line in io.lines("file.txt") do` |
| `io.input(file)` | Set input file | `io.input("file.txt")` |
| `io.output(file)` | Set output file | `io.output("file.txt")` |
| `io.type(obj)` | Get file type | `io.type(file)` |

### File Methods

| Method | Description |
|--------|-------------|
| `file:read(...)` | Read from file |
| `file:write(...)` | Write to file |
| `file:lines()` | Iterate lines |
| `file:close()` | Close file |
| `file:flush()` | Flush buffer |
| `file:seek(whence, offset)` | Seek position |
| `file:setvbuf(mode, size)` | Set buffer |

## OS Library

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `os.clock()` | CPU time | `os.clock()` |
| `os.time(table)` | Get time | `os.time()` |
| `os.date(format, time)` | Format date | `os.date("%Y-%m-%d")` |
| `os.difftime(t2, t1)` | Time difference | `os.difftime(t2, t1)` |
| `os.execute(command)` | Execute command | `os.execute("ls")` |
| `os.exit(code, close)` | Exit program | `os.exit(0)` |
| `os.getenv(varname)` | Get env var | `os.getenv("HOME")` |
| `os.remove(filename)` | Remove file | `os.remove("file.txt")` |
| `os.rename(old, new)` | Rename file | `os.rename("old.txt", "new.txt")` |
| `os.tmpname()` | Temp filename | `os.tmpname()` |

## Debug Library

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `debug.getinfo(level, what)` | Get function info | `debug.getinfo(1)` |
| `debug.getlocal(level, index)` | Get local variable | `debug.getlocal(1, 1)` |
| `debug.setlocal(level, index, value)` | Set local variable | `debug.setlocal(1, 1, 42)` |
| `debug.getupvalue(func, index)` | Get upvalue | `debug.getupvalue(func, 1)` |
| `debug.setupvalue(func, index, value)` | Set upvalue | `debug.setupvalue(func, 1, 42)` |
| `debug.getmetatable(obj)` | Get metatable | `debug.getmetatable(t)` |
| `debug.setmetatable(obj, mt)` | Set metatable | `debug.setmetatable(t, mt)` |
| `debug.getregistry()` | Get registry | `debug.getregistry()` |
| `debug.traceback(thread, message, level)` | Get traceback | `debug.traceback()` |
| `debug.sethook(hook, mask, count)` | Set hook | `debug.sethook(func, "crl", 1000)` |

## Coroutine Library

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `coroutine.create(f)` | Create coroutine | `coroutine.create(func)` |
| `coroutine.resume(co, ...)` | Resume coroutine | `coroutine.resume(co)` |
| `coroutine.yield(...)` | Yield from coroutine | `coroutine.yield(value)` |
| `coroutine.status(co)` | Get status | `coroutine.status(co)` |
| `coroutine.running()` | Get running coroutine | `coroutine.running()` |
| `coroutine.wrap(f)` | Wrap coroutine | `coroutine.wrap(func)` |
| `coroutine.isyieldable()` | Check if yieldable | `coroutine.isyieldable()` |

## Package Library

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `require(modname)` | Load module | `require("mymodule")` |
| `package.loaded` | Loaded modules | `package.loaded.mymodule` |
| `package.preload` | Preload loaders | `package.preload.mymodule` |
| `package.loadlib(libname, funcname)` | Load C library | `package.loadlib("lib.so", "init")` |
| `package.searchpath(name, path)` | Search path | `package.searchpath("mod", package.path)` |
| `package.path` | Lua search path | `package.path` |
| `package.cpath` | C search path | `package.cpath` |
| `package.searchers` | Searcher functions | `package.searchers` |

## UTF-8 Library (Lua 5.3+)

### Functions

| Function | Description | Example |
|----------|-------------|---------|
| `utf8.len(s)` | Get UTF-8 length | `utf8.len("你好")` → `2` |
| `utf8.sub(s, i, j)` | UTF-8 substring | `utf8.sub("你好", 1, 1)` → `"你"` |
| `utf8.offset(s, n)` | Byte offset | `utf8.offset("你好", 2)` |
| `utf8.codepoint(s, i, j)` | Get codepoints | `utf8.codepoint("你好")` |
| `utf8.char(...)` | Create string from codepoints | `utf8.char(20320)` → `"你"` |
| `utf8.codes(s)` | Iterate codepoints | `for p, c in utf8.codes(s) do` |

## Metamethods

| Metamethod | Description |
|------------|-------------|
| `__index` | Access missing key |
| `__newindex` | Assign missing key |
| `__add` | Addition operator |
| `__sub` | Subtraction operator |
| `__mul` | Multiplication operator |
| `__div` | Division operator |
| `__mod` | Modulo operator |
| `__pow` | Power operator |
| `__unm` | Unary minus |
| `__concat` | Concatenation |
| `__eq` | Equality |
| `__lt` | Less than |
| `__le` | Less than or equal |
| `__call` | Call table as function |
| `__tostring` | String conversion |
| `__len` | Length operator |
| `__pairs` | Custom pairs iterator |
| `__ipairs` | Custom ipairs iterator |

## Lua C API (Key Functions)

| Function | Description |
|----------|-------------|
| `luaL_newstate()` | Create new Lua state |
| `luaL_openlibs(L)` | Open standard libraries |
| `luaL_dofile(L, filename)` | Execute file |
| `luaL_dostring(L, str)` | Execute string |
| `lua_getglobal(L, name)` | Get global variable |
| `lua_setglobal(L, name)` | Set global variable |
| `lua_pushnumber(L, n)` | Push number to stack |
| `lua_pushstring(L, s)` | Push string to stack |
| `lua_pushnil(L)` | Push nil to stack |
| `lua_pushboolean(L, b)` | Push boolean to stack |
| `lua_tonumber(L, index)` | Get number from stack |
| `lua_tostring(L, index)` | Get string from stack |
| `lua_toboolean(L, index)` | Get boolean from stack |
| `lua_pcall(L, nargs, nresults, err)` | Protected call |
| `lua_pop(L, n)` | Pop n items from stack |
| `lua_gettop(L)` | Get stack size |
| `lua_settop(L, index)` | Set stack size |
