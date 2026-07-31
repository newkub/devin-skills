# Quick Start

## เริ่มต้นใช้งานอย่างรวดเร็ว

### Step 1: เลือก Component

เข้า https://shadcn-solid.com และเลือก component ที่ต้องการ

### Step 2: Copy Component Code

กดปุ่ม "Copy" บน component page เพื่อ copy code

### Step 3: สร้างไฟล์ Component

สร้างไฟล์ใน project เช่น `src/components/ui/button.tsx`

### Step 4: Paste Code

Paste code ที่ copy มาลงในไฟล์

### Step 5: ติดตั้ง Dependencies

รันคำสั่งติดตั้ง dependencies ที่แนะนำ:

```bash
bun add @kobalte/core
```

### Step 6: ใช้ Component

Import และใช้ใน application:

```tsx
import { Button } from "~/components/ui/button"

export default function App() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  )
}
```

## Example: Button Component

```tsx
// src/components/ui/button.tsx
import { Button as ButtonPrimitive } from "@kobalte/core/button"
import { cn } from "~/lib/utils"
import { splitProps } from "solid-js"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends ButtonPrimitive.ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  class?: string
}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["variant", "size", "class"])
  return (
    <ButtonPrimitive
      class={cn(
        buttonVariants({
          variant: local.variant,
          size: local.size,
        }),
        local.class
      )}
      {...others}
    />
  )
}
```

## Next Steps

- อ่าน [Installation](./installation.md) สำหรับ setup ครบถ้วน
- อ่าน [Configuration](./configuration.md) สำหรับ customization
- ดู [Best Practices](./best-practices.md) สำหรับการใช้งานที่ดี
