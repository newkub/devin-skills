---
name: report-html
description: สร้าง HTML สำหรับแสดงข้อมูลใน browser รองรับทั้งแบบง่าย ๆ และแบบ interactive
  พร้อม Vue 3,...
allowed-tools:
- read
- write
- edit
- grep
- glob
- exec
- ask_user_question
triggers:
- user
- model
related:
- report-format-table
- suggest-next-action
---

## Goal

สร้าง HTML ไฟล์เดียวสำหรับแสดงข้อมูลใน browser รองรับ 2 โหมด: แบบง่าย ๆ (static) และแบบ interactive (Vue 3 + theme toggle + sticky tabs)

## Scope

ใช้สำหรับ workflows ที่ต้องสร้าง HTML สำหรับแสดงข้อมูล ตั้งแต่ static content ไปจนถึง interactive report พร้อม search, filter, tabs, theme toggle

## Execute

### 1. Setup HTML Structure

1. โหลด Tailwind CSS: `<script src="https://cdn.tailwindcss.com"></script>`
2. ถ้าต้องการ interactivity → โหลด Vue 3 ผ่าน `<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>`
3. โหลด libraries เพิ่มเติมตามต้องการ (marked.js, chart.js, etc.)
4. สร้าง `<div id="app">` และ `<script>` block ถ้าใช้ Vue 3
5. เพิ่ม `tailwind.config = { darkMode: 'class' }` สำหรับ dark mode support

### 2. Initialize Vue Ecosystem

1. ใช้ `Vue.createApp()` จาก global object
2. ใช้ Vue template syntax (`v-model`, `v-for`, `{{ }}`) ใน HTML
3. ใช้ Tailwind utility classes พร้อม `dark:` prefix สำหรับ dark mode
4. ใช้ JavaScript ธรรมดา (ไม่ใช้ TypeScript) ใน `<script>` block

### 3. Theme Toggle

1. สร้างปุ่ม toggle สำหรับสลับ light/dark theme
2. ใช้ `isDark` ref สำหรับเก็บ state ของ theme
3. Toggle `dark` class บน `<html>` element
4. บันทึก theme preference ใน `localStorage`
5. อ่าน theme จาก `localStorage` หรือ `prefers-color-scheme` เมื่อโหลดหน้า
6. ใช้ `dark:` prefix ของ Tailwind สำหรับ dark mode styles

### 4. Sticky Tabs

1. ใช้ `position: sticky` และ `top-0` สำหรับ tab bar container
2. เพิ่ม `z-index` สำหรับให้อยู่เหนือเนื้อหาเมื่อ scroll
3. เพิ่ม `backdrop-blur` และ background color สำหรับ readability เมื่อ scroll
4. แสดง active tab ด้วย border-bottom หรือ background color
5. แต่ละ tab มี badge แสดง count

### 5. Search And Filter

1. สร้าง search input ด้วย `v-model`
2. สร้าง filter chips แบบ toggle (กดเพื่อเปิด/ปิด)
3. ใช้ `computed` สำหรับ filtered results
4. เพิ่มปุ่ม Clear filters เมื่อมี active filter

### 6. Open In Browser

1. ทำ `/open-web` เพื่อเปิดไฟล์ HTML ใน browser

## Rules


### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Title</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script>
    tailwind.config = { darkMode: 'class' }
  </script>
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
  <div id="app">
    <!-- Header with theme toggle -->
    <!-- Sticky tabs -->
    <!-- Content with search/filter -->
  </div>
  <script>
    const { createApp, ref, computed, onMounted } = Vue
    createApp({
      setup() {
        const isDark = ref(false)
        const activeTab = ref('tab1')
        const searchQuery = ref('')

        onMounted(() => {
          const saved = localStorage.getItem('theme')
          if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            isDark.value = true
            document.documentElement.classList.add('dark')
          }
        })

        const toggleTheme = () => {
          isDark.value = !isDark.value
          if (isDark.value) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
          } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
          }
        }

        return { isDark, activeTab, searchQuery, toggleTheme }
      }
    }).mount('#app')
  </script>
</body>
</html>
```

### 2. CDN Libraries

| Category | Library | URL | Notes |
|----------|---------|-----|-------|
| Framework | Vue 3 | https://unpkg.com/vue@3/dist/vue.global.js | ผ่าน `<script>` tag |
| CSS | Tailwind CSS | https://cdn.tailwindcss.com | Utility-first CSS |
| Markdown | Marked | https://unpkg.com/marked/marked.min.js | Markdown parser |
| Charts | Chart.js | https://unpkg.com/chart.js@4/dist/chart.umd.js | Data visualization |
| Icons | MDI Font | https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css | Icon set |
| Icons | Lucide | https://unpkg.com/lucide | Icon set |
| Date | Day.js | https://unpkg.com/dayjs/dayjs.min.js | Date manipulation |
| Utils | Lodash | https://unpkg.com/lodash/dist/lodash.min.js | Utility functions |
| DOM | DOMPurify | https://unpkg.com/dompurify/dist/purify.min.js | DOM sanitization |
| Color | Chroma.js | https://unpkg.com/chroma-js/chroma.min.js | Color manipulation |

### 3. UI/UX Design Guidelines

- Minimal Layout - พื้นที่ว่างเพียงพอ
- Flat Colors - โทนสีเรียบง่าย
- Clear Text - ขนาดชัดเจน
- Direct UI - ตรงไปตรงมา
- Rounded corners สำหรับ cards และ buttons
- Shadow-sm สำหรับ depth แบบ subtle
- Backdrop-blur สำหรับ sticky elements

### 4. JavaScript Patterns

```javascript
// Refs
const count = Vue.ref(0)

// Computed
const double = Vue.computed(() => count.value * 2)

// Watch
Vue.watch(count, (newVal) => console.log(newVal))

// onMounted
Vue.onMounted(() => { /* init logic */ })
```

### 5. When To Use

- Static mode (ไม่โหลด Vue 3): ใช้สำหรับ HTML ง่าย ๆ ไม่มี interactivity เช่น static report, documentation page
- Interactive mode (โหลด Vue 3): ใช้สำหรับ report พร้อม search, filter, tabs, theme toggle
- ถ้าไม่ต้องการ interactivity → ข้าม steps 2-5 ใน Execute และใช้แค่ Tailwind CSS

## Expected Outcome

- HTML ไฟล์เดียวที่ทำงานได้จริงใน browser โดยไม่ต้อง build
- Tailwind CSS สำหรับ styling พร้อม `dark:` prefix สำหรับ dark mode
- ถ้าใช้ interactive mode: Vue 3, theme toggle, sticky tabs, search และ filter chips
- ถ้าใช้ static mode: HTML ง่าย ๆ ไม่ต้องใช้ framework
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
