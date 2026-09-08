---
name: follow-create-slide-slidev
description: สร้างและพัฒนา Slidev slides ทั้ง standalone project และใน D:/newkub/slides monorepo
argument-hint: "[scope]"
related:
  - create-slide-in-newkub-slides
  - run-dev
  - ship
  - follow-create-web-astro
  - follow-create-mobile-cross-capacitor
  - follow-best-practice
  - setup-cicd
  - follow-my-tech-stack
---

## Goal

สร้างและพัฒนา presentation slides ด้วย Slidev ทั้งแบบ standalone project (พร้อม `package.json` ของตัวเอง) และใน `D:/newkub/slides` monorepo

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: follow-framework-slidev, create-slide-via-slidev)

- Standalone project: สร้างด้วย `bun create slidev` ในตำแหน่งที่ผู้ใช้กำหนด มี `package.json` ของตัวเอง
- Newkub slides: ใช้ `D:/newkub/slides` ที่มี single `package.json` ที่ root — แต่ละ project มีแค่ `slides.md` ไม่ต้องสร้าง `package.json` ใหม่
- ถ้าต้องการ flow เฉพาะ `D:/newkub/slides` → ใช้ `/create-slide-in-newkub-slides`

## Execute

### 1. Choose Project Mode

> Goal: เลือก mode ตามตำแหน่ง project

1. รับชื่อ project และตำแหน่งจากผู้ใช้ — ถ้าไม่ระบุตำแหน่ง → ใช้ current directory
2. ถ้าสร้างใน `D:/newkub/slides` → ทำข้อ 2-5 (shared root `package.json`)
3. ถ้าสร้าง standalone นอก `D:/newkub/slides` → ทำตาม [references/standalone-project.md](references/standalone-project.md) แล้วข้ามไปข้อ 3-5

### 2. Verify Root Setup (newkub mode)

> Goal: Verify Root Setup

1. ตรวจสอบว่า `D:/newkub/slides/package.json` มีอยู่แล้ว
2. ถ้าไม่มี ให้สร้าง `package.json` ที่ root พร้อม dependencies:
   - `@slidev/cli`
   - `@slidev/theme-seriph`
   - `@slidev/theme-default`
   - `vue`
3. รัน `bun install` ที่ root

### 3. Create Slide Project

> Goal: Create Slide Project

1. Newkub mode: สร้าง directory `D:/newkub/slides/{project-name}/` พร้อม `slides.md` — ไม่สร้าง `package.json`
2. Standalone mode: รัน `bun create slidev@latest {project-name}` แล้ว `bun install` (ดู [references/standalone-project.md](references/standalone-project.md))
3. ถ้าต้องการ สร้าง subdirectories: `components/`, `layouts/`, `public/`, `styles/`

### 4. Configure Slides

> Goal: Configure Slides

1. แก้ไข `slides.md` ตามเนื้อหาที่ต้องการ
2. ตั้งค่า headmatter (theme, title, info, etc.)
3. เขียน content ด้วย Markdown syntax ของ Slidev
4. หน้าแรกใช้ `layout: cover`, หน้าสุดท้ายใช้ `layout: end`, แต่ละ slide หนึ่ง concept

### 5. Run Dev Server

> Goal: Run Dev Server

1. Newkub mode: รัน `bunx slidev {project-name}/slides.md` ที่ root directory
2. Standalone mode: รัน `bunx slidev` ใน project directory (ทำ `/run-dev`)
3. dev server จะรันที่ port 3030 (default)
4. เปิด browser เพื่อดู slides แบบ real-time

### 6. Export Slides (Optional)

> Goal: Export Slides (Optional)

1. ใช้ `bunx slidev export {project-name}/slides.md` เพื่อ export เป็น PDF
2. ใช้ `bunx slidev build {project-name}/slides.md --out dist/{project-name}` เพื่อ build เป็น static site
3. Standalone mode ใช้ `bunx slidev build` / `bunx slidev export` ใน project directory

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Project Location

- Standalone project สร้างในตำแหน่งที่ผู้ใช้กำหนด และมี `package.json` ของตัวเอง
- Newkub mode สร้าง project ใน `D:/newkub/slides` เท่านั้น
- Newkub mode มีเพียง `package.json` เดียวที่ root — ไม่สร้าง `package.json` ของแต่ละ project
- แต่ละ project = folder ที่มี `slides.md` และ optionally `components/`, `layouts/`, `public/`, `styles/`
- ใช้ Bun เป็น package manager ตาม global rules
- ใช้ Bun shell สำหรับ automation

### 2. Slidev CLI Usage

- ใช้ `bun create slidev@latest {project-name}` สำหรับ scaffold standalone project
- ใช้ `bunx slidev {project}/slides.md` สำหรับรัน dev server ของ newkub project นั้น
- ใช้ `bunx slidev` สำหรับ dev server ใน standalone project
- ใช้ `bunx slidev export` สำหรับ export PDF
- ใช้ `bunx slidev build` สำหรับ build static site
- Newkub mode รันคำสั่งที่ root directory `D:/newkub/slides` เสมอ

### 3. Headmatter Configuration

- ตั้งค่า `theme` ตามที่ต้องการ (seriph, default, etc.)
- ตั้งค่า `title` และ `info` ให้ชัดเจน
- ใช้ `transition` สำหรับ slide transitions (slide-left, slide-right, fade-out, fade-in, slide-up, slide-down)
- เปิดใช้ `mdc: true` สำหรับ MDC syntax
- ถ้าเป็นภาษาไทย ใช้ font `Noto Sans Thai` ด้วย `fonts` config ใน headmatter:
  ```yaml
  fonts:
    sans: 'Noto Sans Thai'
    serif: 'Noto Sans Thai'
    mono: 'Noto Sans Thai'
  ```
- หรือเพิ่ม Google Fonts ใน `styles/index.css`:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700&display=swap');
  body { font-family: 'Noto Sans Thai', sans-serif; }
  ```

### 4. Animation Transitions

#### Click Animations

- ใช้ `v-click` สำหรับ basic click animations
- ใช้ `v-after` สำหรับ show เมื่อ previous v-click triggered
- ใช้ `v-click.hide` หรือ `v-after.hide` สำหรับ hide after clicking
- ใช้ `v-clicks` component สำหรับ apply v-click ทั้งหมดใน children (รองรับ `depth`, `every` props)
- ใช้ `at` prop สำหรับ positioning (relative '+1', '-1' หรือ absolute 1, 2)
- ใช้ array value `[2, 4]` สำหรับ enter/leave indices
- ใช้ `v-switch` สำหรับ switch content ตาม click count
- ใช้ `clicks` frontmatter สำหรับ custom total clicks count
- ใช้ `clickAnimation` frontmatter สำหรับ default animation preset
- ใช้ directive modifiers เช่น `v-click.scale`, `v-click.fade.right`, `v-click.none`
- Built-in presets: fade, fade-in, up, down, left, right, scale, none
- สร้าง custom presets ด้วย CSS rules สำหรับ `.slidev-vclick-anim-{presetName}`

#### Motion Animations

- ใช้ `v-motion` สำหรับ motion effects (powered by @vueuse/motion)
- กำหนด states: `initial`, `enter`, `leave`, `click-N`, `click-N-M`
- ใช้ร่วมกับ `v-click` บน element เดียวกันเพื่อ trigger motion ตาม click states
- ใช้ `preload: false` ใน frontmatter ถ้าต้องการ control lazy loading ของ slide elements

#### Slide Transitions

- ใช้ `transition` ใน frontmatter สำหรับ slide transitions
- Built-in transitions: fade, fade-out, slide-left, slide-right, slide-up, slide-down, view-transition
- ใช้ `view-transition-name` CSS property สำหรับ View Transitions API
- สร้าง custom transitions ด้วย CSS classes (`.my-transition-enter-active`, `.my-transition-leave-to`)
- ใช้ `|` separator สำหรับ forward/backward transitions (เช่น `go-forward | go-backward`)
- ใช้ object format สำหรับ advanced options (name, enterFromClass, enterActiveClass, duration)

### 5. Markdown Syntax

- ใช้ `---` สำหรับแบ่ง slides
- ใช้ `v-click` สำหรับ click animations
- ใช้ `layout` สำหรับ custom layouts (`default`, `two-cols`, `center`, `fact`, `section`, `quote`)
- ใช้ Vue components ใน Markdown ได้
- ไม่เกิน 5 bullet points ต่อ slide

### 6. Development Workflow

- รัน dev server ที่ root directory (newkub) หรือ project directory (standalone)
- ติดตามและแก้ไข errors ทันที
- ตรวจสอบว่า dev server ทำงานได้
- Export slides เมื่อพร้อมแชร์

- ใช้ /create-slide-in-newkub-slides ถ้าจำเป็น
- ใช้ /follow-create-web-astro ถ้าจำเป็น
- ใช้ /follow-create-mobile-cross-capacitor ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /follow-my-tech-stack ถ้าจำเป็น

## Expected Outcome

- Slidev project สร้างสำเร็จตาม mode ที่เลือก (standalone หรือ `D:/newkub/slides/{project-name}/`)
- Newkub mode ไม่มี `package.json` ของแต่ละ project — ใช้ root `package.json` อย่างเดียว
- `slides.md` มี headmatter และ content ครบถ้วน
- Dev server ทำงานได้ที่ port 3030
- Slides แสดงผลได้ถูกต้องใน browser
- สามารถ export เป็น PDF หรือ build เป็น static site
