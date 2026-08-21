# jsDelivr Key Concepts

แนวคิดหลักและคำศัพท์สำคัญที่ต้องเข้าใจก่อนใช้งาน jsDelivr

## 1. URL Structure

### bun Packages

```text
https://cdn.jsdelivr.net/npm/{package}@{version}/{file}
```

ตัวอย่าง:

```text
https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.js
https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css
```

### GitHub Repositories

```text
https://cdn.jsdelivr.net/gh/{user}/{repo}@{version}/{file}
```

ตัวอย่าง:

```text
https://cdn.jsdelivr.net/gh/jquery/jquery@3.6.4/dist/jquery.min.js
https://cdn.jsdelivr.net/gh/twbs/bootstrap@5.3.2/dist/css/bootstrap.min.css
```

### WordPress

```text
https://cdn.jsdelivr.net/wp/{plugin}/tags/{version}/{file}
```

## 2. Version Resolution

jsDelivr รองรับหลายรูปแบบการระบุ version:

| Format | คำอธิบาย | ตัวอย่าง |
|--------|---------|---------|
| Exact | Version ที่ระบุชัดเจน | `vue@3.4.21` |
| Latest | Version ล่าสุด | `vue` หรือ `vue@latest` |
| Minor | Latest patch ของ minor version | `vue@3.4` |
| Major | Latest minor ของ major version | `vue@3` |
| Tag | Git tag หรือ bun tag | `vue@next`, `vue@beta` |
| Range | Semver range | `vue@^3.0.0` |

## 3. ESM vs UMD vs Global

jsDelivr รองรับหลาย module formats:

### ES Modules (ESM)

```javascript
// Direct import บน browser
import { createApp } from 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js';

// หรือใช้ esm.run (แนะนำ)
import { createApp } from 'https://esm.run/vue@3';
```

### UMD (Universal Module Definition)

```html
<!-- ใช้ได้ทั้ง AMD, CommonJS, และ Global -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
```

### IIFE (Immediately Invoked Function Expression)

```html
<!-- Global variable -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js"></script>
<script>
  // jQuery available as global $ variable
  $(document).ready(function() { ... });
</script>
```

## 4. esm.run

Service พิเศษสำหรับ ES Modules:

```javascript
// แทนที่จะระบุ path เอง
import { createApp } from 'https://esm.run/vue@3';

// จะ resolve เป็น:
// https://cdn.jsdelivr.net/npm/vue@3/+esm
```

ข้อดี:

- ไม่ต้องจำ path ของ entry file
- รองรับ deep imports
- มี bundling และ optimization อัตโนมัติ

## 5. File Combining

รวมหลายไฟล์เป็น request เดียวเพื่อลด HTTP requests:

```html
<script src="https://cdn.jsdelivr.net/combine/bun/vue@3,bun/lodash@4/lodash.min.js"></script>
```

## 6. Minification & Source Maps

- ไฟล์ที่ลงท้ายด้วย `.min.js` จะเป็น minified version
- Source maps มีให้โดยอัตโนมัติ (`.map`)
- บาง packages มี minified ให้โดย default

## 7. Caching Strategy

jsDelivr ใช้ multi-layer caching:

1. **Browser Cache**: ตาม HTTP headers
2. **CDN Edge Cache**: ที่แต่ละ POP
3. **Origin Cache**: Cache จาก bun/GitHub

**Cache Duration:**

- Exact versions: 1 year (immutable)
- Version ranges: 7 days
- Latest/undefined: 12 hours

## 8. Multi-CDN Architecture

```text
User Request
     ↓
DNS Resolution (jsDelivr)
     ↓
CDN Selection (Smart Load Balancing)
     ↓
┌─────────────────────────────────────┐
│  Cloudflare  │  Fastly  │  BunnyCDN │
└─────────────────────────────────────┘
     ↓
Edge Server (ใกล้ user ที่สุด)
     ↓
Serve Content
```

## 9. Failover Mechanism

หาก CDN หลักล่ม:

1. ตรวจจับ latency หรือ error
2. สลับไปใช้ CDN รองโดยอัตโนมัติ
3. ผู้ใช้ไม่รู้สึกถึง downtime

## 10. Package.json Configuration

สำหรับ package authors ที่จะ publish ไป bun:

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "unpkg": "dist/index.umd.js",
  "jsdelivr": "dist/index.umd.js"
}
```

- `unpkg`: ระบุ entry point สำหรับ unpkg และ jsDelivr
- `jsdelivr`: ระบุ entry point เฉพาะสำหรับ jsDelivr

## สรุป

เข้าใจแนวคิดเหล่านี้จะช่วยให้ใช้งาน jsDelivr ได้อย่างมีประสิทธิภาพและเหมาะสมกับ use case ของคุณ
