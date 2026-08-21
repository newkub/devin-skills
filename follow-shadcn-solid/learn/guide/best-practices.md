# Best Practices

## Component Usage

### 1. ใช้ Composition Pattern

ใช้ compound components สำหรับ UI ที่ซับซ้อน:

```tsx
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 2. ใช้ Props อย่างเหมาะสม

| Practice | ❌ Avoid | ✅ Prefer |
|----------|---------|----------|
| Hardcode styles | `<Button class="bg-blue-500">` | `<Button variant="default">` |
| Ignore variants | Custom CSS เสมอ | ใช้ built-in variants |
| Override styles | `!important` | ใช้ `cn()` สำหรับ merge |

### 3. Accessibility

- ใช้ semantic HTML elements
- เพิ่ม ARIA labels เมื่อจำเป็น
- ทดสอบ keyboard navigation
- ทดสอบ screen reader

## Code Organization

### Folder Structure

```
src/
├── components/
│   └── ui/              # shadcn-solid components
│       ├── button.tsx
│       ├── dialog.tsx
│       └── ...
├── lib/
│   └── utils.ts         # Utility functions
└── styles/
    └── globals.css      # Global styles
```

### Naming Conventions

- Component: `PascalCase` (เช่น `Button`, `Dialog`)
- File: `kebab-case` (เช่น `button.tsx`, `dialog.tsx`)
- Props: `camelCase` (เช่น `variant`, `size`)

## Performance

### 1. Lazy Load Components

```tsx
const Dialog = lazy(() => import("~/components/ui/dialog"))
```

### 2. ใช้ SolidJS Optimizations

- ใช้ `createMemo` สำหรับ computed values
- ใช้ `createSignal` อย่างเหมาะสม
- หลีกเลี่ยง unnecessary re-renders

### 3. Minimize Bundle Size

- Tree-shake unused components
- ใช้ dynamic imports
- Optimize dependencies

## Customization

### 1. Extend Variants

เพิ่ม variants ใหม่:

```ts
const buttonVariants = cva(base, {
  variants: {
    variant: {
      // ... existing variants
      brand: "bg-brand-500 text-white hover:bg-brand-600",
    },
  },
})
```

### 2. Custom Themes

กำหนด custom theme ใน `tailwind.config.js`:

```js
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          // custom brand colors
        },
      },
    },
  },
}
```

### 3. Component Wrappers

สร้าง wrapper components สำหรับ reuse:

```tsx
export function PrimaryButton(props: ButtonProps) {
  return <Button variant="default" {...props} />
}
```

## Testing

### 1. Component Testing

ทดสอบ components ด้วย Vitest:

```ts
import { render, screen } from "solid-testing-library"
import { Button } from "./button"

describe("Button", () => {
  it("renders correctly", () => {
    render(() => <Button>Click</Button>)
    expect(screen.getByText("Click")).toBeInTheDocument()
  })
})
```

### 2. Accessibility Testing

ใช้ axe-core สำหรับ accessibility testing:

```ts
import { axe } from "jest-axe"

it("has no accessibility violations", async () => {
  const { container } = render(() => <Button>Click</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| ไม่ติดตั้ง dependencies | อ่าน dependencies ใน component page |
| CSS ไม่ทำงาน | ตรวจสอบ Tailwind config |
| Dark mode ไม่ทำงาน | เพิ่ม class "dark" บน html element |
| Types ไม่ match | ตรวจสอบ TypeScript version |
| Component ไม่ render | ตรวจสอบ import path |
