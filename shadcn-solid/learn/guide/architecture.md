# Architecture

## Architecture ของ shadcn-solid

```
┌─────────────────────────────────────────────────────────────┐
│                shadcn-solid Architecture                      │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   Website    │
                    │shadcn-solid │
                    │    .com      │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Registry    │
                    │  Components  │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Kobalte  │    │ Tailwind │    │ SolidJS  │
    │ Primitives│    │   CSS    │    │Reactivity│
    └──────────┘    └──────────┘    └──────────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Your App    │
                    │  SolidJS     │
                    └──────────────┘
```

## Component Architecture

### 1. Component Structure

แต่ละ component มีโครงสร้าง:

```
component-name/
├── component-name.tsx    # Main component
└── index.ts              # Re-exports
```

### 2. Layer Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer           │
│  (Component UI + Tailwind Classes)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Primitive Layer              │
│      (Kobalte Primitives)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Core Layer                   │
│      (SolidJS Reactivity)            │
└─────────────────────────────────────┘
```

## Design System Architecture

### 1. Token System

shadcn-solid ใช้ CSS variables สำหรับ design tokens:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}
```

### 2. Variant System

ใช้ `class-variance-authority` สำหรับจัดการ variants:

```
Component
├── Variants
│   ├── default
│   ├── destructive
│   ├── outline
│   └── ...
└── Sizes
    ├── default
    ├── sm
    ├── lg
    └── icon
```

## Internal Architecture

### 1. Registry System

Registry เป็น centralized collection ของ components:

```
Registry
├── Components
│   ├── Form Components
│   ├── Layout Components
│   ├── Navigation Components
│   └── Data Display Components
└── Utils
    ├── cn()
    ├── cva()
    └── ...
```

### 2. Build System

```
Source Files
     │
     ▼
TypeScript Compiler
     │
     ▼
Tailwind CSS Processor
     │
     ▼
Output Files
```

## Dependency Graph

```
Your App
    │
    ├─> solid-js (Core)
    ├─> @kobalte/core (Primitives)
    ├─> tailwindcss (Styling)
    ├─> class-variance-authority (Variants)
    ├─> clsx (Classes)
    └─> tailwind-merge (Merge)
```

## Performance Architecture

### 1. Bundle Optimization

- Tree-shaking สำหรับ unused components
- Code splitting สำหรับ large components
- Lazy loading สำหรับ optional features

### 2. Runtime Performance

- SolidJS fine-grained reactivity
- Minimal re-renders
- Efficient DOM updates
