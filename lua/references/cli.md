# cli

## index.md

# CLI Reference - Lua

## Lua interpreter

```bash
# Run a script
lua script.lua

# Run with LuaJIT
luajit script.lua

# Evaluate expression
lua -e "print(math.sin(math.pi/4))"

# Interactive mode (REPL)
lua -i

# Show version
lua -v
```

## LuaRocks

```bash
# Install a package
luarocks install <package>

# Uninstall
luarocks remove <package>

# Search packages
luarocks search <term>

# Show package info
luarocks show <package>

# List installed packages
luarocks list

# Update a package
luarocks update <package>
```

## Common Commands

| Command | Description |
|---------|-------------|
| `lua -v` | Version |
| `lua -e 'code'` | Execute code |
| `lua script.lua` | Run script |
| `lua -i script.lua` | Interactive with script |
| `luarocks install pkg` | Install package |
| `luajit -v` | LuaJIT version |

## LuaJIT Specific

```bash
luajit -j off      # Disable JIT
luajit -j traceon   # Trace ON
luajit -j traceoff  # Trace OFF
luajit -j dump      # Dump IR
```


---

