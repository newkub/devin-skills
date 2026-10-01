# react-scan — Best Practices

React performance scanner — หา unnecessary renders อัตโนมัติ

## Recommended Patterns

- Run ใน dev mode: `npx react-scan` หรือ script tag — overlay ไฮไลต์ components ที่ re-render + counts
- Focus บน render counts ผิดปกติ — component ที่ render ทุก parent render โดย props ไม่เปลี่ยน = memo candidate
- ใช้กับ realistic interactions — click around flows จริง ไม่ใช่ idle page
- Prioritize: high-frequency renders (per keystroke/scroll/mousemove) > one-off renders
- Verify fix ด้วย re-scan — react-scan ก่อน/หลัง memo/restructure

## Common Pitfalls

- Dev mode renders ≠ prod — React StrictMode double-renders ใน dev; อ่านค่าด้วย context นี้
- Memo ทุกอย่าง = worse — `useMemo`/`useCallback` มี cost; fix เฉพาะที่ scan พิสูจน์
- Context value objects ใหม่ทุก render = แหล่ง re-render หลัก — memo context values
- Children-as-props pattern แก้ re-render ดีกว่า memo บ่อย — composition ก่อน optimization
- react-scan highlight เฉพาะ re-renders — ไม่บอกว่า render ช้า; combine profiler สำหรับ slow renders

## Workflow

1. `react-scan` dev session → interact → note top offenders
2. Diagnose cause: unstable props? context? parent renders?
3. Fix: composition/memo/state colocation — อย่า memo ทุกอย่างตาม list
4. Re-scan verify counts ลดจริง

## Do / Don't

| Do | Don't |
|----|-------|
| scan real user flows | idle-page scans |
| fix top-frequency offenders ก่อน | memo ทุก flagged component |
| memo context values | recreate object literals ใน provider |
| re-scan ยืนยัน fix | assume fix worked |
