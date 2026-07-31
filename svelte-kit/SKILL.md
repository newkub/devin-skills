---
name: svelte-kit
description: "Full-stack framework สำหรับสร้าง web applications ด้วย Svelte รองรับ file-based routing,..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

สร้าง Svelte applications ด้วย SSR/CSR/Prerendering และ file-based routing ตามมาตรฐาน SvelteKit


## Scope

ใช้สำหรับการพัฒนา Svelte applications ที่ต้องการ full-stack framework ด้วย Vite-powered HMR


## Execute

### 1. Create Project

สร้าง project ใหม่ด้วย `bun create svelte@latest`

```bash
bun create svelte@latest my-app
```

### 2. Setup Configuration

ตั้งค่า `svelte.config.js` และ environment variables

### 3. Develop Pages

ใช้ file-based routing ใน `src/routes/` directory

### 4. Implement Data Fetching

ใช้ `load` functions สำหรับ data fetching

### 5. Build and Deploy

Build สำหรับ SSR, CSR หรือ prerendering


## Rules

### Development

- ใช้ TypeScript สำหรับ type safety
- ใช้ Svelte components สำหรับ UI
- Follow SvelteKit conventions
- ใช้ `bun add` หรือ `bun add -D` สำหรับ dependencies

### Best Practices

- ใช้ proper caching strategies
- Optimize bundle size
- Implement proper error handling
- Follow progressive enhancement principles

### File Organization

- ใช้ file-based routing conventions
- แยก server และ client logic
- ใช้ layouts สำหรับ shared UI
- ใช้ error pages สำหรับ error handling


## Expected Outcome

- Svelte applications ด้วย SSR/CSR/Prerendering
- File-based routing และ Vite-powered HMR
- Full-stack framework capabilities
- Code ที่ maintainable และ scalable
