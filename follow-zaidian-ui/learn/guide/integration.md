# Integration

## SolidJS Integration

### Basic Setup

```tsx
import { Button } from "./components/ui/button"

export default function App() {
  return (
    <div class="p-8">
      <Button>Click me</Button>
    </div>
  )
}
```

### State Management

```tsx
import { createSignal } from "solid-js"
import { Button } from "./components/ui/button"

export default function App() {
  const [count, setCount] = createSignal(0)

  return (
    <div class="p-8">
      <Button onClick={() => setCount(c => c + 1)}>
        Count: {count()}
      </Button>
    </div>
  )
}
```

## SolidStart Integration

### Pages

```tsx
// src/routes/index.tsx
import { Button } from "~/components/ui/button"

export default function Home() {
  return (
    <div class="p-8">
      <Button>Click me</Button>
    </div>
  )
}
```

### Layouts

```tsx
// src/routes/$layout.tsx
import { Button } from "~/components/ui/button"

export default function Layout(props: any) {
  return (
    <div class="min-h-screen">
      <nav class="p-4 border-b">
        <Button variant="outline">Menu</Button>
      </nav>
      <props.children />
    </div>
  )
}
```

## Vite Integration

### Plugin Setup

```javascript
// vite.config.ts
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid()],
})
```

### Alias Setup

```javascript
// vite.config.ts
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~/": path.resolve(__dirname, "./src"),
    },
  },
})
```

## TypeScript Integration

### Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "~/components/*": ["./src/components/*"]
    }
  }
}
```

### Component Types

```tsx
// components/ui/button.tsx
import type { ComponentProps } from "solid-js"

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "outline"
}

export function Button(props: ButtonProps) {
  return <button {...props} />
}
```

## Theme Integration

### Theme Provider

```tsx
// components/theme-provider.tsx
import { createContext, useContext } from "solid-js"

interface ThemeContextValue {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const ThemeContext = createContext<ThemeContextValue>()

export function ThemeProvider(props: any) {
  const [theme, setTheme] = createSignal<"light" | "dark">("light")

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div class={theme() === "dark" ? "dark" : ""}>
        {props.children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
```

### Using Theme

```tsx
import { useTheme } from "./components/theme-provider"
import { Button } from "./components/ui/button"

export default function App() {
  const { theme, setTheme } = useTheme()

  return (
    <div class="p-8">
      <Button onClick={() => setTheme(theme() === "light" ? "dark" : "light")}>
        Toggle Theme
      </Button>
    </div>
  )
}
```

## Form Integration

### Kobalte Forms

```tsx
import { TextField, Checkbox, Select } from "@kobalte/core"

export function Form() {
  return (
    <form class="space-y-4">
      <TextField>
        <TextField.Label>Name</TextField.Label>
        <TextField.Input />
      </TextField>

      <Checkbox>
        <Checkbox.Input />
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox>

      <Select>
        <Select.Trigger>
          <Select.Value placeholder="Select option" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="1">Option 1</Select.Item>
          <Select.Item value="2">Option 2</Select.Item>
        </Select.Content>
      </Select>
    </form>
  )
}
```

## Routing Integration

### Solid Router

```tsx
import { Router, Routes, Route } from "@solidjs/router"
import { Button } from "./components/ui/button"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
      </Routes>
    </Router>
  )
}

function Home() {
  return (
    <div class="p-8">
      <h1>Home</h1>
      <Button variant="outline">
        <a href="/about">About</a>
      </Button>
    </div>
  )
}
```

## Data Fetching Integration

### Solid Query

```tsx
import { createQuery } from "@tanstack/solid-query"
import { Button } from "./components/ui/button"

export function Users() {
  const query = createQuery(() => ({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then(r => r.json()),
  }))

  return (
    <div class="p-8">
      <Button>Refresh</Button>
      <ul>
        <For each={query.data || []}>
          {user => <li>{user.name}</li>}
        </For>
      </ul>
    </div>
  )
}
```

## Testing Integration

### Vitest Setup

```tsx
// components/ui/button.test.tsx
import { render, screen } from "solid-testing-library"
import { Button } from "./button"

describe("Button", () => {
  it("should render", () => {
    render(() => <Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })
})
```
