# Validation Checklist

skill package ผ่านเกณฑ์ทั้งหมด

## Steps

1. ทำตาม `/validate` เพื่อตรวจความถูกต้อง
2. ทำตาม `/validate` เพื่อตรวจ: ไม่เกิน 250 บรรทัด, sections ครบ, `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
4. ถ้ามี `.devin/rules/` → ทำ `/review-rules` เพื่อตรวจคุณภาพ rules
5. ถ้าพบ issue → แก้และ revalidate (max 3 → stop/report)

## Update References

1. ทำ `/update-references` เพื่ออัปเดต references ที่เกี่ยวข้อง
2. ทำ `/suggest-next-action` เพื่อแนะนำ skills ถัดไป
3. ถ้า reference update ล้มเหลว → retry (max 3 → stop/report)
