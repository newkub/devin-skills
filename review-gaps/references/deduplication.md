# Deduplication And Cross-Reference

criteria สำหรับตัด findings ซ้ำและหา causal relationships ระหว่าง gaps

## Deduplication Criteria

findings สองรายการถือเป็น duplicate เมื่อ:

- อ้างถึง file path และ line number เดียวกัน
- อ้างถึง root cause เดียวกันแม้ location ต่างกันเล็กน้อย
- คำอธิบาย gap ตรงหรือใกล้เคียงกัน

## Merge Rules

เมื่อพบ duplicate:

1. รวมเป็น single finding
2. ระบุทุก `source` dimensions ที่พบ
3. ใช้ severity สูงสุดจากทุก source
4. รวม evidence จากทุก source
5. บันทึก `duplicate-count` เพื่อใช้ใน scoring

## Cross-Reference Criteria

causal relationship ระหว่าง gaps:

- `root-cause`: gap นี้ทำให้เกิด gap อื่น
- `downstream`: gap นี้เกิดจาก gap อื่น
- `related`: gap นี้เกี่ยวข้องแต่ไม่ใช่ cause

## Cross-Reference Steps

1. หา gap ที่เป็น root cause ของ gap อื่น
2. หา gap ที่เกิดจาก gap อื่น (downstream)
3. ทำเครื่องหมาย dependency chain
4. ถ้าแก้ root cause แล้ว downstream หาย → ลด priority ของ downstream
5. ถ้า root cause ยังไม่แก้ → เพิ่ม priority ของ root cause

## Dependency Chain

- แสดง chain เป็น list: `gap-A → gap-B → gap-C`
- root cause อยู่ต้น chain
- ถ้า chain ยาวเกิน 5 → แยกเป็น sub-chain
- ใช้ chain ในการปรับ priority ใน Step 8
