# Configuration

## Tailwind CSS Configuration

### Theme Customization

แก้ไข `tailwind.config.js` เพื่อ custom theme:

```js
export default {
  theme: {
    extend: {
      colors: {
        // Custom colors
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          900: "#0c4a6e",
        },
      },
      borderRadius: {
        // Custom border radius
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
}
```

### Dark Mode

shadcn-solid รองรับ dark mode ผ่าน class-based approach:

```js
export default {
  darkMode: ["class"],
  // ...
}
```

เปิดใช้ dark mode:

```ts
// เพิ่ม class "dark" บน html element
document.documentElement.classList.add("dark")
```

## Component Configuration

### Component Props

แต่ละ component รองรับ props ต่างๆ:

| Prop | Type | Default | คำอธิบาย |
|------|------|---------|-----------|
| `class` | `string` | - | Custom CSS classes |
| `variant` | `string` | `default` | Style variant |
| `size` | `string` | `default` | Component size |
| `asChild` | `boolean` | `false` | Render as child component |

### Variant Configuration

ใช้ `class-variance-authority` (cva) สำหรับจัดการ variants:

```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
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
```

## Global Configuration

### CSS Variables

กำหนด CSS variables ใน `src/index.css`:

```css
:root {
  --radius: 0.5rem;
  --font-sans: "Inter", sans-serif;
}
```

### Font Configuration

ติดตั้ง fonts:

```bash
bun add @fontsource/inter
```

ใช้ใน `src/index.css`:

```css
@import "@fontsource/inter";

body {
  font-family: var(--font-sans);
}
```
