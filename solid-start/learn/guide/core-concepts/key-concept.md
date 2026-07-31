# Key Concept - SolidStart

SolidStart เป็น meta-framework สำหรับ SolidJS ที่ออกแบบมาเพื่อให้สามารถสร้าง web applications ได้อย่างยืดหยุ่นด้วย rendering modes ที่หลากหลาย

## หลักการพื้นฐาน

| Concept | คำอธิบาย |
|---------|-----------|
| **Meta-Framework** | Framework ที่สร้างขึ้นบน framework อื่น (SolidJS) เพื่อให้ความสามารถเพิ่มเติมในการสร้าง full-stack applications |
| **Vinxi** | Framework Bundler ที่รวมพลังของ Vite และ Nitro ใช้สำหรับ development server และ production builds |
| **Isomorphic Code** | Code ที่เขียนครั้งเดียวและสามารถทำงานได้ทั้งบน client และ server |
| **File-Based Routing** | การกำหนด routes โดยใช้โครงสร้างไฟล์และโฟลเดอร์ |

## Rendering Modes

SolidStart รองรับ 3 แบบของ rendering:

| Mode | คำอธิบาย | ใช้เมื่อ |
|------|-----------|---------|
| **CSR** (Client-Side Rendering) | Render ทั้งหมดบน browser | Interactive applications ที่ต้องการ dynamic content |
| **SSR** (Server-Side Rendering) | Render บน server และส่ง HTML ไปยัง client | SEO และ first paint performance |
| **SSG** (Static Site Generation) | Pre-render ทุกหน้าเป็น static files ที่ build time | Blogs, documentation, content-heavy sites |

## Unopinionated Design

SolidStart ไม่บังคับให้ใช้ tools ใดๆ โดยเฉพาะ:

- ไม่มี Router ในตัว (สามารถใช้ @solidjs/router หรือ router อื่นๆ)
- ไม่มี Metadata library ในตัว
- สามารถแทนที่ components ต่างๆ ด้วย implementation ของตัวเองได้

## Key Benefits

| Benefit | คำอธิบาย |
|---------|-----------|
| **Performance** | ใช้ SolidJS ที่มี fine-grained reactivity ที่เร็วและมีประสิทธิภาพสูง |
| **Flexibility** | สามารถเลือก rendering mode ตาม use case ได้ |
| **Simplicity** | ให้เพียง minimum pieces ที่จำเป็นเพื่อเริ่มต้น |
| **Extensibility** | สามารถ custom และ extend ได้ง่าย |
