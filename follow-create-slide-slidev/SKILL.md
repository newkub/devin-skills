---
name: follow-create-slide-slidev
description: สร้างและพัฒนา Slidev slides ทั้ง standalone project และใน D:/newkub/slides monorepo — ครอบคลุม syntax, animations, code features, layouts, export (sync กับ slidevjs/slidev `skills/`)
argument-hint: "[scope]"
related:
  - create-slide-in-newkub-slides
  - run-dev
  - ship-to-dev-branch
  - follow-create-web
  - follow-create-mobile
  - follow-best-practice
  - setup-cicd
  - deep-review

---

## Goal

สร้างและพัฒนา presentation slides ด้วย Slidev (Vite + Vue + Markdown) ทั้งแบบ standalone project (พร้อม `package.json` ของตัวเอง) และใน `D:/newkub/slides` monorepo — technical talks, code walkthroughs, teaching materials, interactive demos, math/diagrams, presenter recording, export PDF/PPTX/SPA

## Scope

- Standalone project: สร้างด้วย `bun create slidev` ในตำแหน่งที่ผู้ใช้กำหนด มี `package.json` ของตัวเอง
- Newkub slides: ใช้ `D:/newkub/slides` ที่มี single `package.json` ที่ root — แต่ละ project มีแค่ `slides.md` ไม่ต้องสร้าง `package.json` ใหม่
- ถ้าต้องการ flow เฉพาะ `D:/newkub/slides` → ใช้ `/create-slide-in-newkub-slides`
- Canonical upstream reference: `skills/slidev/SKILL.md` ใน https://github.com/slidevjs/slidev (generated จาก docs v52.11.3) — skill นี้ merge feature tables เข้า SKILL.md ไฟล์เดียว ไม่มี `references/`

- Packages: `@slidev/cli`, `@slidev/theme-seriph`/`@slidev/theme-default`, `vue`, `playwright-chromium` (สำหรับ `slidev export`) — ยืนยันเวอร์ชันล่าสุดด้วย `/deep-research` + `/follow-best-practice` ทุกครั้ง (ไม่ pin ในไฟล์ — ตาม `/update-devin-global-skills`); `mdc` headmatter renamed เป็น `comark` ตั้งแต่ v52.14

## Execute

### 1. Choose Project Mode

> Goal: เลือก mode ตามตำแหน่ง project

1. ทำ `/deep-research` + `/follow-best-practice` เพื่อยืนยันเวอร์ชันและ pattern ล่าสุด จากนั้นทำ `/deep-review` เพื่อสรุป tech stack
2. รับชื่อ project และตำแหน่งจากผู้ใช้ — ถ้าไม่ระบุตำแหน่ง → ใช้ current directory
3. ถ้าสร้างใน `D:/newkub/slides` → ทำข้อ 2-5 (shared root `package.json`)
4. ถ้าสร้าง standalone นอก `D:/newkub/slides` → ตรวจสอบว่าตำแหน่งว่าง (ถ้ามีอยู่แล้วถามก่อน) แล้วรัน `bun create slidev@latest {project-name}` + `bun install` — standalone มี `package.json` ของตัวเอง ข้ามข้อ 2

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
2. Standalone mode: เลือก template เมื่อ CLI ถาม (`default`, `seriph`, `apple-basic`, `bricks`, `academic`) — scaffold สร้าง `package.json`, `slides.md`, `components/`, `layouts/`, `public/`, `styles/` ให้เอง
3. ถ้าต้องการ สร้าง subdirectories: `components/`, `layouts/`, `public/`, `styles/`

### 4. Configure Slides

> Goal: Configure Slides

1. แก้ไข `slides.md` ตามเนื้อหาที่ต้องการ
2. ตั้งค่า headmatter: `theme` ตาม template, `title`/`info` สื่อเนื้อหา, `transition: slide-left` default, `comark: true` — ถ้าเนื้อหาไทยเพิ่ม `fonts` ด้วย `Noto Sans Thai`
3. เขียน content ด้วย Markdown syntax ของ Slidev (ดู `## Rules` → `### 4-6`)
4. หน้าแรกใช้ `layout: cover`, หน้าสุดท้ายใช้ `layout: end`, แต่ละ slide หนึ่ง concept

### 5. Run Dev Server

> Goal: Run Dev Server

1. Newkub mode: รัน `bunx slidev {project-name}/slides.md` ที่ root directory
2. Standalone mode: รัน `bunx slidev` ใน project directory (ทำ `/run-dev`)
3. dev server จะรันที่ port 3030 (default)
4. เปิด browser เพื่อดู slides แบบ real-time

### 6. Export Slides (Optional)

> Goal: Export Slides (Optional)

1. ใช้ `bunx slidev export {project-name}/slides.md` เพื่อ export เป็น PDF (ต้องมี `playwright-chromium` — ถ้า export fail ด้วย browser error ให้ install ก่อน)
2. ใช้ `bunx slidev build {project-name}/slides.md --out dist/{project-name}` เพื่อ build เป็น static SPA — ใช้ `--router-mode hash|memory|history` ถ้า host ไม่รองรับ SPA routing
3. Standalone mode ใช้ `bunx slidev build` / `bunx slidev export` ใน project directory

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-to-dev-branch`
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
- ใช้ `bunx slidev export` สำหรับ export PDF/PPTX/PNG (ต้องมี `playwright-chromium`)
- ใช้ `bunx slidev build` สำหรับ build static SPA
- `slidev --remote` เปิด remote control, `slidev theme eject` eject theme, `slidev mcp` หรือ `http://localhost:<port>/__mcp` สำหรับ AI agents
- Newkub mode รันคำสั่งที่ root directory `D:/newkub/slides` เสมอ

### 3. Headmatter Configuration

- ตั้งค่า `theme` ตามที่ต้องการ (seriph, default, etc.)
- ตั้งค่า `title` และ `info` ให้ชัดเจน
- ใช้ `transition` สำหรับ slide transitions (slide-left, slide-right, fade-out, fade-in, slide-up, slide-down)
- เปิดใช้ `comark: true` สำหรับ Comark syntax (เดิม `mdc: true` — deprecated ตั้งแต่ v52.14)
- Canvas: `canvasWidth` + `aspectRatio`; zoom ทั้ง slide ด้วย `zoom: 0.8`; scale element ด้วย `<Transform :scale="0.5">`
- SEO/meta: `seoMeta:` block และ `seoMeta.ogImage` หรือวาง `og-image.png` สำหรับ OG image; `download: true` ให้ build แนบ PDF
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

### 4. Markdown Syntax

- ใช้ `---` สำหรับแบ่ง slides — frontmatter block แรกคือ headmatter (deck config), ที่เห็นหลัง `---` คือ per-slide frontmatter; หรือใช้ ```` ```yaml ```` block frontmatter แทน `---` ได้
- HTML comment `<!-- ... -->` = presenter notes; ใส่ `[click]` ใน notes เพื่อ mark จุดที่ต้อง click
- ใช้ `layout` สำหรับ custom layouts (`default`, `two-cols`, `center`, `fact`, `section`, `quote`)
- Layout slots: `::right::`, `::default::` สำหรับแยก content ใน multi-slot layouts
- Comark syntax (ต้อง `comark: true`): inline attrs เช่น `{style="color:red"}`, `{.class}`, `{#id}`
- Import slides จากไฟล์อื่นด้วย `src: ./other.md` — frontmatter merge: main entry ชนะเสมอ
- ใช้ Vue components ใน Markdown ได้; `<style>` ใน slide = scoped CSS; `global-top.vue`/`global-bottom.vue` = global layers
- Icons ด้วย `<mdi-icon-name />` (Iconify); draggable elements ด้วย `v-drag`
- ไม่เกิน 5 bullet points ต่อ slide

### 5. Animation Transitions

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
- Direction-aware styles: prefix `forward:`/`backward:` เช่น `forward:delay-300`
- Rough markers (hand-drawn highlight): `v-mark.underline`, `v-mark.circle` ฯลฯ
- Drawing mode: กด `C` ตอน present หรือ config `drawings:` ใน headmatter

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

### 6. Feature Reference

Compact usage table (sync จาก upstream `skills/slidev/SKILL.md` — docs เต็มที่ https://sli.dev)

#### Code & Editor

| Feature | Usage |
|---------|-------|
| Line highlighting | ```` ```ts {2,3} ```` |
| Click-based highlighting | ```` ```ts {1\|2-3\|all} ```` |
| Line numbers | `lineNumbers: true` หรือ `{lines:true}` |
| Scrollable code | `{maxHeight:'100px'}` |
| Code tabs | `::code-group` (ต้อง `comark: true`) |
| Monaco editor | ```` ```ts {monaco} ```` |
| Runnable code | ```` ```ts {monaco-run} ```` |
| Edit files in slide | `<<< ./file.ts {monaco-write}` |
| Code animations | ```` ````md magic-move ```` |
| TypeScript types hover | ```` ```ts twoslash ```` |
| Import code snippet | `<<< @/snippets/file.js` |

#### Diagrams & Math

| Feature | Usage |
|---------|-------|
| Mermaid diagrams | ```` ```mermaid ```` |
| PlantUML diagrams | ```` ```plantuml ```` |
| LaTeX math | `$inline$` หรือ `$$block$$` |

#### Presenter & Recording

| Feature | Usage |
|---------|-------|
| Camera recording | กด `G` ตอน present |
| Timer | `duration: 30min`, `timer: countdown` |
| Remote control | `slidev --remote` |
| Ruby text (notes) | `notesAutoRuby:` |
| Slide hooks | `onSlideEnter()`, `onSlideLeave()` |
| Navigation API | `$nav`, `useNav()`, `$slidev` composables |

#### Export & Build

| Feature | Usage |
|---------|-------|
| PDF/PPTX/PNG | `slidev export` (ต้อง `playwright-chromium`) |
| Static SPA | `slidev build` + `--router-mode` |
| Bundle PDF | `download: true` ใน headmatter |
| Remote assets | cache อัตโนมัติสำหรับ remote URLs ตอน build |
| OG image | `seoMeta.ogImage` หรือ `og-image.png` |
| SEO meta | `seoMeta:` block |

#### Editor & Tools

| Feature | Usage |
|---------|-------|
| Side editor | click edit icon ใน dev mode |
| VS Code extension | `antfu.slidev` |
| Prettier | `prettier-plugin-slidev` |
| Eject theme | `slidev theme eject` |
| MCP server | `slidev mcp` หรือ `/__mcp` endpoint |

### 7. Built-in Layouts

| Layout | Purpose |
|--------|---------|
| `cover` | Title/cover slide |
| `center` | Centered content |
| `default` | Standard slide |
| `two-cols` / `two-cols-header` | Two columns (ใช้ `::right::`) |
| `image` / `image-left` / `image-right` | Image layouts |
| `iframe` / `iframe-left` / `iframe-right` | Embed URLs |
| `quote` | Quotation |
| `section` | Section divider |
| `fact` / `statement` | Data/statement display |
| `intro` / `end` | Intro/end slides |

### 8. Development Workflow

- รัน dev server ที่ root directory (newkub) หรือ project directory (standalone)
- ติดตามและแก้ไข errors ทันที
- ตรวจสอบว่า dev server ทำงานได้
- Export slides เมื่อพร้อมแชร์

- ใช้ /create-slide-in-newkub-slides ถ้าจำเป็น
- ใช้ /follow-create-mobile-cross-with-capacitor ถ้าจำเป็น (create slide slidev)
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น

## Expected Outcome

- Slidev project สร้างสำเร็จตาม mode ที่เลือก (standalone หรือ `D:/newkub/slides/{project-name}/`)
- Newkub mode ไม่มี `package.json` ของแต่ละ project — ใช้ root `package.json` อย่างเดียว
- `slides.md` มี headmatter และ content ครบถ้วน — ใช้ features จาก `### 6` ตามความเหมาะสม
- Dev server ทำงานได้ที่ port 3030
- Slides แสดงผลได้ถูกต้องใน browser
- สามารถ export เป็น PDF/PPTX หรือ build เป็น static SPA

## Resources

- Documentation: https://sli.dev
- Theme Gallery: https://sli.dev/resources/theme-gallery
- Showcases: https://sli.dev/resources/showcases
- Upstream skill source: https://github.com/slidevjs/slidev/tree/main/skills (generated จาก docs v52.11.3 — sync ใหม่เมื่อ upstream เปลี่ยน)
