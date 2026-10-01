# Vue — Best Practices

Composition API, reactivity และ component discipline สำหรับ Vue 3

## Recommended Patterns

- Composition API + `<script setup>` เป็น default — Options API เฉพาะ legacy codebase
- `ref()` สำหรับ primitives/scalars, `reactive()` สำหรับ objects ที่ไม่ reassign — เข้าใจ `.value` vs unwrap ใน template
- `computed()` สำหรับ derived state — cached ตาม deps; อย่าใช้ methods สำหรับ pure derivations
- `defineProps`/`defineEmits` typed (TS generics) — `withDefaults` สำหรับ defaults
- `watch` เฉพาะเมื่อต้อง side effect ตาม dep changes; `watchEffect` เมื่อ auto-track deps พอ
- Composables (`use*`) สำหรับ shared stateful logic — return refs ไม่ใช่ raw values

## Common Pitfalls

- `reactive()` destructure = reactivity หาย — ใช้ `toRefs`/`toRef` เมื่อต้อง extract
- `v-if` vs `v-show`: `v-if` unmount จริง (state หาย), `v-show` toggle display — เลือกตาม intent
- Async components + Suspense boundaries — อย่า assume component mount ทันที
- `provide`/`inject` สำหรับ deep trees — แต่ระวัง implicit contract; Pinia สำหรับ shared state จริงจัง
- Template refs: `ref` บน DOM element vs `defineExpose` — component refs ไม่ expose internals ดิบ

## Perf Notes

- `v-memo`/`v-once` สำหรับ static subtrees — skip diffing
- `shallowRef`/`shallowReactive` เมื่อ deep tracking ไม่จำเป็น (large objects, 3rd-party instances)
- `keep-alive` สำหรับ expensive components ที่ toggle บ่อย

## Do / Don't

| Do | Don't |
|----|-------|
| `<script setup>` + typed props/emits | Options API ใน code ใหม่ |
| `computed` derived state | methods re-compute ทุก render |
| `toRefs` เมื่อ destructure reactive | destructure `reactive()` ตรงๆ |
| composables `use*` shared logic | mixins / global mutable imports |
