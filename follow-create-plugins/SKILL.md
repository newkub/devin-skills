---
name: follow-create-plugins
description: สร้าง plugin/extension/addon สำหรับ tool ใดก็ได้ผ่าน subskills แยกตาม target
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

- รวม capability ของทุก `follow-create-*plugin*`/`create-*-plugins` skill เดิม — subskill ละ target
- argument คือ target name (เช่น `vite`, `eslint`, `nvim`, `raycast`, `obsidian`, `bun`, `vscode`)
- ถ้าไม่ระบุ target → `/ask-me` เลือก target จากตาราง

## Execute

### Subskills

| Target | Subskill |
|---|---|
| `biome` | `subskills/biome/SKILL.md` — Biome plugin (GritQL rules, diagnostics) |
| `browser-wxt`, `wxt`, `browser` | `subskills/browser-wxt/SKILL.md` — browser extension ด้วย WXT |
| `bun` | `subskills/bun/SKILL.md` — Bun plugin (`Bun.plugin`, preload, bundler) |
| `claude` | `subskills/claude/SKILL.md` — Claude Code plugin (commands, hooks, agents) |
| `codex` | `subskills/codex/SKILL.md` — Codex CLI plugin |
| `devin` | `subskills/devin/SKILL.md` — Devin plugin/integration |
| `elysia` | `subskills/elysia/SKILL.md` — Elysia plugin (lifecycle hooks, decorators) |
| `eslint` | `subskills/eslint/SKILL.md` — ESLint plugin (rules, configs) |
| `nitro` | `subskills/nitro/SKILL.md` — Nitro plugin |
| `nushell`, `nu` | `subskills/nushell/SKILL.md` — Nushell plugin |
| `nvim`, `neovim` | `subskills/nvim/SKILL.md` — Neovim plugin (Lua) |
| `obsidian` | `subskills/obsidian/SKILL.md` — Obsidian plugin (TypeScript API) |
| `oxlint` | `subskills/oxlint/SKILL.md` — Oxlint plugin |
| `powershell-module`, `ps`, `pwsh` | `subskills/powershell-module/SKILL.md` — PowerShell module |
| `raycast` | `subskills/raycast/SKILL.md` — Raycast extension (React + TypeScript) |
| `rolldown` | `subskills/rolldown/SKILL.md` — Rolldown plugin |
| `storybook-addon`, `storybook` | `subskills/storybook-addon/SKILL.md` — Storybook addon |
| `tauri` | `subskills/tauri/SKILL.md` — Tauri plugin (Rust + JS API) |
| `tsdown` | `subskills/tsdown/SKILL.md` — tsdown plugin/hooks |
| `tui-ratatui` | `subskills/tui-ratatui/SKILL.md` — Ratatui widget/plugin |
| `vite` | `subskills/vite/SKILL.md` — Vite plugin (hooks, transform, HMR) |
| `vitest` | `subskills/vitest/SKILL.md` — Vitest plugin (reporters, environment) |
| `vscode`, `vs-code` | `subskills/vscode/SKILL.md` — VS Code extension |
| `zed` | `subskills/zed/SKILL.md` — Zed extension |

1. ระบุ target จาก argument (เช่น `/follow-create-plugins vite`)
2. ถ้า target รองรับ → ทำตาม `subskills/<target>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก target → `/ask-me` เลือก target จากตาราง

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill ในไฟล์นี้
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
