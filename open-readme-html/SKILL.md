---
name: open-readme-html
description: สร้างและเปิดไฟล์ README.html ด้วย Element Plus + Tailwind CSS, tab system 7 tabs พร้อม search, sorting, grouping และ expand/collapse
---

## Goal

สร้างและเปิดไฟล์ `README.html` ด้วย Element Plus + Tailwind CSS, tab system 7 tabs พร้อม search, sorting, grouping และ expand/collapse

## Scope

สร้างไฟล์ README.html ที่มี tab system 7 tabs: Features, Dependencies, Architecture, API Endpoints, Database Schema, Environment Variables, Getting Started โดยใช้ Element Plus components และ Tailwind CSS

## Execute

### 1. Setup HTML Structure

1. ทำตาม `/html` เพื่อ setup HTML structure พื้นฐาน
2. สร้างไฟล์ `README.html` ใน project root
3. ใช้ Vue 3 ผ่าน unpkg CDN (vue.global.js)
4. ใช้ Element Plus CSS (base + dark mode)
5. ใช้ Tailwind CSS CDN

### 2. Create Tab System

1. สร้าง 7 tabs: Features, Dependencies, Architecture, API Endpoints, Database Schema, Environment Variables, Getting Started
2. ใช้ Element Plus `<el-tabs>` component สำหรับ tab navigation
3. ใช้ `<el-tab-pane>` สำหรับแต่ละ tab content
4. เพิ่ม active state สำหรับ tab ที่เลือก

### 3. Add Features Tab

1. จัดกลุ่ม features ตาม category
2. ใช้ Element Plus `<el-collapse>` สำหรับ expand/collapse แต่ละ category
3. ใช้ `<el-table>` สำหรับแสดง features
4. แสดง 7 columns: feature (icon + name), status, category, description, benefit, priority, module
5. เพิ่ม sorting functionality ด้วย `<el-table-column sortable>`
6. เพิ่ม search functionality ด้วย `<el-input>`
7. ใช้ `<el-tag>` สำหรับ status และ priority

### 4. Add Dependencies Tab

1. จัดกลุ่ม dependencies ตาม category
2. ใช้ `<el-table>` สำหรับแสดง dependencies
3. แสดง 6 columns: library (link), version, license, type, security, source
4. ใช้ `<el-tag>` สำหรับ types พร้อม color coding
5. เพิ่ม search functionality ด้วย `<el-input>`
6. ใช้ `<el-link>` สำหรับ library links

### 5. Add Architecture Tab

1. แสดงโครงสร้างโปรเจกต์แบบ tree view
2. จัดกลุ่มตาม layers (Domain, Application, Infrastructure, Adapters, Presentation)
3. ใช้ `<el-collapse>` สำหรับ expand/collapse แต่ละ layer
4. ใช้ `<el-tree>` หรือ nested `<el-collapse-item>` สำหรับ tree structure

### 6. Add API Endpoints Tab

1. จัดกลุ่ม API endpoints ตาม module
2. ใช้ `<el-card>` สำหรับแต่ละ endpoint
3. แสดง method, path, description, parameters
4. เพิ่ม search functionality ด้วย `<el-input>`
5. ใช้ `<el-tag>` สำหรับ HTTP methods พร้อม color coding

### 7. Add Database Schema Tab

1. จัดกลุ่ม tables ตาม module
2. ใช้ `<el-collapse>` สำหรับ expand/collapse แต่ละ table
3. ใช้ `<el-table>` สำหรับแสดง columns
4. แสดง table name, columns, types, relationships
5. เพิ่ม search functionality ด้วย `<el-input>`

### 8. Add Environment Variables Tab

1. จัดกลุ่ม env vars ตาม category
2. ใช้ `<el-card>` สำหรับแต่ละ variable
3. แสดง variable name, description, default value, required
4. เพิ่ม search functionality ด้วย `<el-input>`
5. ใช้ `<el-tag>` สำหรับ required/optional

### 9. Add Getting Started Tab

1. แสดงขั้นตอนการติดตั้ง
2. ใช้ `<el-steps>` สำหรับแสดง steps
3. ใช้ `<el-alert>` สำหรับ prerequisites
4. ใช้ `<el-code-block>` หรือ `<pre>` สำหรับ commands
5. ใช้ `<el-table>` สำหรับ scripts

### 10. Open HTML in Browser

1. ทำตาม `/open-web` เพื่อเปิด README.html ใน browser
2. ใช้ `start README.html` (Windows) หรือ `open README.html` (macOS/Linux)
3. ตรวจสอบว่า file เปิดถูกต้อง

## Rules

### 1. Follow HTML Structure

ทำตาม `/html` สำหรับ HTML structure พื้นฐาน:
- Vue 3 ผ่าน unpkg CDN: `https://unpkg.com/vue@3/dist/vue.global.js`
- Element Plus CSS (base + dark mode): `https://unpkg.com/element-plus/dist/index.css` และ `https://unpkg.com/element-plus/theme-chalk/dark/css-vars.css`
- Tailwind CSS CDN: `https://cdn.tailwindcss.com`
- Dark mode ด้วย `<html class="dark">`
- ใช้ `<script setup>` สำหรับ Vue composition API

### 2. Element Plus Components

ใช้ Element Plus components สำหรับ UI:
- `<el-tabs>` และ `<el-tab-pane>` สำหรับ tab system
- `<el-table>` และ `<el-table-column>` สำหรับ tables พร้อม sorting
- `<el-collapse>` และ `<el-collapse-item>` สำหรับ expand/collapse
- `<el-input>` สำหรับ search inputs
- `<el-tag>` สำหรับ status/priority tags
- `<el-card>` สำหรับ card layouts
- `<el-link>` สำหรับ clickable links
- `<el-steps>` สำหรับ step indicators
- `<el-alert>` สำหรับ alerts/notices

### 3. Tab System Pattern

```html
<el-tabs v-model="activeTab">
  <el-tab-pane label="Features" name="features">
    <!-- Features content -->
  </el-tab-pane>
  <el-tab-pane label="Dependencies" name="dependencies">
    <!-- Dependencies content -->
  </el-tab-pane>
  <!-- ... other tabs -->
</el-tabs>
```

```javascript
const activeTab = ref('features')
```

### 4. Features Grouping with Element Plus

```html
<el-collapse v-model="expandedFeatureGroups">
  <el-collapse-item v-for="group in groupedFeatures" :key="group.category" :name="group.category">
    <template #title>{{ group.category }}</template>
    <el-table :data="group.items" style="width: 100%">
      <el-table-column prop="name" label="Feature" sortable />
      <el-table-column prop="status" label="Status" sortable>
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <!-- ... other columns -->
    </el-table>
  </el-collapse-item>
</el-collapse>
```

### 5. Search Functionality

```html
<el-input
  v-model="featureSearch"
  placeholder="Search features..."
  clearable
  :prefix-icon="Search"
/>
```

```javascript
const filteredFeatures = computed(() => {
  if (!featureSearch.value) return features.value
  const query = featureSearch.value.toLowerCase()
  return features.value.filter(f =>
    f.name.toLowerCase().includes(query) ||
    f.description.toLowerCase().includes(query) ||
    f.benefit.toLowerCase().includes(query)
  )
})
```

### 6. Element Plus Tag Types

```javascript
const getStatusType = (status) => {
  const types = {
    'Implemented': 'success',
    'Planned': 'warning',
    'In Progress': 'primary',
  }
  return types[status] || 'info'
}

const getPriorityType = (priority) => {
  const types = {
    'High': 'danger',
    'Medium': 'warning',
    'Low': 'success',
  }
  return types[priority] || 'info'
}
```

### 7. Library Links with Element Plus

```html
<el-link
  v-if="dep.url"
  :href="dep.url"
  target="_blank"
  type="primary"
  :underline="false"
>
  {{ dep.name }}
</el-link>
```

### 8. Dark Mode Support

- Element Plus รองรับ dark mode ผ่าน CSS variables
- เพิ่ม `class="dark"` ใน `<html>` tag
- Element Plus components จะปรับสีอัตโนมัติตาม dark mode
- Tailwind classes ใช้ `dark:` prefix สำหรับ dark mode styling

## Expected Outcome

- ไฟล์ `README.html` สร้างด้วย Vue 3 (unpkg CDN), Element Plus, และ Tailwind CSS
- แสดง 7 tabs: Features, Dependencies, Architecture, API Endpoints, Database Schema, Environment Variables, Getting Started
- ใช้ Element Plus `<el-tabs>` สำหรับ tab navigation
- Features table ใช้ `<el-table>` พร้อม `<el-table-column sortable>` สำหรับ sorting
- Features ถูก group ตาม category ด้วย `<el-collapse>` พร้อม expand/collapse
- Features มี 7 columns: feature (icon + name), status, category, description, benefit, priority, module
- ใช้ `<el-tag>` สำหรับ status และ priority พร้อม type-based colors
- Dependencies table ใช้ `<el-table>` พร้อม 6 columns
- Library names เป็น `<el-link>` ที่เปิดใน tab ใหม่
- ทุก tabs มี search functionality ด้วย `<el-input>` พร้อม prefix icon
- Architecture tab ใช้ `<el-collapse>` สำหรับ tree view
- API Endpoints ใช้ `<el-card>` พร้อม `<el-tag>` สำหรับ HTTP methods
- Database Schema ใช้ `<el-collapse>` และ `<el-table>`
- Environment Variables ใช้ `<el-card>` พร้อม `<el-tag>` สำหรับ required/optional
- Getting Started ใช้ `<el-steps>`, `<el-alert>`, และ `<el-table>`
- UI/UX มีความ Modern, Professional และ Consistent ด้วย Element Plus design system
- Dark mode รองรับผ่าน Element Plus CSS variables และ Tailwind `dark:` classes
