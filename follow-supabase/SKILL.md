---
name: follow-supabase
description: Open source Firebase alternative สำหรับ build backend ด้วย PostgreSQL, Auth, Edge Functions, และ...
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ใช้งาน Supabase สำหรับ build backend ด้วย PostgreSQL, Auth, Edge Functions, และ Realtime


## Scope

ใช้สำหรับ:
- Build backend ด้วย PostgreSQL, Auth, Edge Functions, Realtime
- Database management ด้วย PostgreSQL
- Authentication และ authorization
- Realtime subscriptions
- Edge functions ด้วย Deno


## Execute

### 1. CLI Commands

อ่าน `references/cli.md` สำหรับ CLI commands

### 2. Configuration

อ่าน `references/configuration.md` สำหรับ configuration reference

### 3. API Reference

อ่าน `references/api.md` สำหรับ Client SDK API reference

### 4. Resources

อ่าน `references/website.md` สำหรับ official links และ resources


## Rules

- ใช้ `bunx supabase init` สำหรับ initialize project
- ใช้ `bunx supabase start` สำหรับ start local development
- ใช้ `bunx supabase gen types` สำหรับ generate types
- ใช้ migrations สำหรับ database schema


## Expected Outcome

- Backend ที่ built ด้วย Supabase
- PostgreSQL database ที่ managed
- Authentication ที่ integrated
- Realtime subscriptions ที่ enabled
