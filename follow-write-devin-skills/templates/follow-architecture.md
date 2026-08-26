# follow-*-architecture Template

architecture patterns (override follow template)

## Execute Pattern

- อ่าน manifest ระบุ framework และ `follow-*` skills ที่เกี่ยวข้อง. ถ้าไม่พบ framework → stop. `related` ต้องมี `follow-*` skills ของ tech stack รวม `/follow-tool-vite` และ `/follow-tool-vitest` เสมอ
- Module structure: `src/modules/<feature>/` พร้อม `components/`, `hooks/`, `schemas/`, `utils/`, `types/`, `index.ts`. แต่ละ module มี `index.ts` เป็น public API. เก็บ internal code private. ไม่มี circular dependencies
- กำหนด routing conventions, server functions/API patterns, rendering modes (SSR, CSR, SSG), state management, component organization. กำหนด routing rules, module boundary rules, import/export rules (`/review-architecture`), monorepo rules, configuration rules
- ทำ `/restructure`, `/refactor-packages` ถ้าจำเป็น. รัน typecheck, lint. ทำ `/suggest-next-action`. Generality: ไม่ผูกกับชื่อ project. ใช้ `@<scope>/shared`. รองรับ standalone และ monorepo. อย่า share route tree ข้าม package boundary. share components, hooks, schemas, utils แทน
