# API Reference

## Component Patterns

Zaidan components ใช้ pattern คล้าย shadcn/ui โดยรับ `class` หรือ `className` เพื่อ merge เพิ่มจาก Tailwind utility classes และรับ `variant`/`size` ผ่าน `class-variance-authority` (cva) variants

```tsx
import { Button } from "@/components/ui/button"

<Button variant="outline" size="sm" class="my-2">
  Click me
</Button>
```

## Common Props

| Prop | Type | Description |
|------|------|-------------|
| `class` | `string` | Tailwind classes เพิ่มเติม |
| `children` | `JSX.Element` | Component content |
| `variant` | `string` | Style variant จาก `cva` |
| `size` | `string` | Size variant จาก `cva` |
| `disabled` | `boolean` | Disable state |

## Kobalte Primitives

Zaidan สร้างบน Kobalte สำหรับ accessible components:

- `Button`, `Checkbox`, `Dialog`, `DropdownMenu`, `Popover`, `RadioGroup`, `Select`, `Slider`, `Switch`, `Tabs`, `Toast`, `Toggle`, `Tooltip`
- แต่ละ component มักประกอบด้วย Root, Trigger, Content, Item, Label ฯลฯ
- ดูรายละเอียด: https://kobalte.dev

## Corvu Primitives

สำหรับ components ที่ต้องการ advanced interactions เช่น Drawer, Resizable, OTP Field, Command:

- `Dialog`, `Drawer`, `OTPField`, `Command`, `Resizable`
- ดูรายละเอียด: https://corvu.dev

## Utility Functions

### cn()

Merge Tailwind classes ด้วย `clsx` + `tailwind-merge`:

```tsx
import { cn } from "@/lib/utils"

cn("px-4 py-2", "bg-primary")
```

## Type Exports

Components มัก export types:

```tsx
import type { ButtonProps } from "@/components/ui/button"
```

## Source

- Zaidan components: https://zaidan.carere.dev/docs/components
- Kobalte docs: https://kobalte.dev
- Corvu docs: https://corvu.dev
