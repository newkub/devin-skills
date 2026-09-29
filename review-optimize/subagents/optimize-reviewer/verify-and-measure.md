---
name: verify-and-measure
description: Measure before/after correctly — baselines, metrics per layer, regression detection, revert criteria
---

# Verify And Measure

## Goal

ทุก fix พิสูจน์ได้ด้วยตัวเลข — baseline เดิม vs after, regression detect ได้, revert criteria ชัด

## Baseline Capture

เก็บก่อนแก้เสมอ (ต่อ layer ที่จะแตะ):

| Layer | Baseline Metric | วิธีเก็บ |
|-------|-----------------|----------|
| bundle | chunk sizes, dist total, entry bytes | `/run-build` + dist listing |
| render | DOM node count, render count per interaction | DevTools/React-Solid devtools, instrumentation |
| streaming | updates per stream, parse calls | counter/log ชั่วคราว |
| polling/IPC | invoke calls per tick, poll cost | instrumentation, profiler |
| startup | time-to-interactive, IPC rounds | timestamps, profiler |
| native | binary size, release build time | build output |
| memory | heap after warm-up, growth per cycle | DevTools heap, `--expose-gc` |

## Measurement Rules

1. วัดสิ่งเดียวกันวิธีเดียวกัน — same machine, same input, same flow
2. หลายรอบ (≥3) แล้วเทียบ median — ลด noise
3. แยก fix ต่อ measurement — รวมหลาย fix แล้ววัดรวมเดียว = หา regression ไม่เจอ
4. instrumentation ชั่วคราว (counters, timestamps) → remove หลัง verify หรือ gate ด้วย dev flag

## Regression Detection

- correctness: typecheck + lint + tests + build ผ่าน — ไม่ใช่แค่ build ผ่าน
- behavior: smoke flows ที่ fix แตะ — scroll, stream end, hide/show, cold start, deep link
- performance: metric ไม่ดีขึ้น > noise floor → นับเป็น no-gain ไม่ใช่ win
- regressions ที่ยอมไม่ได้: data loss, ordering changes, dropped cleanup, broken fallback

## Revert Criteria

revert fix นั้นแล้ว report เมื่อ:

- metric ไม่ดีขึ้นหรือแย่ลงเกิน noise floor
- behavior เปลี่ยน (ordering, output, lifecycle) — optimize ≠ เปลี่ยน output
- tests/typecheck fail ที่แก้ไม่ได้ในงบเวลาสมเหตุสมผล

## Severity

- Critical: claim improvement โดยไม่มี before/after measurement
- High: หลาย fixes รวมในครั้งเดียวแล้ววัดรวม — แยกผลไม่ได้
- Medium: instrumentation ค้างใน prod path
- Low: missing median/multi-run averaging
