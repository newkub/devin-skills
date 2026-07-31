# Best Practices

## Component Usage

### 1. ใช้ Semantic Components

```tsx
// ✅ Good
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"

// ❌ Bad
import { Button as Btn } from "./components/ui/button"
```

### 2. รักษา Consistency

ใช้ naming conventions ที่สม่ำเสมอ:

```tsx
// ✅ Good
components/ui/
  button.tsx
  card.tsx
  input.tsx

// ❌ Bad
components/ui/
  Button.tsx
  Card.tsx
  Input.tsx
```

### 3. ใช้ Props ที่เหมาะสม

```tsx
// ✅ Good
<Button variant="primary" size="md">
  Click me
</Button>

// ❌ Bad
<Button class="bg-blue-500 text-white px-4 py-2">
  Click me
</Button>
```

## Styling

### 1. ใช้ Tailwind Classes

```tsx
// ✅ Good
<div class="flex items-center gap-4">

// ❌ Bad
<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
```

### 2. ใช้ Design Tokens

```tsx
// ✅ Good
<div class="bg-primary text-primary-foreground">

// ❌ Bad
<div class="bg-blue-500 text-white">
```

### 3. รักษา Responsive Design

```tsx
// ✅ Good
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ Bad
<div class="grid grid-cols-3">
```

## Accessibility

### 1. ใช้ Semantic HTML

```tsx
// ✅ Good
<button>Click me</button>

// ❌ Bad
<div onClick={handleClick}>Click me</div>
```

### 2. เพิ่ม ARIA Labels

```tsx
// ✅ Good
<Button aria-label="Close dialog">
  <CloseIcon />
</Button>

// ❌ Bad
<Button>
  <CloseIcon />
</Button>
```

### 3. รักษา Keyboard Navigation

```tsx
// ✅ Good
import { TextField } from "@kobalte/core/text-field"

<TextField>
  <TextField.Label>Email</TextField.Label>
  <TextField.Input />
</TextField>

// ❌ Bad
<input placeholder="Email" />
```

## Performance

### 1. Tree-shaking

```tsx
// ✅ Good - import เฉพาะที่ใช้
import { Button } from "./components/ui/button"

// ❌ Bad - import ทั้งหมด
import * as UI from "./components/ui"
```

### 2. Lazy Loading

```tsx
// ✅ Good
import { lazy } from "solid-js"

const Dialog = lazy(() => import("./components/ui/dialog"))

// ❌ Bad
import { Dialog } from "./components/ui/dialog"
```

### 3. Code Splitting

```tsx
// ✅ Good
const routes = {
  "/": lazy(() => import("./pages/Home")),
  "/about": lazy(() => import("./pages/About")),
}
```

## TypeScript

### 1. ใช้ Type Safety

```tsx
// ✅ Good
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
}

// ❌ Bad
interface ButtonProps {
  variant?: string
  size?: string
}
```

### 2. Export Types

```tsx
// ✅ Good
export type { ButtonProps }

// ❌ Bad
// ไม่ export types
```

### 3. ใช้ Generics

```tsx
// ✅ Good
interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
}

// ❌ Bad
interface TableProps {
  data: any[]
  columns: any[]
}
```

## Testing

### 1. Test Components

```tsx
// ✅ Good
describe("Button", () => {
  it("should render", () => {
    const { getByText } = render(() => <Button>Click</Button>)
    expect(getByText("Click")).toBeInTheDocument()
  })
})
```

### 2. Test Accessibility

```tsx
// ✅ Good
it("should be accessible", () => {
  const { getByRole } = render(() => <Button>Click</Button>)
  expect(getByRole("button")).toHaveAttribute("type", "button")
})
```

## Organization

### 1. จัดกลุ่ม Components

```
components/
  ui/
    button/
      index.tsx
      button.tsx
    card/
      index.tsx
      card.tsx
```

### 2. ใช้ Barrel Exports

```tsx
// components/ui/index.ts
export { Button } from "./button"
export { Card } from "./card"
```

### 3. แยก Logic ออกจาก UI

```tsx
// ✅ Good
// components/ui/button.tsx
export function Button(props: ButtonProps) {
  return <button {...props} />
}

// hooks/use-button.ts
export function useButton() {
  // logic
}

// ❌ Bad
// components/ui/button.tsx
export function Button(props: ButtonProps) {
  const [state, setState] = createSignal(false)
  // logic mixed with UI
  return <button {...props} />
}
```

## Documentation

### 1. Comment Components

```tsx
// ✅ Good
/**
 * Button component with variants
 * @param variant - Button style variant
 * @param size - Button size
 */
export function Button(props: ButtonProps) {
  // ...
}

// ❌ Bad
export function Button(props: ButtonProps) {
  // ...
}
```

### 2. Document Props

```tsx
// ✅ Good
interface ButtonProps {
  /** Button style variant */
  variant?: "primary" | "secondary" | "outline"
  /** Button size */
  size?: "sm" | "md" | "lg"
}

// ❌ Bad
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
}
```
