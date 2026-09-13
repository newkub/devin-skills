---
name: follow-create-plugins
description: สร้าง plugin/extension/addon สำหรับ tool ใดก็ได้ผ่าน follow-create-* skills แยกตาม target
argument-hint: "[target] [spec]"
related:
  - follow-create-sdk
  - follow-create-web
  - follow-create-cli
  - follow-create-mcp
  - review-dependencies
  - update-devin-global-skills
  - follow-best-practice
  - implement-features-to-mvp
  - ask-me
---

## Goal

สร้าง plugin/extension/addon สำหรับ target ที่ระบุ — parent skill นี้ทำหน้าที่ dispatch เท่านั้น ไม่ implement workflow เฉพาะ target

## Scope

- รวม capability ของทุก `follow-create-*plugin*`/`create-*-plugins` skill เดิม — skill ละ target
- argument คือ target name (เช่น `vite`, `eslint`, `nvim`, `raycast`, `obsidian`, `bun`, `vscode`)
- ถ้าไม่ระบุ target → `/ask-me` เลือก target จากตาราง

## Execute

### Target Skills

| Target | Skill |
|---|---|
| `biome` | `/follow-create-biome-plugin` — Biome plugin (GritQL rules, diagnostics) |
| `browser-wxt`, `wxt`, `browser` | `/follow-create-browser-extensions-wxt` — browser extension ด้วย WXT |
| `bun` | `/follow-create-bun-plugin` — Bun plugin (`Bun.plugin`, preload, bundler) |
| `claude` | `/follow-create-claude-plugin` — Claude Code plugin (commands, hooks, agents) |
| `codex` | `/follow-create-codex-plugin` — Codex CLI plugin |
| `devin` | `/follow-create-devin-plugin` — Devin plugin/integration |
| `elysia` | `/follow-create-elysia-plugin` — Elysia plugin (lifecycle hooks, decorators) |
| `eslint` | `/follow-create-eslint-plugin` — ESLint plugin (rules, configs) |
| `nitro` | `/follow-create-nitro-plugin` — Nitro plugin |
| `nushell`, `nu` | `/follow-create-nushell-plugin` — Nushell plugin |
| `nvim`, `neovim` | `/follow-create-nvim-plugin` — Neovim plugin (Lua) |
| `obsidian` | `/follow-create-obsidian-plugin` — Obsidian plugin (TypeScript API) |
| `oxlint` | `/follow-create-oxlint-plugin` — Oxlint plugin |
| `powershell-module`, `ps`, `pwsh` | `/follow-create-powershell-module` — PowerShell module |
| `raycast` | `/follow-create-raycast-extensions` — Raycast extension (React + TypeScript) |
| `rolldown` | `/follow-create-rolldown-plugin` — Rolldown plugin |
| `storybook-addon`, `storybook` | `/follow-create-storybook-addon` — Storybook addon |
| `tauri` | `/follow-create-tauri-plugin` — Tauri plugin (Rust + JS API) |
| `tsdown` | `/follow-create-tsdown-plugin` — tsdown plugin/hooks |
| `tui-ratatui` | `/follow-create-tui-ratatui` — Ratatui widget/plugin |
| `vite` | `/follow-create-vite-plugin` — Vite plugin (hooks, transform, HMR) |
| `vitest` | `/follow-create-vitest-plugin` — Vitest plugin (reporters, environment) |
| `vscode`, `vs-code` | `/follow-create-vscode-extensions` — VS Code extension |
| `zed` | `/follow-create-zed-extensions` — Zed extension |

1. ระบุ target จาก argument (เช่น `/follow-create-plugins vite`)
2. ถ้า target รองรับ → เรียก skill ตามตารางแล้วทำตาม flow ของ skill นั้น
3. ถ้าไม่ระบุหรือไม่รู้จัก target → `/ask-me` เลือก target จากตาราง

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ target skill ในไฟล์นี้
- เลือก library/tooling ตาม `/review-dependencies` (techstack catalog) ก่อนเสมอ
- scaffold เสร็จ → `/implement-features-to-mvp` ตาม convention

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-create-cli ถ้าจำเป็น
- ใช้ /follow-create-mcp ถ้าจำเป็น
- ใช้ /update-devin-global-skills ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง target แล้วสร้าง plugin ตาม flow นั้น
