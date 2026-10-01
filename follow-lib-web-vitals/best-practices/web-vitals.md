# web-vitals — Best Practices

Core Web Vitals measurement — attribution และ reporting discipline

## Recommended Patterns

- วัด Core Web Vitals ครบ: `onLCP`, `onINP`, `onCLS` + diagnostic `onFCP`, `onTTFB` — INP แทน FID แล้ว
- ใช้ attribution build (`web-vitals/attribution`) ตอน debug — บอกว่า element/sub-part ไหนทำ metric แย่
- Report ผ่าน `navigator.sendBeacon` หรือ `fetch(..., {keepalive: true})` — ห้าม XHR sync ตอน unload
- Report ทุก metric เมื่อ final (callback fire หลายครั้ง — ใช้ค่า latest ตอน `reportAllChanges` หรือ send ตอน visibilitychange:hidden)
- Batch + queue metrics แล้วส่งรวมเมื่อ page hidden — ลด beacon count

## Common Pitfalls

- Metrics เป็น RUM — lab (Lighthouse) ≠ field data; users จริงแย่กว่าเสมอ, optimize จาก field percentiles (p75)
- CLS/INP สะสมตลอด session — SPA navigations ต้อง reset/report ต่อ route เอง (lib ไม่ทำ)
- `onINP` ต้องการ user interaction — sessions ไม่มี interaction จะไม่มี INP value
- Callbacks fire หลายครั้ง — อย่า send ทุก call; flag ว่า report แล้วหรือใช้ `reportAllChanges` ตั้งใจ
- Third-party scripts/ads/iframes ทำ LCP/CLS แย่ — attribution build บอก culprit ได้

## Interpretation

| Metric | Good | Needs work | Poor |
|--------|------|-----------|------|
| LCP | ≤2.5s | ≤4s | >4s |
| INP | ≤200ms | ≤500ms | >500ms |
| CLS | ≤0.1 | ≤0.25 | >0.25 |

- p75 threshold = Google ranking signal — optimize สำหรับ p75 ไม่ใช่ median

## Do / Don't

| Do | Don't |
|----|-------|
| `sendBeacon`/`keepalive` ตอน hidden | sync XHR ตอน unload |
| attribution build ตอน debug | guess culprit จาก metric เดียว |
| p75 field data | optimize จาก Lighthouse อย่างเดียว |
| report per-route ใน SPA | assume auto reset ข้าม navigations |
