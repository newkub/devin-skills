# think-* Template

ประเมิน framing/decision ของ content หรือ plan ก่อน commit — produce verdict พร้อม evidence ไม่ rewrite เอง

## Execute Pattern

- ระบุ target และ current frame/assumptions ชัดเจน ก่อน generate alternatives — ห้าม skip ไปตอบ
- ใช้ `/deep-thinking` generate alternatives, `/deep-research` เช็ค precedents/conventions, `/deep-validate` ประเมินกับ criteria แล้วเลือก verdict: keep / reframe / split
- ทุก alternative ต้องมี pros/cons/rework cost — verdict ต้องมีเหตุผลจาก evidence ไม่ใช่ taste
- ถ้า verdict เสี่ยงหรือ rework ใหญ่ → `/ask-me` ให้ user ตัดสิน
- Report ตารางเปรียบเทียบ frames + recommendation — route implementation ไป `/rewrite`, `/refactor`, หรือ `update-*`

## allowed-tools

ปกติไม่ต้อง write — `read`, `grep`, `find_file_by_name`, `web_search`, `webfetch` เพื่อเช็ค precedents
