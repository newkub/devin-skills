# Remotion — Best Practices

Programmatic video — compositions, determinism และ render discipline

## Recommended Patterns

- ทุกอย่างขับด้วย `useCurrentFrame()` + `useVideoConfig()` — frame = source of truth; ห้ามพึ่ง wall-clock
- `interpolate()`/`spring()` จาก remotion สำหรับ animation curves — ไม่ใช้ CSS animations/transitions (non-deterministic ตอน render)
- `<Composition>` แยกตาม output (aspect/duration) — props ผ่าน `defaultProps` + `calculateMetadata` สำหรับ dynamic duration
- Assets: `staticFile()` สำหรับ public/ assets — ห้าม hardcode URL นอก static file mechanism
- `<Sequence>` จัด timing layers — from/durationInFrames ชัดเจนแทน nested conditionals

## Common Pitfalls

- Determinism: ทุก frame ต้อง render ผลเดียวกัน — `Math.random()` ต้อง `random('seed')` ของ remotion (seeded)
- `setTimeout`/`setInterval`/`Date.now()` ใน render path = broken frames — ใช้ frame math เท่านั้น
- `delayRender`/`continueRender` สำหรับ async assets — render timeout ถ้า asset โหลดไม่เสร็จไม่ cancel
- Audio/video sources ผ่าน `<Audio>`/`<Video>`/`<OffthreadVideo>` — ไม่ใช้ HTML media tags ดิบ (offthread = frame-accurate)
- Fonts: `loadFont()` จาก `@remotion/google-fonts` — system fonts ต่างกันต่อเครื่อง render

## Perf / Render Notes

- `<OffthreadVideo>` สำหรับ video sources (frame-exact) แต่ช้ากว่า — `<Video>` (main thread) เร็วแต่ไม่ exact; เลือกตามความต้องการ sync
- `renderMedia` concurrency: สูงเกิน RAM — tune `--concurrency` ตาม machine
- Preview (Remotion Studio) vs render parity — test render จริงก่อน ship template

## Do / Don't

| Do | Don't |
|----|-------|
| frame-driven math เท่านั้น | `Date.now()`/timers ใน render |
| `interpolate`/`spring` deterministic | CSS transitions/animations |
| `random('seed')` seeded | `Math.random()` ดิบ |
| `<OffthreadVideo>` frame-accurate | `<video>` tag ดิบ |
