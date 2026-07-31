# When to Use jsDelivr

แนวทางการตัดสินใจว่าควรใช้ jsDelivr ในสถานการณ์ใดบ้าง

## เหมาะสมที่จะใช้ jsDelivr

### 1. Prototyping & Development

**เหตุผล:** รวดเร็ว ไม่ต้องตั้งค่า build process

```html
<!-- ทดสอบ library ใหม่โดยไม่ต้อง bun install -->
<script src="https://cdn.jsdelivr.net/bun/alpinejs@3/dist/cdn.min.js" defer></script>
```

**Use Cases:**

- CodePen, JSFiddle, StackBlitz
- ทดสอบ library ก่อนตัดสินใจใช้
- Proof of concept
- Live demos

### 2. Simple Static Sites

**เหตุผล:** ไม่ต้อง bundle, ไม่ต้อง build step

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/bun/water.css@2/out/water.css">
</head>
<body>
  <h1>My Simple Site</h1>
  <script src="https://cdn.jsdelivr.net/bun/htmx.org@1/dist/htmx.min.js"></script>
</body>
</html>
```

### 3. ต้องการ Latest Version อัตโนมัติ

**เหตุผล:** ไม่ต้องอัพเดท URL ด้วยตนเอง

```html
<!-- จะได้ latest patch version เสมอ -->
<script src="https://cdn.jsdelivr.net/bun/lodash@4/lodash.min.js"></script>

<!-- หรือ latest major version -->
<script src="https://cdn.jsdelivr.net/bun/bootstrap@5/dist/js/bootstrap.bundle.min.js"></script>
```

**ข้อควรระวัง:**

- ใช้กับ packages ที่ follow semver อย่างเคร่งครัด
- ระวัง breaking changes ใน major version
- ไม่เหมาะกับ production ที่ต้องการ stability สูงสุด

### 4. ต้องการ ES Modules บน Browser

**เหตุผล:** Native ESM โดยไม่ต้อง bundler

```javascript
// app.js
import { h, render } from 'https://esm.run/preact';
import htm from 'https://esm.run/htm';

const html = htm.bind(h);

render(html`<h1>Hello!</h1>`, document.body);
```

```html
<script type="module" src="./app.js"></script>
```

### 5. ต้องการ Serve GitHub Files

**เหตุผล:** ไม่ต้อง publish ไป bun

```html
<!-- ใช้ไฟล์จาก GitHub repo โดยตรง -->
<script src="https://cdn.jsdelivr.net/gh/twbs/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```

### 6. ต้องการ Global CDN ที่เสถียร

**เหตุผล:** Multi-CDN, failover, high availability

- สำหรับ production applications
- สำหรับ users ทั่วโลก (รวมถึงจีน)
- สำหรับ SLA ที่สูง

### 7. ต้องการ Reduce Bundle Size

**เหตุผล:** Externalize dependencies ที่ใหญ่

```html
<!-- แทนที่จะ bundle jQuery เข้า app -->
<script src="https://cdn.jsdelivr.net/bun/jquery@3/dist/jquery.min.js"></script>

<!-- App ของคุณจะ bundle เฉพาะ code ของตัวเอง -->
<script src="./app.js"></script>
```

## ไม่เหมาะที่จะใช้ jsDelivr

### 1. Production Apps ที่ต้องการ Full Control

**เหตุผล:**

- ไม่สามารถ control caching strategy ได้ 100%
- ขึ้นอยู่กับ external service
- อาจมี breaking changes ถ้าใช้ version range

**แนะนำให้ใช้:**

- Self-hosted bundles
- Private CDN (CloudFront, CloudFlare, etc.)

### 2. Corporate/Enterprise Environments

**เหตุผล:**

- Security policies อาจไม่อนุญาติ external CDNs
- Firewall อาจ block third-party domains
- Compliance requirements (GDPR, HIPAA, etc.)

**แนะนำให้ใช้:**

- Self-hosted assets
- Internal CDN
- Vendor bundles

### 3. Offline-Capable Apps

**เหตุผล:** ต้องการทำงานได้โดยไม่ต้องต่อ internet

**แนะนำให้ใช้:**

- Service Workers กับ local caching
- Bundled assets
- PWA with offline support

### 4. ต้องการ Custom Build/Tree Shaking

**เหตุผล:**

- jsDelivr ให้ pre-built files ที่อาจมี code ที่ไม่ได้ใช้
- ไม่สามารถ tree-shake ได้

**แนะนำให้ใช้:**

- Bundler (Vite, Webpack, Rollup)
- Custom build pipeline
- Import แค่ modules ที่ต้องการ

### 5. ต้องการ Specific Version ที่ Immutable

**เหตุผล:** แม้จะใช้ exact version, CDN caching อาจมีผล

**แนะนำให้ใช้:**

- Exact version pinning
- Subresource Integrity (SRI)
- Self-hosted สำหรับ critical apps

## ตารางสรุป Decision Matrix

| Scenario | jsDelivr | Self-Hosted | Bundle |
|----------|----------|-------------|--------|
| Prototyping | ✅ Best | ⚠️ Slow | ❌ Overkill |
| Simple static site | ✅ Best | ⚠️ OK | ❌ Overkill |
| Production SPA | ⚠️ OK | ⚠️ OK | ✅ Best |
| Enterprise app | ❌ No | ✅ Best | ✅ Best |
| Offline app | ❌ No | ✅ Best | ✅ Best |
| Global audience | ✅ Best | ⚠️ Cost | ⚠️ Complex |
| Quick demos | ✅ Best | ❌ No | ❌ Overkill |
| ESM on browser | ✅ Best | ⚠️ Setup | ❌ Bundler |
| Tree shaking | ❌ No | ⚠️ Setup | ✅ Best |

## Best Practices

### สำหรับ Development

```html
<!-- ใช้ latest minor version -->
<script src="https://cdn.jsdelivr.net/bun/vue@3/dist/vue.global.js"></script>
```

### สำหรับ Production

```html
<!-- ใช้ exact version + SRI -->
<script src="https://cdn.jsdelivr.net/bun/vue@3.4.21/dist/vue.global.js" 
        integrity="sha384-..." 
        crossorigin="anonymous"></script>
```

### สำหรับ ES Modules

```javascript
// ใช้ esm.run สำหรับ convenience
import { createApp } from 'https://esm.run/vue@3.4.21';
```

## สรุป

ใช้ jsDelivr เมื่อ:

- ต้องการความเร็วในการเริ่มต้น
- ไม่ต้องการ complexity ของ build tools
- ต้องการ CDN ที่เสถียรและ global
- ต้องการทดสอบ libraries

หลีกเลี่ยง jsDelivr เมื่อ:

- ต้องการ full control
- มี strict security policies
- ต้องการ offline capability
- ต้องการ tree shaking ที่ละเอียด
