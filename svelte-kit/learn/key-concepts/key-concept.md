# Key Concept

## What is SvelteKit?

SvelteKit เป็น full-stack framework สำหรับสร้าง web applications โดยใช้ Svelte มาพร้อม file-based routing, multiple rendering modes (SSR/CSR/Prerendering), Vite-powered dev experience และ built-in optimizations

## Core Features

| Feature | Description |
|---------|-------------|
| **File-based Routing** | ใช้ folder structure สำหรับ routes |
| **Multiple Rendering** | SSR, CSR, Prerendering ใน app เดียว |
| **Form Actions** | Server-side form handling แบบ progressive |
| **Data Loading** | +page.server.ts load functions |
| **Layouts** | Nested layouts สำหรับ shared UI |
| **Hooks** | Request hooks สำหรับ middleware |
| **Error Handling** | +error.svelte สำหรับ error pages |
| **Type Safety** | Full TypeScript support |

## Key Principles

- **Progressive Enhancement** - ทำงานได้แม้ JavaScript ปิด
- **Zero JS by Default** - ไม่ส่ง JS ถ้าไม่จำเป็น
- **File-based Magic** - routes มาจาก file structure
- **Server-First** - data fetching เกิดขึ้นที่ server
- **Type Safety** - TypeScript ทั้ง client และ server

## Routing Structure

```
src/routes/
├── +page.svelte          → /
├── +layout.svelte        → wraps all pages
├── about/
│   └── +page.svelte      → /about
├── blog/
│   ├── +page.svelte      → /blog
│   ├── +page.server.ts   → /blog data loading
│   └── [slug]/
│       ├── +page.svelte  → /blog/:slug
│       └── +page.server.ts → /blog/:slug data
└── (auth)/
    ├── +layout.svelte    → grouped layout
    ├── login/
    │   └── +page.svelte  → /login
    └── register/
        └── +page.svelte  → /register
```

## Rendering Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **SSR** | Render on server per request | Dynamic data, SEO |
| **CSR** | Render in browser | Interactive apps |
| **Prerendering** | Build-time HTML | Static content |
| **Streaming** | Progressive loading | Heavy data pages |

## When to Use

- Full-stack web applications
- API backends with SSR
- Static sites with dynamic features
- E-commerce platforms
- SaaS applications
- Blogs and content sites

## Comparison

| Feature | SvelteKit | Next.js | Nuxt |
|---------|-----------|---------|------|
| Framework | Svelte | React | Vue |
| Routing | File-based | File-based | File-based |
| Rendering | SSR/CSR/SSG | SSR/SSG/ISR | SSR/SSG/ISR |
| API | Form Actions | API Routes | Server Routes |
| Bundle | Small | Medium | Medium |
| Learning Curve | Low | Medium | Medium |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SvelteKit App                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐       │
│  │   Routes    │   │   Server    │   │   Client    │       │
│  │   +page.*   │   │   +server.* │   │   +page.ts  │       │
│  └─────────────┘   └─────────────┘   └─────────────┘       │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           ▼                                 │
│                  ┌─────────────────┐                        │
│                  │   Svelte        │                        │
│                  │   Components    │                        │
│                  └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```