# Visual Diff And Baseline

## Goal

เปรียบเทียบ screenshots กับ baseline อย่างมีประสิทธิภาพและบริหาร baseline ไม่ให้เก่า

## Baseline Rules

- baseline ต้องมาจาก code ที่ผ่าน review/merge ล่าสุด
- เก็บใน `public/screenshots/` หรือตาม `AGENTS.md` ของ project
- ตั้งชื่อ `<route-or-component>--<viewport>.baseline.png`
- ไม่รวม animated/Ads/dynamic content ใน baseline

## Capture Diff

```bash
# baseline
cp current.png baseline.png

# diff (example with ImageMagick)
magick compare -metric AE baseline.png current.png diff.png

# or use node + pixelmatch
npx pixelmatch baseline.png current.png diff.png 1280 720 0.1
```

## Tolerance

| Element | Tolerance |
|---------|-----------|
| layout (position) | 0% — must match exactly |
| text content | 0% |
| colors | 1-2% เพราะ anti-aliasing |
| images | 2-3% ถ้าไม่ใช่ critical UI |

## When To Update Baseline

- อัปเดต baseline เมื่อ design change ได้รับอนุญาต
- บันทึกเหตุผลทุกครั้งที่ update
- ไม่อัปเดต baseline เพื่อทำให้ broken test ผ่าน

## Anti-Flakiness

- ปิด animation ก่อน capture (`prefers-reduced-motion` หรือ style override)
- รอ networkidle ก่อน screenshot
- ใช้ same viewport, same OS, same browser version
- เก็บ screenshots หลังบันไดผ่าน validate ทั้งหมด
