# Installation - Lua

## Standalone Lua

### macOS

```bash
brew install lua
```

### Linux

```bash
sudo apt install lua5.3
# or
sudo apt install lua
```

### Windows

```bash
# Download from https://lua.org
# or use LuaDist
```

## LuaJIT

```bash
# Clone and build
git clone https://github.com/LuaJIT/LuaJIT.git
cd LuaJIT
make
sudo make install
```

## LuaRocks (Package Manager)

### Installation

```bash
# macOS/Linux
curl -R -O https://luarocks.github.io/luarocks/releases/luarocks-3.9.2.tar.gz
tar zxf luarocks-3.9.2.tar.gz
cd luarocks-3.9.2
./configure && make && sudo make install
```

### Usage

```bash
# Install packages
luarocks install luasocket
luarocks install luarocks

# Search packages
luarocks search json
```

## Lua in Visual Studio Code

### Extension

Install "Lua" extension by sumneko

### Configuration

```json
{
  "Lua.diagnostics.globals": ["vim"],
  "Lua.workspace.library": [
    "${3rd}/luv/library"
  ]
}
```

## Using Lua in Neovim

```lua
-- Neovim has built-in Lua support
:lua print("Hello from Lua")
:luafile script.lua
```

## Embedding Lua in C

```c
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>

int main() {
  lua_State *L = luaL_newstate();
  luaL_openlibs(L);
  
  luaL_dofile(L, "script.lua");
  
  lua_close(L);
  return 0;
}
```
