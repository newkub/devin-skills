# Core Concepts - Lua

## Overview

Lua เป็น lightweight, high-level, dynamically-typed language ที่ออกแบบมาเพื่อ embedding ใน applications

## Variables and Types

```lua
-- Numbers
local num = 42
local float = 3.14

-- Strings
local str = "Hello"
local concat = "Hello " .. "World"

-- Booleans
local bool = true

-- Tables (arrays and dictionaries)
local arr = {1, 2, 3}
local dict = {name = "John", age = 30}

-- Nil
local nothing = nil

-- Functions
local function add(a, b)
  return a + b
end

-- Closures
local function counter()
  local count = 0
  return function()
    count = count + 1
    return count
  end
end
```

## Control Flow

```lua
-- If-else
if x > 10 then
  print("big")
elseif x > 5 then
  print("medium")
else
  print("small")
end

-- While loop
while i < 10 do
  i = i + 1
end

-- For loop
for i = 1, 10 do
  print(i)
end

-- For-in loop
for key, value in pairs(dict) do
  print(key, value)
end
```

## Functions

```lua
-- Basic function
function greet(name)
  return "Hello, " .. name
end

-- Multiple returns
function math.divmod(a, b)
  return math.floor(a / b), a % b
end

-- Variable arguments
function sum(...)
  local result = 0
  for _, v in ipairs({...}) do
    result = result + v
  end
  return result
end
```

## Tables

```lua
-- Array operations
local arr = {10, 20, 30}
table.insert(arr, 40)
table.remove(arr, 1)

-- Dictionary operations
local dict = {}
dict.name = "John"
dict["age"] = 30

-- Metatables
local Meta = {}
Meta.__index = Meta
```

## Coroutines

```lua
-- Create coroutine
local co = coroutine.create(function()
  for i = 1, 3 do
    coroutine.yield(i)
  end
end)

-- Resume coroutine
print(coroutine.resume(co))  -- true, 1
print(coroutine.resume(co))  -- true, 2
```
