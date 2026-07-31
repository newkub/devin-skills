---
title: CLI Reference
description: CLI commands สำหรับ SolidJS development
---

# CLI Reference

คำสั่ง CLI สำหรับการพัฒนา SolidJS applications

## create-solid

Official CLI tool สำหรับสร้าง SolidJS projects

### Installation

```bash
bunx create-solid@latest
```

### Create New Project

```bash
# Interactive mode
bunx create-solid@latest my-app

# With options
bunx create-solid@latest my-app --ts --solid-start
```

### Options

| Option | Description |
|--------|-------------|
| `--ts` | Use TypeScript |
| `--js` | Use JavaScript |
| `--solid-start` | Include SolidStart (SSR) |
| `--no-solid-start` | Exclude SolidStart |
| `--no-install` | Skip package installation |

### Templates

| Template | Description |
|----------|-------------|
| `ts` | TypeScript template |
| `js` | JavaScript template |
| `bare` | Minimal template |

## Vite Commands

สำหรับ projects ที่สร้างด้วย Vite

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server |
| `bun run build` | Build production |
| `bun run preview` | Preview build |

### Vite Options

| Flag | Description |
|------|-------------|
| `--port` | Set port (default: 3000) |
| `--host` | Set host (default: localhost) |
| `--open` | Open browser automatically |
| `--https` | Use HTTPS |

## SolidStart Commands

สำหรับ SolidStart projects

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server |
| `bun run build` | Build production |
| `bun run start` | Start production server |

### SolidStart Options

| Flag | Description |
|------|-------------|
| `--port` | Set port |
| `--host` | Set host |
| `--ssr` | Enable SSR |
| `--stream` | Enable streaming |

## Legacy Templates (degit)

สำหรับ projects เก่าที่ใช้ degit

```bash
# TypeScript
bunx degit solidjs/templates/ts my-app

# JavaScript
bunx degit solidjs/templates/js my-app
```

**หมายเหตุ:** แนะนำให้ใช้ `create-solid` แทน degit

