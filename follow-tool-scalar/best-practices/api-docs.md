# Scalar API Docs Best Practices

## Recommended Patterns

- ใช้ OpenAPI spec เป็น single source of truth — docs, mock server และ validation ทั้งหมด derive จาก spec เดียว
- เก็บ `openapi.yaml` ใน repo เดียวกับ source code — spec เปลี่ยนตาม code ผ่าน PR เดียวกัน
- ใส่ `description`, `examples` และ `deprecated` ครบทุก operation/schema — Scalar render สิ่งเหล่านี้เป็นเอกสารหลัก
- จัดกลุ่ม endpoints ด้วย `tags` และใส่ `tags[].description` เพื่อ sidebar ที่อ่านง่าย
- กำหนด `servers` ให้ครบทุก environment (dev, staging, prod) — playground จะยิง request ไปยัง server ที่เลือก
- ใช้ `securitySchemes` อธิบาย auth จริง (bearer, apiKey, oauth2) — playground ใส่ credentials ให้ทดสอบได้
- แยก spec เป็นหลายไฟล์ด้วย `$refs` แล้วรัน `document bundle` ก่อน publish/CI
- ใช้ `document mock --watch` ระหว่างพัฒนา frontend — backend ยังไม่เสร็จก็ทำงานต่อได้

## Common Pitfalls

- แก้ generated docs โดยตรง — ถูก overwrite เมื่อ regenerate; แก้ที่ spec เท่านั้น
- `$refs` ชี้ไฟล์ local แล้ว publish spec ดิบ — consumer เปิดไม่ได้; ต้อง bundle ก่อน
- spec ไม่มี examples — mock server สุ่ม response ที่ไม่ realistic
- hardcode API keys/secrets ลงใน spec หรือ config — ใช้ environment variables แทน
- spec ไฟล์เดียวใหญ่หลายพันบรรทัด — review ยาก; แยกด้วย `$refs` ตั้งแต่ต้น
- ลืม `document validate` ก่อน commit — spec พังแล้ว docs pipeline ล้มทีหลัง
- mock server ไม่ได้เปิด `--watch` — แก้ spec แล้ว mock ยัง serve ของเก่า

## Do / Don't

| Do | Don't |
|----|-------|
| validate + lint spec ทุก PR ใน CI | commit spec ที่ยังไม่ผ่าน `document validate` |
| bundle `$refs` ก่อน deploy docs | publish spec ที่ reference ไฟล์ภายนอก |
| ใช้ mock server สำหรับ dev และ contract testing | ใช้ mock แทนการทดสอบ API จริง |
| เก็บ scalar config ใน repo พร้อม review | เก็บ credentials ใน config file |
| ใส่ `proxyUrl` เมื่อ playground เจอ CORS | ปิด CORS ฝั่ง API เพื่อให้ playground ยิงได้ |

## Config Guidance

- ใช้ `scalar.config.json` หรือ `scalar.config.ts` ที่ root — ระบุ `title`, `theme`, `layout`, `proxyUrl`
- ตั้ง `proxyUrl` เมื่อ API อยู่คนละ origin กับ docs — request จาก playground จะไม่ติด CORS
- ใช้ env vars (`SCALAR_PORT`, `SCALAR_API_URL`) สำหรับค่าที่ต่างกันตาม environment — ไม่ hardcode
- embed mode (`@scalar/api-reference`) เหมาะกับ docs ใน app ที่มีอยู่; CLI/registry เหมาะกับ standalone docs site
- ซ่อน clients/languages ที่ไม่เกี่ยวผ่าน config แทนการ fork theme

## Performance & CI

- CI pipeline: `document validate` → `document lint` → `document bundle` → build/deploy docs — ทุก step fail เร็วก่อน deploy
- รัน validate บน PR ที่แตะ spec เท่านั้น (path filter) — ประหยัด CI time
- static output deploy ไป GitHub Pages/Cloudflare Pages — ไม่ต้องมี server
- mock server ใน CI ใช้สำหรับ contract tests — start mock → รัน API tests → kill; อย่า leave process ค้าง
- docs site ใหญ่: bundle spec ล่วงหน้าใน CI แทนให้ browser resolve `$refs` runtime
