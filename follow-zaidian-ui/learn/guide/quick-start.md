# Quick Start

## 5 นาทีเริ่มต้นใช้งาน

### Step 1: สร้าง Project

```bash
bun create solid my-app
cd my-app
```

### Step 2: ติดตั้ง Dependencies

```bash
bun add @kobalte/core @corvu/root
bun add -D tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

### Step 3: ตั้งค่า Tailwind

แก้ไข `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

เพิ่ม CSS ใน `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: เพิ่ม Component

สร้าง `src/components/ui/button.tsx`:

```tsx
import { Button as KobalteButton } from "@kobalte/core/button"

export function Button(props: any) {
  return (
    <KobalteButton
      class="px-4 py-2 bg-blue-500 text-white rounded-md"
      {...props}
    >
      {props.children}
    </KobalteButton>
  )
}
```

### Step 5: ใช้งาน

แก้ไข `src/App.tsx`:

```tsx
import { Button } from "./components/ui/button"

export default function App() {
  return (
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-4">Hello Zaidan UI</h1>
      <Button>Click me</Button>
    </div>
  )
}
```

### Step 6: Run

```bash
bun run dev
```

เปิด browser ที่ `http://localhost:3000`

## ตัวอย่าง Component

### Button

```tsx
import { Button } from "./components/ui/button"

<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
```

### Card

```tsx
import { Card } from "./components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### Input

```tsx
import { Input } from "./components/ui/input"

<Input placeholder="Enter text..." />
```

## Next Steps

- [อ่าน Installation](./installation.md) สำหรับการติดตั้งแบบละเอียด
- [อ่าน Configuration](./configuration.md) สำหรับการตั้งค่า
- [อ่าน Best Practices](./best-practices.md) สำหรับ best practices
- [ดู Components](https://zaidan.carere.dev/ui) สำหรับ components ทั้งหมด
