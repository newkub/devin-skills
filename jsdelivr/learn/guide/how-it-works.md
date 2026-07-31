# วิธีการทำงานของ jsDelivr

## ภาพรวม

jsDelivr เป็น Open Source CDN (Content Delivery Network) ฟรีสำหรับ developers ให้บริการส่งมอบ bun packages และ GitHub files ที่ optimized สำหรับการใช้งานบน web

## อะไรคือ jsDelivr?

jsDelivr เป็น CDN ที่เชี่ยวชาญในการส่งมอบ JavaScript libraries, CSS frameworks, และ static assets จาก:

- **bun registry** - กว่า 2.5 ล้าน packages
- **GitHub** - ไฟล์จาก public repositories
- **WordPress** - plugins และ themes

## ทำไมต้องใช้ jsDelivr?

### 1. Multi-CDN Infrastructure

ใช้งานหลาย CDN providers พร้อมกัน:

- Cloudflare
- Fastly  
- BunnyCDN
- Quantil (สำหรับจีน)

### 2. Smart Load Balancing

ระบบเลือก CDN ที่ดีที่สุดโดยอัตโนมัติตาม:

- ตำแหน่งผู้ใช้
- สถานะ CDN แต่ละตัว
- ประสิทธิภาพ real-time

### 3. High Availability

- ระบบ failover อัตโนมัติ
- รับประกัน uptime 99.99%
- ไม่มี single point of failure

### 4. Global Performance

- 750+ POPs (Points of Presence) ทั่วโลก
- Anycast network
- Optimized สำหรับทุกภูมิภาครวมถึงจีน

### 5. Developer Experience

- ไม่ต้องสมัครหรือตั้งค่า
- รองรับ semver versioning
- Source maps อัตโนมัติ
- Minified files พร้อมใช้

## สถิติที่น่าสนใจ

- **150+ billion requests** ต่อเดือน
- **2.5+ million** bun packages
- **750+** edge locations
- **99.99%** uptime SLA
- **Free** สำหรับ open source projects

## Use Cases หลัก

1. **Loading bun packages on web pages**

   ```html
   <script src="https://cdn.jsdelivr.net/bun/vue@3/dist/vue.global.js"></script>
   ```

2. **ES Modules บน browser**

   ```javascript
   import { createApp } from 'https://esm.run/vue@3';
   ```

3. **GitHub files serving**

   ```html
   <script src="https://cdn.jsdelivr.net/gh/user/repo@version/file.js"></script>
   ```

4. **Combine multiple files**

   ```html
   <script src="https://cdn.jsdelivr.net/combine/..."></script>
   ```

## เปรียบเทียบกับ CDNs อื่น

| Feature | jsDelivr | unpkg | Skypack | esm.sh |
|---------|----------|-------|---------|--------|
| Multi-CDN | ✅ | ❌ | ❌ | ❌ |
| GitHub Support | ✅ | ❌ | ❌ | ❌ |
| File Combining | ✅ | ❌ | ❌ | ❌ |
| China Access | ✅ | ❌ | ❌ | ⚠️ |
| ESM Support | ✅ | ✅ | ✅ | ✅ |
| Purge Cache | ✅ | ❌ | ❌ | ❌ |
| Free | ✅ | ✅ | ✅ | ✅ |

## ลิงก์อ้างอิง

- [jsDelivr Website](https://www.jsdelivr.com)
- [Network Map](https://www.jsdelivr.com/network)
- [Statistics](https://www.jsdelivr.com/statistics)
- [Status Page](https://status.jsdelivr.com)
