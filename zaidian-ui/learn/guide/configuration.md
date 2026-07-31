# Configuration

## Tailwind CSS Configuration

### Base Config

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ... theme extensions
    },
  },
  plugins: [],
}
```

### Theme Customization

#### Colors

ปรับ colors ตาม brand:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // ... other colors
    },
  },
}
```

#### Spacing

```javascript
theme: {
  extend: {
    spacing: {
      // custom spacing
    },
  },
}
```

#### Typography

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
}
```

## CSS Variables

### Light Mode

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}
```

### Dark Mode

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... other variables */
}
```

## Component Configuration

### Default Props

```tsx
// components/ui/button.tsx
export const Button = (props: ButtonProps) => {
  return (
    <button
      class="px-4 py-2 rounded-md"
      {...props}
    />
  )
}
```

### Custom Variants

```tsx
// components/ui/button.tsx
const variants = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-input",
}
```

## Kobalte Configuration

### Root Provider

```tsx
import { Root } from "@kobalte/core"

export function App() {
  return (
    <Root>
      {/* your app */}
    </Root>
  )
}
```

### Theme Provider

```tsx
import { ThemeProvider } from "./components/theme-provider"

export function App() {
  return (
    <ThemeProvider>
      {/* your app */}
    </ThemeProvider>
  )
}
```

## Corvu Configuration

### Root Provider

```tsx
import { Root } from "@corvu/root"

export function App() {
  return (
    <Root>
      {/* your app */}
    </Root>
  )
}
```

## TypeScript Configuration

### Component Props

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  children: JSX.Element
}
```

### Type Exports

```tsx
export type { ButtonProps }
```

## Environment Variables

สร้าง `.env` file:

```env
# Theme
VITE_THEME=light

# API (ถ้ามี)
VITE_API_URL=https://api.example.com
```

## Build Configuration

### Vite Config

```javascript
// vite.config.ts
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid()],
})
```

### SolidStart Config

```javascript
// app.config.ts
export default defineConfig({
  ssr: true,
})
```
