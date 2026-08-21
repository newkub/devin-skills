# jsDelivr

jsDelivr เป็น Open Source CDN ฟรีสำหรับ bun packages และ GitHub repositories ให้บริการส่งมอบ JavaScript libraries, CSS frameworks และ static assets ที่ optimized สำหรับการใช้งานบน web

## Features

- **Multi-CDN Infrastructure** - ใช้งาน Cloudflare, Fastly, BunnyCDN พร้อมกัน
- **Smart Load Balancing** - เลือก CDN ที่ดีที่สุดโดยอัตโนมัติ
- **Automatic Failover** - สลับ CDN อัตโนมัติเมื่อมีปัญหา
- **China Support** - รองรับการเข้าถึงจากประเทศจีน
- **ES Modules** - รองรับ native ESM ผ่าน esm.run
- **File Combining** - รวมหลายไฟล์เป็น request เดียว
- **Version Resolution** - รองรับ semver, tags, ranges
- **No Registration** - ใช้งานได้ทันที ไม่ต้องสมัคร

## Quick Start

### bun Package

```html
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
```

### ES Modules

```html
<script type="module">
  import { createApp } from 'https://esm.run/vue@3';
</script>
```

### GitHub

```html
<script src="https://cdn.jsdelivr.net/gh/jquery/jquery@3.6.4/dist/jquery.min.js"></script>
```

### CSS

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">
```

## Documentation

- [Overview](intro/intro-overview.md) - บทนำ jsDelivr
- [Key Concepts](intro/intro-key-concepts.md) - แนวคิดหลัก
- [When to Use](intro/intro-when-to-use.md) - แนวทางการใช้งาน
- [Installation](setup/setup-installation.md) - เริ่มต้นใช้งาน
- [Configuration](setup/setup-configuration.md) - การตั้งค่า
- [Usage Guide](guide/guide-usage.md) - คู่มือการใช้งาน
- [Best Practices](guide/guide-best-practices.md) - แนวทางที่ดีที่สุด
- [API Reference](apis/api-reference.md) - เอกสาร API
- [API Examples](apis/api-examples.md) - ตัวอย่างการใช้งาน

## Structure

```text
lib-jsdelivr/
├── intro/
│   ├── intro-overview.md
│   ├── intro-key-concepts.md
│   └── intro-when-to-use.md
├── setup/
│   ├── setup-installation.md
│   └── setup-configuration.md
├── guide/
│   ├── guide-usage.md
│   └── guide-best-practices.md
├── apis/
│   ├── api-reference.md
│   └── api-examples.md
├── workflows/
│   └── use-jsdelivr.md
├── README.md
└── SKILL.md
```

## Useful URLs

| Purpose | URL |
|---------|-----|
| Website | <https://www.jsdelivr.com> |
| Documentation | <https://www.jsdelivr.com/documentation> |
| Data API | <https://data.jsdelivr.com> |
| Purge Tool | <https://www.jsdelivr.com/tools/purge> |
| esm.run | <https://esm.run> |
| Status | <https://status.jsdelivr.com> |

## Examples

### Vue 3 Todo App

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0/css/bulma.min.css">
</head>
<body>
  <div id="app">
    <h1>{{ title }}</h1>
    <input v-model="newItem" @keyup.enter="add">
    <button @click="add">Add</button>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.text }}</li>
    </ul>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
  <script>
    const { createApp, ref } = Vue;

    createApp({
      setup() {
        const title = ref('Todo List');
        const newItem = ref('');
        const items = ref([]);
        let id = 0;

        const add = () => {
          if (!newItem.value) return;
          items.value.push({ id: id++, text: newItem.value });
          newItem.value = '';
        };

        return { title, newItem, items, add };
      }
    }).mount('#app');
  </script>
</body>
</html>
```

### ES Modules with Import Map

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://esm.run/vue@3",
    "lodash": "https://esm.run/lodash-es"
  }
}
</script>

<script type="module">
  import { createApp } from 'vue';
  import { debounce } from 'lodash';

  // Your code here
</script>
```

## Resources

- [GitHub](https://github.com/jsdelivr/jsdelivr)
- [Network Map](https://www.jsdelivr.com/network)
- [Statistics](https://www.jsdelivr.com/statistics)
- [Sponsors](https://www.jsdelivr.com/sponsors)
