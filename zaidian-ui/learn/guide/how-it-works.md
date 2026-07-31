# How It Works

## Component Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│              Zaidan UI Component Lifecycle                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Registry Selection                                      │
│     ┌──────────────┐                                        │
│     │ Browse UI    │                                        │
│     │ Copy Code    │                                        │
│     └──────┬───────┘                                        │
│            │                                                │
│  2. Installation                                             │
│     ┌──────────────┐                                        │
│     │ Add to project│                                       │
│     │ Configure deps│                                       │
│     └──────┬───────┘                                        │
│            │                                                │
│  3. Customization                                           │
│     ┌──────────────┐                                        │
│     │ Modify props │                                        │
│     │ Adjust styles│                                       │
│     └──────┬───────┘                                        │
│            │                                                │
│  4. Usage                                                    │
│     ┌──────────────┐                                        │
│     │ Import comp  │                                        │
│     │ Use in app   │                                        │
│     └──────────────┘                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Architecture

### Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│                    (Your SolidJS App)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Component Layer                         │
│                    (Zaidan Components)                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Primitive Layer                         │
│              (Kobalte + Corvu Primitives)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Styling Layer                           │
│                      (Tailwind CSS)                           │
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

แต่ละ component ใน Zaidan UI ประกอบด้วย:

### 1. Primitive Wrapper
- ใช้ Kobalte หรือ Corvu primitives
- จัดการ accessibility
- จัดการ state management

### 2. Styling Layer
- Tailwind CSS classes
- Design tokens
- Theme variables

### 3. Custom Props
- Props สำหรับ customization
- Default values
- Type definitions

## Accessibility

Zaidan UI รักษา accessibility ผ่าน:

### ARIA Attributes
- ใช้ Kobalte/Corvu primitives ที่มี ARIA support
- Screen reader compatible
- Semantic HTML

### Keyboard Navigation
- Tab order ถูกต้อง
- Shortcut keys
- Focus management

### Visual Indicators
- Focus states
- Hover states
- Active states

## Performance

### Optimization Strategies

1. **Tree-shaking** - เลือกใช้เฉพาะที่ต้องการ
2. **Lazy Loading** - load components เมื่อจำเป็น
3. **Code Splitting** - แยก code ตาม routes
4. **SSR Support** - Server-side rendering ด้วย SolidJS

### Bundle Size

เนื่องจากเป็น registry-based:
- เลือกใช้เฉพาะ components ที่ต้องการ
- ไม่มี unused code
- Bundle size เล็กลง
