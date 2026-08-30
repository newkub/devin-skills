---
name: visualize-repo-in-web
description: สร้าง web graph visualize repo ด้วย Rust สแกน + SolidJS แสดงผล พร้อม src
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - visualize-devin-in-web
  - visualize-project
  - follow-framework-solidjs
  - follow-create-rust-crate
  - follow-tool-vite
  - use-lib-effective
  - review-frontend
  - resolve-errors
  - open-web
  - ship
  - ship
  - ship
  - suggest-next-action
---

## Goal

สร้าง web application แสดง repository เป็น interactive graph โดยใช้ Rust วิเคราะห์โครงสร้าง repo และ SolidJS render บน browser

## Scope

ใช้กับ repo ทั่วไป เช่น project ทีมี `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml` หรือ `requirements.txt` รองรับการสแกน modules, files, dependencies และแสดงเป้น graph

## Execute

### 1. Setup Rust Scanner

> Goal: สร้าง Rust crate สำหรับวิเคราะห์ repo

1. สร้าง directory `src/rust/repo-graph/` ภายใน skill workspace หรือ OS temp
2. รัน `cargo init --name repo-graph` ใน `src/rust/repo-graph/`
3. เพิ่ม dependencies `serde`, `serde_json`, `walkdir` ด้วย `cargo add`
4. สร้าง `src/main.rs` รับ `<repo-path>` เป้น argument และสแกน tree
5. สร้าง `src/graph.rs` สำหรับ build nodes และ edges
6. ทดสอบด้วย `cargo run -- <repo-path>` ให้ได้ `repo-graph.json`

### 2. Analyze Repo Structure

> Goal: รวบรวม nodes และ edges จาก repo

1. `glob` หา files ทีจำเป็น เช่น `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`
2. `read` manifests เพื่อหา dependencies และ workspace members
3. `grep` imports / exports หรือ `mod` declarations เพื่อหา file relations
4. สร้าง nodes: `directory`, `file`, `module`, `dependency`, `workspace`
5. สร้าง edges จาก imports, parent-child, dependency links
6. บันทึก `repo-graph.json` ใน `src/web/public/` หรือ `src/web/src/data/`

### 3. Choose Graph Library

> Goal: เลือก library สำหรับ render graph

1. ทำ `/use-lib-effective` ประเมิน `cytoscape`, `vis-network`, `force-graph`, `d3`
2. สำหรับ SolidJS แนะนำ `cytoscape` หรือ `force-graph` ผ่าน npm
3. ติดตั้งด้วย `bun add cytoscape` หรือ `bun add force-graph` ใน web project
4. เลือก library ที่รองรับ zoom, pan, drag, tooltip โดยไม่เขียน engine เอง

### 4. Generate Solid Frontend

> Goal: สร้าง web app ด้วย SolidJS

1. ทำ `/follow-tool-vite` สร้าง Vite project ด้วย `bun create vite@latest repo-graph-web --template solid-ts`
2. ติดตั้ง `solid-js`, `vite`, `vite-plugin-solid`, `unocss`, `@unocss/preset-wind`
3. สร้าง `src/App.tsx` ด้วย `createSignal`, `<For>`, `<Show>`
4. สร้าง `src/components/GraphView.tsx` โหลด `repo-graph.json` และ render graph
5. เพิ่ม controls: search, filter by type, zoom reset, dark mode toggle

### 5. Wire Rust Output To Solid

> Goal: ให้ Solid app ใช้ data จาก Rust scanner

1. รัน Rust scanner ให้ได้ `repo-graph.json`
2. คัดลอก `repo-graph.json` ไปยัง `src/web/public/repo-graph.json`
3. ใน Solid ใช้ `fetch('/repo-graph.json')` หรือ `import data from '../data/repo-graph.json'`
4. แสดง graph พร้อม node labels, tooltips, side panel

### 6. Build And Serve

> Goal: รันและตรวจสอบ web app

1. ใน web project รัน `bun install` แล้ว `bun run dev`
2. ตรวจว่า graph แสดงถูกต้อง
3. ทำ `/open-web` เพื่อเปิด browser
4. ถ้า error → ทำ `/resolve-errors`

### 7. Ship

> Goal: ส่งมอบ project

1. ถ้า user ต้องการ keep project → ทำ `/ship`
2. รายงานจำนวน nodes, edges, ประเภททีพบ
3. ทำ `/suggest-next-action`

## Rules

### 1. Src Directory

- skill มี `src/` directory เป้น scaffold สำหรับ Rust crate และ Solid web app
- ไฟล์ scaffold ต้อง build ผ่าน `cargo build` และ `bun run build`
- ไม่เกิน 250 บรรทัดต่อไฟล์

### 2. Graph UX

- ใช้สีแยกตามประเภท node: directory, file, module, dependency, workspace
- รองรับ zoom, pan, search, filter
- แสดง tooltip ด้วย metadata
- ไม่เขียน graph engine เอง

### 3. Multi Ecosystem

- รองรับหลาย package manifest: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`
- ใช้ commands ตาม ecosystem เช่น `cargo run` สำหรับ Rust, `bun install` สำหรับ JS/TS

## Expected Outcome

- Rust scanner สร้าง `repo-graph.json` จาก repo ทีระบุ
- SolidJS web app render graph บน browser พร้อม interaction
- `src/` directory มี scaffold สำหรับ Rust crate และ Solid web app
- รองรับหลาย ecosystems และ repo layouts
- สามารถ ship หรือ run ใน browser ได้
