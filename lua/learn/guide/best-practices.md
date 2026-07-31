# Best Practices - Lua

## Naming Conventions

```lua
-- Variables: lowercase with underscores
local max_count = 100
local user_name = "John"

-- Functions: lowercase with underscores
function calculate_total(items)
  -- ...
end

-- Constants: uppercase
local MAX_RETRY = 3
local DEFAULT_PATH = "/usr/local"

-- Tables (classes): PascalCase
local UserAccount = {}
local DocumentParser = {}
```

## Table Patterns

### Arrays

```lua
-- Use sequential indices
local fruits = {"apple", "banana", "orange"}

-- Use ipairs for sequential tables
for i, fruit in ipairs(fruits) do
  print(i, fruit)
end
```

### Dictionaries

```lua
-- Use pairs for non-sequential tables
local config = {
  host = "localhost",
  port = 8080
}

for key, value in pairs(config) do
  print(key, value)
end
```

## Error Handling

```lua
-- pcall for protected calls
local success, result = pcall(function()
  error("something went wrong")
end)

if not success then
  print("Error: " .. result)
end

-- Custom errors
if not data then
  error("Data is required", 2)
end
```

## Performance Tips

```lua
-- Pre-allocate tables when size is known
local arr = {}
for i = 1, 1000 do
  arr[i] = i
end

-- Use local for frequently accessed values
local len = string.len
for i = 1, #arr do
  len(arr[i])
end

-- Avoid global variables
local M = {}
M.my_function = function() end
```

## Module Organization

```lua
-- mymodule.lua
local M = {}

function M.func1()
  -- ...
end

function M.func2()
  -- ...
end

return M
```

## Style Best Practices

1. Always use `local` for variables
2. Use meaningful names
3. Keep functions small and focused
4. Use comments for non-obvious logic
5. Handle errors gracefully
6. Prefer table.insert over manual indexing
