# Key Concept

## Zaidan UI คืออะไร

Zaidan UI เป็น Shadcn UI registry สำหรับ SolidJS ที่นำ developer experience ที่ยอดเยี่ยมของ Shadcn UI มาใช้กับ SolidJS

### หลักการทำงาน

```
┌─────────────────────────────────────────────────────────────┐
│                    Zaidan UI Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Kobalte   │    │    Corvu    │    │ Tailwind CSS │     │
│  │  (Primitives)│   │ (Primitives)│   │  (Styling)  │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                   │                   │            │
│         └───────────────────┼───────────────────┘            │
│                             │                                │
│                    ┌────────▼────────┐                        │
│                    │   Zaidan UI    │                        │
│                    │  (Components)  │                        │
│                    └────────┬────────┘                        │
│                             │                                │
│                    ┌────────▼────────┐                        │
│                    │   SolidJS App  │                        │
│                    └─────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Shadcn UI Pattern

### Registry-based Components

Shadcn UI ใช้ pattern แบบ registry-based ซึ่งแตกต่างจาก traditional component libraries:

| Traditional Library | Shadcn UI Pattern |
|---------------------|-------------------|
| Install ทั้ง library | Copy-paste components |
| Fixed API | Customizable code |
| Bundle size เดิม | Tree-shakable |
| อัปเดตผ่าน bun | Manual updates |

### Benefits

- **Full Control** - เจ้าของ code ทั้งหมด
- **Customization** - แก้ไขได้ตามต้องการ
- **No Bundle Bloat** - เลือกใช้เฉพาะที่ต้องการ
- **Learning** - เข้าใจวิธีทำงานของ components

## Kobalte & Corvu

### Kobalte

UI toolkit สำหรับ SolidJS ที่เน้น accessibility:
- Headless components
- ARIA support ครบถ้วน
- Keyboard navigation
- Focus management

### Corvu

UI primitives สำหรับ SolidJS ที่ unstyled:
- Unstyled primitives
- High customizability
- Accessible โดย default
- SSR support

## Tailwind CSS Integration

Zaidan UI ใช้ Tailwind CSS สำหรับ styling:
- Utility-first CSS
- Design tokens
- Theme customization
- Responsive design
