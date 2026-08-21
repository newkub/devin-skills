# Architecture - Lua

## ภาพรวมสถาปัตยกรรม Lua Projects

Lua projects มีหลาย patterns ขึ้นอยู่กับ use case เช่น game development, embedded systems, หรือ web applications

## Project Structure Patterns

### โครงสร้างพื้นฐาน

```
my-lua-project/
├── src/                    # Source code
│   ├── main.lua           # Entry point
│   ├── config.lua         # Configuration
│   └── modules/           # Custom modules
│       ├── utils.lua
│       └── database.lua
├── spec/                  # Tests
│   └── main_spec.lua
├── assets/                # Assets (images, sounds)
├── docs/                  # Documentation
├── scripts/               # Build/utility scripts
├── .luacheckrc           # Linter config
├── .luarc.json           # LuaLS config
└── README.md
```

### Game Development Structure

```
game-project/
├── src/
│   ├── main.lua
│   ├── core/
│   │   ├── game.lua      # Game state
│   │   ├── scene.lua     # Scene management
│   │   └── events.lua    # Event system
│   ├── entities/
│   │   ├── player.lua
│   │   ├── enemy.lua
│   │   └── npc.lua
│   ├── systems/
│   │   ├── physics.lua
│   │   ├── rendering.lua
│   │   └── input.lua
│   └── ui/
│       ├── menu.lua
│       └── hud.lua
├── assets/
│   ├── sprites/
│   ├── sounds/
│   └── fonts/
└── data/
    └── levels/
```

### Embedded Application Structure

```
embedded-app/
├── lua/
│   ├── init.lua          # Entry point
│   ├── api/              # Lua API for host
│   │   ├── hardware.lua
│   │   └── network.lua
│   ├── logic/            # Business logic
│   │   └── controller.lua
│   └── config/           # Configuration
│       └── settings.lua
├── host/                 # Host application (C/C++)
│   ├── main.c
│   └── lua_binding.c
└── scripts/
    └── build.sh
```

## Module Architecture

### Module Pattern

```lua
-- mymodule.lua
local M = {}

-- Private variables
local private_var = 42

-- Private functions
local function private_func()
    return private_var
end

-- Public API
function M.public_func()
    return private_func()
end

function M.set_value(val)
    private_var = val
end

return M
```

### การใช้งาน

```lua
local mymodule = require("mymodule")
mymodule.public_func()
```

### Class Pattern (OOP)

```lua
-- class.lua
local Class = {}
Class.__index = Class

function Class.new(initial_value)
    local self = setmetatable({}, Class)
    self.value = initial_value or 0
    return self
end

function Class:increment()
    self.value = self.value + 1
    return self
end

function Class:get_value()
    return self.value
end

return Class
```

### การใช้งาน

```lua
local Class = require("class")
local obj = Class.new(10)
obj:increment()
print(obj:get_value())  -- 11
```

## Component Architecture

### Entity-Component-System (ECS)

```lua
-- entity.lua
local Entity = {}
Entity.__index = Entity

function Entity.new(id)
    local self = setmetatable({}, Entity)
    self.id = id
    self.components = {}
    return self
end

function Entity:add_component(name, component)
    self.components[name] = component
end

function Entity:get_component(name)
    return self.components[name]
end

return Entity
```

```lua
-- system.lua
local System = {}
System.__index = System

function System.new(filter_fn)
    local self = setmetatable({}, System)
    self.entities = {}
    self.filter = filter_fn
    return self
end

function System:add_entity(entity)
    if self.filter(entity) then
        table.insert(self.entities, entity)
    end
end

function System:update(dt)
    for _, entity in ipairs(self.entities) do
        self.process(entity, dt)
    end
end

return System
```

## State Management

### State Machine Pattern

```lua
-- state_machine.lua
local StateMachine = {}
StateMachine.__index = StateMachine

function StateMachine.new()
    local self = setmetatable({}, StateMachine)
    self.states = {}
    self.current_state = nil
    return self
end

function StateMachine:add_state(name, state)
    self.states[name] = state
end

function StateMachine:change_state(name)
    if self.current_state and self.current_state.exit then
        self.current_state:exit()
    end
    self.current_state = self.states[name]
    if self.current_state and self.current_state.enter then
        self.current_state:enter()
    end
end

function StateMachine:update(dt)
    if self.current_state and self.current_state.update then
        self.current_state:update(dt)
    end
end

return StateMachine
```

### การใช้งาน

```lua
local StateMachine = require("state_machine")

local sm = StateMachine.new()

sm:add_state("menu", {
    enter = function() print("Enter menu") end,
    update = function(dt) -- menu logic end,
    exit = function() print("Exit menu") end
})

sm:add_state("game", {
    enter = function() print("Enter game") end,
    update = function(dt) -- game logic end,
    exit = function() print("Exit game") end
})

sm:change_state("menu")
```

## Event System

### Observer Pattern

```lua
-- event_manager.lua
local EventManager = {}
EventManager.__index = EventManager

function EventManager.new()
    local self = setmetatable({}, EventManager)
    self.listeners = {}
    return self
end

function EventManager:subscribe(event_name, callback)
    if not self.listeners[event_name] then
        self.listeners[event_name] = {}
    end
    table.insert(self.listeners[event_name], callback)
end

function EventManager:publish(event_name, data)
    if self.listeners[event_name] then
        for _, callback in ipairs(self.listeners[event_name]) do
            callback(data)
        end
    end
end

return EventManager
```

## Dependency Injection

### Service Container

```lua
-- container.lua
local Container = {}
Container.__index = Container

function Container.new()
    local self = setmetatable({}, Container)
    self.services = {}
    return self
end

function Container:register(name, factory)
    self.services[name] = factory
end

function Container:resolve(name)
    if not self.services[name] then
        error("Service not found: " .. name)
    end
    return self.services[name]()
end

return Container
```

### การใช้งาน

```lua
local Container = require("container")

local container = Container.new()

container:register("database", function()
    return Database.new("localhost", 5432)
end)

container:register("logger", function()
    return Logger.new("app.log")
end)

local db = container:resolve("database")
local logger = container:resolve("logger")
```

## Configuration Architecture

### Layered Configuration

```lua
-- config.lua
local Config = {}

-- Default config
local defaults = {
    debug = false,
    log_level = "info",
    max_connections = 10
}

-- Environment-specific
local environments = {
    development = {
        debug = true,
        log_level = "debug"
    },
    production = {
        debug = false,
        log_level = "warn"
    }
}

function Config.load(env)
    local config = {}

    -- Copy defaults
    for k, v in pairs(defaults) do
        config[k] = v
    end

    -- Override with environment
    if environments[env] then
        for k, v in pairs(environments[env]) do
            config[k] = v
        end
    end

    return config
end

return Config
```

## Plugin Architecture

### Plugin System

```lua
-- plugin_manager.lua
local PluginManager = {}
PluginManager.__index = PluginManager

function PluginManager.new()
    local self = setmetatable({}, PluginManager)
    self.plugins = {}
    self.hooks = {}
    return self
end

function PluginManager:load_plugin(name)
    local plugin = require("plugins." .. name)
    if plugin.init then
        plugin.init(self)
    end
    self.plugins[name] = plugin
end

function PluginManager:add_hook(hook_name, callback)
    if not self.hooks[hook_name] then
        self.hooks[hook_name] = {}
    end
    table.insert(self.hooks[hook_name], callback)
end

function PluginManager:execute_hook(hook_name, ...)
    if self.hooks[hook_name] then
        for _, callback in ipairs(self.hooks[hook_name]) do
            callback(...)
        end
    end
end

return PluginManager
```

## Data Flow Architecture

### MVC Pattern

```lua
-- model.lua
local Model = {}
Model.__index = Model

function Model.new(data)
    local self = setmetatable({}, Model)
    self.data = data or {}
    self.listeners = {}
    return self
end

function Model:set(key, value)
    self.data[key] = value
    self:notify("changed", key, value)
end

function Model:get(key)
    return self.data[key]
end

function Model:subscribe(callback)
    table.insert(self.listeners, callback)
end

function Model:notify(event, ...)
    for _, callback in ipairs(self.listeners) do
        callback(event, ...)
    end
end

return Model
```

```lua
-- view.lua
local View = {}
View.__index = View

function View.new(model)
    local self = setmetatable({}, View)
    self.model = model
    model:subscribe(function(event, key, value)
        self:update(key, value)
    end)
    return self
end

function View:update(key, value)
    print("View updated:", key, "=", value)
end

return View
```

```lua
-- controller.lua
local Controller = {}
Controller.__index = Controller

function Controller.new(model, view)
    local self = setmetatable({}, Controller)
    self.model = model
    self.view = view
    return self
end

function Controller:handle_input(key, value)
    self.model:set(key, value)
end

return Controller
```

## Testing Architecture

### Test Structure

```
spec/
├── unit/
│   ├── utils_spec.lua
│   └── database_spec.lua
├── integration/
│   └── api_spec.lua
└── helpers/
    └── test_helpers.lua
```

### Test Helpers

```lua
-- spec/helpers/test_helpers.lua
local Helpers = {}

function Helpers.create_mock_db()
    return {
        query = function() return {} end,
        close = function() end
    }
end

function Helpers.assert_equals(actual, expected)
    if actual ~= expected then
        error(string.format("Expected %s, got %s", expected, actual))
    end
end

return Helpers
```

## Performance Architecture

### Object Pooling

```lua
-- pool.lua
local Pool = {}
Pool.__index = Pool

function Pool.new(factory, initial_size)
    local self = setmetatable({}, Pool)
    self.factory = factory
    self.pool = {}

    for i = 1, initial_size do
        table.insert(self.pool, factory())
    end

    return self
end

function Pool:acquire()
    if #self.pool > 0 then
        return table.remove(self.pool)
    end
    return self.factory()
end

function Pool:release(obj)
    table.insert(self.pool, obj)
end

return Pool
```

## Best Practices

1. **ใช้ modules** แยก concerns ชัดเจน
2. **ใช้ dependency injection** สำหรับ testability
3. **ใช้ events** สำหรับ loose coupling
4. **จัดโครงสร้างตาม feature** ไม่ใช่ file type
5. **ใช้ singleton** อย่างระมัดระวัง
6. **เขียน tests** สำหรับ critical components
7. **Document architecture** ใน README หรือ docs/
