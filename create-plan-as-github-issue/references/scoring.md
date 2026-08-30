# Feature Scoring

## Goal

คำนวณ priority score ให้แต่ละ feature ด้วยสูตรเดียวกันเพื่อเรียงลำดับ

## Scale

| Dimension | High | Medium | Low |
|---|---:|---:|---:|
| Impact | 10 | 6 | 3 |
| Effect | 10 | 6 | 3 |
| Risk | 3 | 2 | 1 |

| Phase | Multiplier |
|---|---:|
| MVP | 1.0 |
| v2 | 1.5 |
| v3 | 2.0 |
| Done | 0.5 |

## Formula

```text
Score = (Impact + Effect) / (Risk × Phase)
```

- ปัดเศษทศนิยม 1 ตำแหน่ง
- ใช้ score เรียงลำดับ priority สูง → ต่ำ
- ถ้า score เท่ากัน → เรียงตาม Risk ต่ำกว่าก่อน

## Report Format

- แสดง scale ก่อนตาราง
- แสดงสูตรใน issue body
- ทุก row ในตาราง features ต้องมี score จริง
