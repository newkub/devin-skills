# Lua C API Reference

## Key Functions

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

## See Also

- [Standard Library API](lua-stdlib-api.md) - Lua standard library functions and metamethods
- [CLI Commands](lua-cli-commands.md) - Lua interpreter and LuaRocks commands
- [Configuration](lua-config.md) - Lua environment and IDE configuration
