# Quick Start - Lua

## Basic Syntax

### Hello World

```lua
print("Hello, World!")

-- With formatting
local name = "Lua"
print(string.format("Hello, %s!", name))
```

### Variables

```lua
-- Declaring variables
local age = 25
local name = "John"
local is_active = true

-- Reassignment
age = 26
```

### Functions

```lua
-- Define a function
function greet(name)
  return "Hello, " .. name
end

-- Call function
local message = greet("World")
print(message)
```

### Tables

```lua
-- Array
local fruits = {"apple", "banana", "orange"}
print(fruits[1])  -- apple

-- Dictionary
local user = {name = "John", age = 30}
print(user.name)  -- John

-- Adding elements
table.insert(fruits, "grape")
```

### Conditionals

```lua
local score = 85

if score >= 90 then
  print("A")
elseif score >= 80 then
  print("B")
else
  print("C")
end
```

### Loops

```lua
-- For loop
for i = 1, 5 do
  print(i)
end

-- While loop
local count = 1
while count <= 5 do
  print(count)
  count = count + 1
end

-- For-in loop
local items = {"a", "b", "c"}
for index, value in ipairs(items) do
  print(index, value)
end
```

## Example: Simple Program

```lua
-- main.lua
local function calculate_bonus(salary, years)
  local base_rate = 0.05
  local years_bonus = years * 0.01
  return salary * (base_rate + years_bonus)
end

local function main()
  local salary = 50000
  local years = 3
  
  local bonus = calculate_bonus(salary, years)
  print(string.format("Bonus: $%.2f", bonus))
end

main()
```

Run with:
```bash
lua main.lua
```
