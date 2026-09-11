# CLI

## TanStack CLI (project scaffolding)

Unified CLI สำหรับสร้าง Start/Router apps (`@tanstack/cli`, docs: `https://tanstack.com/cli/latest`)

### Create Project

```bash
# สร้าง TanStack Start app (default: SSR + file-based router)
bunx @tanstack/cli@latest create my-app

# Minimal one-route Start project ไม่มี starter UI/examples
bunx @tanstack/cli create my-app --blank -y

# Router-only SPA (ไม่มี SSR)
bunx @tanstack/cli create my-app --router-only -y

# เลือก add-ons เช่น auth, db, deployment
bunx @tanstack/cli create my-app --add-ons clerk,drizzle,tanstack-query
```

Options หลัก: `--framework` (`React`/`Solid`), `--package-manager` (`npm`/`pnpm`/`yarn`/`bun`/`deno`), `--deployment`, `--toolchain`, `--intent` (skill mappings สำหรับ coding agents), `--no-git`, `--no-install`, `-y/--yes`, `--force`, `--list-add-ons`, `--json`

## TanStack Router CLI

สำหรับ file-based routing — ปกติ route tree (`routeTree.gen.ts`) ถูก generate อัตโนมัติโดย `@tanstack/router-plugin` (Vite/Rsbuild plugin) ไม่ต้องรัน CLI เอง; ใช้ CLI เมื่อไม่ได้ใช้ plugin:

```bash
# Generate route tree ครั้งเดียว
bunx tsr generate

# Watch mode
bunx tsr watch
```

package: `@tanstack/router-cli` (binary: `tsr`)

## Dev / Build

```bash
# dev server และ build ผ่าน build tool ของ project
bun run dev
bun run build
```
