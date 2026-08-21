# All Features - Lua

## Data Types

| Type | Description |
|------|-------------|
| nil | absence or invalid value |
| boolean | true, false |
| number | integers and floats |
| string | sequences of characters |
| function | first-class functions |
| userdata | arbitrary C data |
| thread | coroutines |
| table | associative arrays |

## Operators

### Arithmetic

`+`, `-`, `*`, `/`, `%`, `^` (power)

### Comparison

`==`, `~=`, `<`, `>`, `<=`, `>=`

### Logical

`and`, `or`, `not`

### Concatenation

`..` (string concatenation)

### Length

`#` (length operator for tables)

## Standard Library

### math

```lua
math.abs, math.ceil, math.floor
math.max, math.min, math.sin, math.cos
math.random, math.sqrt
```

### string

```lua
string.len, string.sub, string.find
string.match, string.gmatch, string.gsub
```

### table

```lua
table.insert, table.remove, table.concat
table.sort, table.move, table.unpack
```

### io

```lua
io.open, io.close, io.read, io.write
```

### os

```lua
os.clock, os.date, os.time, os.execute
```

## Object-Oriented Programming

Lua uses metatables for OOP:

```lua
Account = {balance = 0}

function Account:new(obj)
  obj = obj or {}
  setmetatable(obj, self)
  self.__index = self
  return obj
end

function Account:deposit(amount)
  self.balance = self.balance + amount
end

local acc = Account:new()
acc:deposit(100)
```
