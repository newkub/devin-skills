# Integration

## Integration กับ Project ที่มีอยู่

### 1. ตรวจสอบ Compatibility

ตรวจสอบว่า project มี prerequisites:

| Requirement | Check Command |
|-------------|---------------|
| SolidJS | `grep solid-js package.json` |
| Tailwind CSS | `grep tailwindcss package.json` |
| Node.js | `node --version` |

### 2. ติดตั้ง Dependencies

ติดตั้ง dependencies หลัก:

```bash
bun add @kobalte/core
bun add -D tailwindcss-animate class-variance-authority clsx tailwind-merge
```

### 3. ตั้งค่า Tailwind

อัพเดท `tailwind.config.js`:

```js
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ... shadcn-solid theme config
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 4. เพิ่ม Global Styles

อัพเดท `src/index.css` ด้วย shadcn-solid base styles

### 5. สร้าง Utils File

สร้าง `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Migration จาก shadcn/ui (React)

### 1. Component Mapping

| shadcn/ui (React) | shadcn-solid (SolidJS) |
|-------------------|------------------------|
| Radix UI | Kobalte |
| React Hooks | SolidJS Signals |
| useState | createSignal |
| useEffect | createEffect |
| useMemo | createMemo |

### 2. Syntax Changes

**React:**
```tsx
const [open, setOpen] = useState(false)
```

**SolidJS:**
```ts
const [open, setOpen] = createSignal(false)
```

### 3. Event Handling

**React:**
```tsx
onClick={() => handleClick()}
```

**SolidJS:**
```tsx
onClick={handleClick}
```

## Integration กับ Other Libraries

### 1. Solid Router

ใช้ shadcn-solid components กับ Solid Router:

```tsx
import { Button } from "~/components/ui/button"
import { A } from "@solidjs/router"

export function Navigation() {
  return (
    <nav>
      <A href="/home">
        <Button variant="ghost">Home</Button>
      </A>
    </nav>
  )
}
```

### 2. Forms

ใช้กับ form libraries:

```tsx
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

export function Form() {
  return (
    <form>
      <Input name="email" type="email" />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### 3. Data Fetching

ใช้กับ data fetching:

```tsx
import { Button } from "~/components/ui/button"
import { createResource } from "solid-js"

export function DataComponent() {
  const [data] = createResource(fetchData)
  return (
    <Show when={data()}>
      <Button>{data().name}</Button>
    </Show>
  )
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Styles ไม่ทำงาน | ตรวจสอบ Tailwind content paths |
| Types ไม่ match | ตรวจสอบ TypeScript config |
| Components ไม่ render | ตรวจสอบ import paths |
| Dark mode ไม่ทำงาน | ตรวจสอบ darkMode config |
