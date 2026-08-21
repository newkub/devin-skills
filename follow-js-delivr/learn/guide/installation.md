# jsDelivr Installation

jsDelivr ไม่ต้องการการติดตั้งใดๆ เพราะเป็น CDN service ที่ทำงานผ่าน URL โดยตรง

## Prerequisites

- Web browser ที่รองรับ (ทุก modern browsers)
- Internet connection
- ไม่ต้องสมัครสมาชิกหรือ API key

## เริ่มต้นใช้งาน

### 1. Basic Script Tag

ใช้งานได้ทันทีผ่าน HTML script tag:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <!-- โหลด library ผ่าน jsDelivr -->
  <script src="https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js"></script>

  <script>
    // Library พร้อมใช้งาน
    console.log(_.version);
  </script>
</body>
</html>
```

### 2. ES Modules

สำหรับ modern browsers ที่รองรับ ES Modules:

```html
<!DOCTYPE html>
<html>
<body>
  <div id="app"></div>

  <script type="module">
    // ใช้ esm.run สำหรับ simplified imports
    import { createApp } from 'https://esm.run/vue@3';

    createApp({
      template: '<h1>Hello from jsDelivr!</h1>'
    }).mount('#app');
  </script>
</body>
</html>
```

### 3. CSS/Stylesheets

โหลด CSS frameworks:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">

  <!-- Tailwind (via CDN build) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- หรือ Water.css สำหรับ styling ง่ายๆ -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
</head>
<body>
  <h1>Styled Content</h1>
</body>
</html>
```

### 4. Multiple Libraries

โหลดหลาย libraries ในหน้าเดียวกัน:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- CSS Framework -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0/css/bulma.min.css">
</head>
<body>
  <!-- UI Library -->
  <div id="app">
    <button class="button is-primary" @click="count++">
      Count: {{ count }}
    </button>
  </div>

  <!-- Vue.js -->
  <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>

  <script>
    const { createApp } = Vue;

    createApp({
      data() {
        return { count: 0 };
      }
    }).mount('#app');
  </script>
</body>
</html>
```

## รูปแบบ URL ที่ใช้บ่อย

### bun Packages

```text
https://cdn.jsdelivr.net/npm/{package}@{version}/{path}
```

ตัวอย่าง:

- `https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js`
- `https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js`
- `https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js`

### GitHub Repositories

```text
https://cdn.jsdelivr.net/gh/{user}/{repo}@{version}/{path}
```

ตัวอย่าง:

- `https://cdn.jsdelivr.net/gh/jquery/jquery@3.6.4/dist/jquery.min.js`

### esm.run (ES Modules)

```text
https://esm.run/{package}@{version}
```

ตัวอย่าง:

- `https://esm.run/vue@3`
- `https://esm.run/preact@10`

## การเลือก Version

### Latest Version (ไม่แนะนำสำหรับ production)

```html
<script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
```

### Specific Version (แนะนำ)

```html
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
```

### Major Version (รับ minor และ patch ล่าสุด)

```html
<script src="https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js"></script>
```

### Semver Range

```html
<script src="https://cdn.jsdelivr.net/npm/lodash@^4.17.0/lodash.min.js"></script>
```

## ตัวอย่างการใช้งานเต็มรูปแบบ

### Vue 3 + Axios + Lodash

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Vue App with jsDelivr</title>
</head>
<body>
  <div id="app">
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="user in sortedUsers" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  </div>

  <!-- Libraries -->
  <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js"></script>

  <script>
    const { createApp } = Vue;

    createApp({
      data() {
        return {
          title: 'User List',
          users: []
        };
      },
      computed: {
        sortedUsers() {
          return _.sortBy(this.users, 'name');
        }
      },
      async mounted() {
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/users');
          this.users = response.data;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    }).mount('#app');
  </script>
</body>
</html>
```

## ขั้นตอนถัดไป

หลังจากเริ่มใช้งานแล้ว ศึกษาเพิ่มเติม:

- [Configuration](./setup-configuration.md) - การตั้งค่าเพิ่มเติม
- [Usage Guide](../guide/guide-usage.md) - วิธีใช้งานขั้นสูง
- [Best Practices](../guide/guide-best-practices.md) - แนวทางที่ดีที่สุด
