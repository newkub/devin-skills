# Vue Design System Best Practices

- ทุก components ต้อง import `useComponentMeta.ts`
- ทุก components ต้อง import `useTheme.config.ts`
- ใน components, router ใช้จาก Nuxt เลย ไม่ต้องใช้ Vue Router
- สร้าง stores ให้เหมาะสมว่าควรใช้อะไร และควรใช้ components หรือ composables
- ทุก components เขียน `<script setup lang="ts">` และให้ script อยู่ด้านบน template
- composables เขียนให้ดีตาม Vue best practices และ Nuxt best practices
- ใน composables ถ้ามี data fetching ใช้ `useFetch`, `useAsyncData` ให้เหมาะสม
- ใน components => ควร refactor อะไรไปใน composables บ้าง
- composables => ควร refactor อะไรไปใน utils บ้าง
