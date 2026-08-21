---
name: follow-slidev
description: ตั้งค่าและพัฒนา presentation slides ด้วย Slidev framework
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
---

## Goal

สร้างและพัฒนา presentation slides ด้วย Slidev ใน drive D

## Scope

ใช้ Slidev ใน `D:/newkub/slides` ที่มี single `package.json` ที่ root — แต่ละ project มีแค่ `slides.md` ไม่ต้องสร้าง `package.json` ใหม่

## Execute

### 1. Verify Root Setup
> Goal: Verify Root Setup

1. ตรวจสอบว่า `D:/newkub/slides/package.json` มีอยู่แล้ว
2. ถ้าไม่มี ให้สร้าง `package.json` ที่ root พร้อม dependencies:
   - `@slidev/cli`
   - `@slidev/theme-seriph`
   - `@slidev/theme-default`
   - `vue`
3. รัน `bun install` ที่ root

### 2. Create Slide Project
> Goal: Create Slide Project

1. สร้าง directory `D:/newkub/slides/{project-name}/`
2. สร้าง `slides.md` พร้อม headmatter
3. ไม่ต้องสร้าง `package.json` — dependencies อยู่ที่ root แล้ว
4. ถ้าต้องการ สร้าง subdirectories: `components/`, `layouts/`, `public/`, `styles/`

### 3. Configure Slides
> Goal: Configure Slides

1. แก้ไข `slides.md` ตามเนื้อหาที่ต้องการ
2. ตั้งค่า headmatter (theme, title, info, etc.)
3. เขียน content ด้วย Markdown syntax ของ Slidev

### 4. Run Dev Server
> Goal: Run Dev Server

1. รัน `bunx slidev {project-name}/slides.md` ที่ root directory
2. dev server จะรันที่ port 3030 (default)
3. เปิด browser เพื่อดู slides แบบ real-time

### 5. Export Slides (Optional)
> Goal: Export Slides (Optional)

1. ใช้ `bunx slidev export {project-name}/slides.md` เพื่อ export เป็น PDF
2. ใช้ `bunx slidev build {project-name}/slides.md --out dist/{project-name}` เพื่อ build เป็น static site

## Rules

### 1. Project Location

- สร้าง project ใน `D:/newkub/slides` เท่านั้น
- มีเพียง `package.json` เดียวที่ root — ไม่สร้าง `package.json` ของแต่ละ project
- แต่ละ project = folder ที่มี `slides.md` และ optionally `components/`, `layouts/`, `public/`, `styles/`
- ใช้ Bun เป็น package manager ตาม global rules
- ใช้ Bun shell สำหรับ automation

### 2. Slidev CLI Usage

- ใช้ `bunx slidev {project}/slides.md` สำหรับรัน dev server ของ project นั้น
- ใช้ `bunx slidev export {project}/slides.md` สำหรับ export slides
- ใช้ `bunx slidev build {project}/slides.md --out dist/{project}` สำหรับ build static site
- รันคำสั่งที่ root directory `D:/newkub/slides` เสมอ

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
- ใช้ `preload: false` ใน frontmatter สำหรับเปิดใช้ motion (ก่อน v0.48.9)

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
- ใช้ `layout` สำหรับ custom layouts
- ใช้ Vue components ใน Markdown ได้

### 6. Development Workflow

- รัน `bunx slidev {project}/slides.md` ที่ root directory
- ติดตามและแก้ไข errors ทันที
- ตรวจสอบว่า dev server ทำงานได้
- Export slides เมื่อพร้อมแชร์

## Expected Outcome

- Slidev project สร้างใน `D:/newkub/slides/{project-name}/`
- ไม่มี `package.json` ของแต่ละ project — ใช้ root `package.json` อย่างเดียว
- Dev server ทำงานได้ที่ port 3030
- Slides แสดงผลได้ถูกต้องใน browser
- สามารถ export เป็น PDF หรือ build เป็น static site
