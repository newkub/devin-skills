---
name: follow-svelte
description: ตั้งค่า Vite + Svelte 5 Runes + TypeScript (client-side only)
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - follow-svelte-kit
  - follow-typescript
  - follow-unocss
  - follow-vite
  - refactor-skills
  - validate
---

## Goal

ตั้งค่าและพัฒนา Svelte 5 project ด้วย Runes, Vite และ TypeScript (client-side only)

## Scope

ใช้สำหรับ Svelte 5 projects ที่ใช้ Vite เป็น build tool (client-side only)
หมายเหตุ: ถ้าต้องการ fullstack meta-framework ให้ใช้ `/follow-svelte-kit` แทน

## Execute

### 1. Setup Project
> Goal: Setup Project

1. สร้าง `vite.config.ts` ด้วย `@sveltejs/vite-plugin-svelte`
2. สร้าง `svelte.config.js` ด้วย `vitePreprocess` และ `runes: true`
3. ตั้งค่า `tsconfig.json` ด้วย `moduleResolution: bundler`
4. เพิ่ม scripts ใน `package.json` (dev, build, preview)
5. ตั้งค่า server port และ build options
6. ใช้ Svelte 5.56+ (latest stable มีนาคม 2026)

### 2. Configure TypeScript
> Goal: Configure TypeScript

1. ตั้งค่า `target: ES2020` และ `module: ESNext`
2. ใช้ `moduleResolution: bundler`
3. ตั้งค่า `baseUrl` และ `paths` สำหรับ import aliases
4. เปิดใช้ `strict: true`
5. รองรับ TypeScript 6.0 (svelte-check 4.4.8+, svelte2tsx 0.7.55+)

### 3. Svelte 5 Runes
> Goal: Svelte 5 Runes

ใช้ Runes สำหรับ reactivity อย่างถูกต้อง

1. ใช้ `$state()` สำหรับ reactive state (deeply reactive by default)
2. ใช้ `$derived()` สำหรับ computed values (lazy evaluation)
3. ใช้ `$effect()` สำหรับ side effects เท่านั้น (DOM, network, analytics)
4. ใช้ `$props()` สำหรับ component props พร้อม destructuring
5. ใช้ `$bindable()` สำหรับ bindable props
6. ใช้ `$state` ใน plain `.ts` files แทน Svelte stores
7. ห้ามใช้ `$effect` สำหรับ sync state ใช้ `$derived` แทน
8. ใช้ `$effect.pre` สำหรับ effects ที่ต้องทำงานก่อน DOM updates

### 4. Snippets And Components
> Goal: Snippets And Components

ใช้ Snippets แทน Slots

1. ใช้ `{#snippet name()}` สำหรับ reusable markup
2. ใช้ `{@render children()}` สำหรับ render snippet content
3. ใช้ snippets แทน slots ของ Svelte 4
4. ใช้ `mount(Component, props)` แทน `new Component()`
5. อนุญาต declarations ใน markup ได้ (Svelte 5.56+)

### 5. Setup Styling
> Goal: Setup Styling

1. ทำ `/follow-unocss` สำหรับ styling
2. ใช้ UnoCSS ทั้งหมดถ้าเป็นไปได้
3. หลีกเลี่ยง style scoped

### 6. State Management Patterns
> Goal: State Management Patterns

1. ใช้ `$state` ใน classes สำหรับ business logic ที่ reusable
2. จัดกลุ่ม related state ใน cohesive objects (granular reactivity)
3. ใช้ Svelte stores (`writable`, `readable`, `derived`) สำหรับ RxJS-style subscriptions
4. Stores ยังรองรับและไม่ deprecated แต่ใช้ runes เป็น default
5. ใช้ `$state.snapshot()` สำหรับ get immutable snapshot

### 7. Event Handling
> Goal: Event Handling

1. ใช้ `onclick` แทน `on:click` (Svelte 5 syntax)
2. Event handlers เป็น properties เหมือน attributes อื่นๆ
3. ใช้ event attributes สำหรับ DOM elements

## Rules

### 1. Configuration

ตั้งค่า project ตามมาตรฐาน Svelte 5:

- ใช้ `@sveltejs/vite-plugin-svelte` สำหรับ Svelte transformation
- ใช้ `vitePreprocess` สำหรับ TypeScript preprocessing
- ตั้งค่า `runes: true` สำหรับ Svelte 5 Runes
- ตั้งค่า `moduleResolution: bundler` ใน TypeScript
- รองรับ TypeScript 6.0

### 2. Runes Best Practices

ใช้ Runes อย่างถูกต้อง:

- `$state` สำหรับ reactive values (explicit, opt-in)
- `$derived` สำหรับ computed values (lazy, composable)
- `$effect` สำหรับ side effects เท่านั้น (เป็น escape hatch)
- ห้ามใช้ `$effect` สำหรับ sync state ใช้ `$derived` แทน
- `$props` สำหรับ component props พร้อม destructuring
- ใช้ `$state` ใน `.ts` files แทน stores เมื่อเป็นไปได้

### 3. Component Development

พัฒนา components ตาม best practices:

- ใช้ `.svelte` พร้อม `lang="ts"` สำหรับทุก components
- ใช้ `$props()` สำหรับ typed props
- ใช้ snippets แทน slots
- ใช้ `onclick` แทน `on:click`
- ใช้ `mount()` แทน `new Component()`
- ใช้ UnoCSS สำหรับ styling

### 4. Migration From Svelte 4

Migration จาก Svelte 4:

- `let count = 0` → `let count = $state(0)`
- `$: doubled = count * 2` → `let doubled = $derived(count * 2)`
- `$: { console.log(count) }` → `$effect(() => { console.log(count) })`
- `export let prop` → `let { prop } = $props()`
- `on:click` → `onclick`
- Slots → Snippets (`{#snippet}` และ `{@render}`)
- ใช้ `npx sv migrate svelte-5` สำหรับ auto migration
- สามารถ mix old และ new syntax ได้ระหว่าง migration

### 5. Code Quality

รักษาคุณภาพโค้ด:

- ใช้ TypeScript strict mode
- ตั้งค่า path aliases อย่างถูกต้อง
- ใช้ svelte-check สำหรับ type checking
- ทำ `/refactor` เสมอเมื่อพัฒนา

## Expected Outcome

- Svelte 5 project ตั้งค่าครบถ้วนด้วย Vite และ Runes
- Reactivity ใช้ `$state`, `$derived`, `$effect` อย่างถูกต้อง
- Snippets แทน slots สำหรับ reusable markup
- TypeScript configuration ถูกต้อง
- UnoCSS integration สำเร็จ
- Component development ตาม Svelte 5 best practices
