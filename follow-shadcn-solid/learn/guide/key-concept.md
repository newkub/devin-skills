# Key Concept

## แนวคิดหลักของ shadcn-solid

shadcn-solid เป็น port ของ shadcn/ui สำหรับ SolidJS โดยรักษา philosophy เดิมคือ copy-paste components แทนการติดตั้งเป็น package

## Core Concepts

| Concept | คำอธิบาย |
|---------|-----------|
| **shadcn/ui Pattern** | Component-based approach ที่ใช้ copy-paste components แทน bun package |
| **SolidJS** | Reactive JavaScript framework ที่ใช้ fine-grained reactivity |
| **Kobalte** | Unstyled accessible component library สำหรับ SolidJS |
| **Copy-Paste Workflow** | เลือก component แล้ว copy code ไปใช้ใน project |
| **Full Ownership** | เจ้าของ code ทั้งหมด สามารถแก้ไขได้ตามต้องการ |
| **Accessibility** | Built-in ARIA support จาก Kobalte primitives |
| **Customization** | Full control ผ่าน Tailwind CSS และ component props |

## ทำไมต้องใช้ shadcn-solid

| ประเด็น | คำอธิบาย |
|----------|-----------|
| **Developer Experience** | Copy-paste workflow ที่ง่ายและรวดเร็ว |
| **Full Control** | เจ้าของ code ทั้งหมด สามารถแก้ไขได้ตามต้องการ |
| **Type Safety** | Full TypeScript support พร้อม type definitions |
| **Accessibility** | Built-in accessibility จาก Kobalte |
| **Modern Stack** | ใช้ SolidJS + Kobalte + Tailwind CSS |
| **Consistency** | Design system ที่สม่ำเสมอทั่วทั้ง application |
| **No Bundle Bloat** | ใช้เฉพาะ components ที่ต้องการ |

## ความแตกต่างจาก shadcn/ui (React)

| Feature | shadcn/ui (React) | shadcn-solid (SolidJS) |
|---------|------------------|----------------------|
| Framework | React | SolidJS |
| Primitives | Radix UI | Kobalte |
| State Management | useState/hooks | createSignal |
| JSX | React JSX | SolidJS JSX |
| Reactivity | Virtual DOM | Fine-grained reactivity |
