# Portless Best Practices

แนวทางใช้ `portless` ให้ named `.localhost` URLs เสถียร ไม่ชนกัน และ debug ได้เร็ว

## Recommended Patterns

### Naming And URLs

- ปล่อยให้ชื่อ infer จาก `package.json`/directory — ตั้งเองด้วย `portless <name> <cmd>` เฉพาะเมื่อชื่อ infer ไม่สื่อ (เช่น monorepo root)
- ใช้ subdomain สำหรับบทบาทชัดเจน: `api.myapp` → `https://api.myapp.localhost` แยกจาก app หลัก
- อ้าง URL ใน scripts/env ด้วย `portless get <name>` — ไม่ hardcode `localhost:<port>` และไม่ hardcode `.localhost` URL ลง config ที่ commit (portless อาจเลือก TLD/พอร์ตต่างกันต่อเครื่อง)
- Docs/status pages ของ app ควร derive host จาก request (`getRequestHost`) ไม่ใช่ hardcode origin — ทำให้ docs เดียวกันทำงานได้ทุก alias

### Lifecycle

- เริ่ม session ด้วย `portless doctor` ทีละครั้ง — รู้ทันทีว่า proxy/CA/hosts มีปัญหาก่อนรัน app
- หลัง crash หรือเครื่อง restart → `portless prune` ก่อนเสมอ เก็บ route ที่ชี้ process ตายแล้วออก
- ใช้ `portless service install` เมื่อต้องการ proxy ตั้งแต่ boot — ลด friction ตอน dev ทุกวัน
- เมื่อ debug เจอ route เก่าค้าง → `portless list` เช็คก่อนรันใหม่ อย่าง `--force` ทับโดยไม่ดูว่าของใคร

### Security And Sharing

- `--tailscale`/`--funnel`/`--ngrok` เป็นการ expose dev server ออกเน็ต — ใช้เฉพาะตอนจำเป็น และ stop เมื่อเลิกใช้; อย่า share URL ที่มี admin/debug routes ไม่มี auth
- เก็บ `portless trust` เป็น one-time setup — อย่าเรียกซ้ำทุก script; เครื่องที่ trust ไม่ได้ (CI, เครื่องคนอื่น) ใช้ `--no-tls` + HTTP

## Common Pitfalls

- **Compound commands ทำ injection หลุด**: `portless myapp sh -c "a && b"` หรือ env prefix (`PORT=x cmd`) ทำให้ portless inject `--port` ไม่ได้ — ถ้า command ซับซ้อนให้ wrap เป็น script ใน `package.json` แล้วรัน script นั้น
- **framework ที่ไม่อ่าน `PORT`**: Vite/Astro/Angular portless inject `--port` ให้อัตโนมัติ แต่ถ้าใส่ `--port` เองใน script จะชน — อย่าใส่ซ้ำ
- **`.local` vs `.localhost`**: custom TLD `.local` ชน mDNS (Bonjour) — ใช้ `.test` หรือ default `.localhost` เท่านั้น; `.dev` เจอ HSTS preload
- **Windows**: LAN mode ไม่รองรับ; `hosts sync` ต้อง Admin (แต่ `.localhost` resolve เองใน Chrome/curl อยู่แล้ว — ไม่ต้อง sync); `portless trust` มี dialog ที่ต้องกด "Yes" เองใน Windows cert prompt
- **Route ชี้ port เก่า**: alias ไม่ follow process — ถ้า app เปลี่ยน port ให้ `alias --remove` แล้วสร้างใหม่
