# Effect-TS — Best Practices

Patterns สำหรับ Effect — services, layers, error handling และ boundary discipline

## Recommended Patterns

- `Effect.gen` สำหรับ composition — yield* effects, เขียนเหมือน imperative แต่ lazy จน run
- Services ผ่าน `Context.Tag` + `Layer` — dependency injection ที่ typed; compose layers ตอน bootstrap
- Errors เป็น values: `Effect.fail`, `Effect.catchTag`, `Effect.catchAll` — เลือก catch เฉพาะ tag ที่ handle ได้
- `Effect.runPromise`/`BunRuntime.runMain` ที่ entry point เท่านั้น — ภายใน program ทุกอย่างเป็น Effect
- Schema (`effect/Schema` หรือ `@effect/schema`) สำหรับ boundary validation — decode/encode typed

## Common Pitfalls

- Effect เป็น lazy — สร้างแล้วไม่ทำอะไรจน `run*`; อย่าลืม run หรือคิดว่า code execute ทันที
- `Effect.tryPromise` wrap async — ห้ามใส่ `await` ตรงๆ ใน gen (breaks fiber model)
- Layers: dependency order ต้องถูก — `Layer.provide` chain; circular layer = runtime error ยาก debug
- Don't mix `Promise` + `Effect` freely — convert ที่ boundary (`Effect.promise`, `Effect.runPromise`) เท่านั้น
- Defects vs typed errors vs interruptions — 3 channels ต่างกัน; typed `E` คือ expected errors เท่านั้น

## Perf Notes

- Fibers ถูกกว่า native promises — structured concurrency ผ่าน `Effect.fork`, `Effect.all` (parallel)
- `Effect.cached`/`MemoMap` สำหรับ expensive computations — memoize ที่ layer level
- Tracing/logging: built-in `Effect.withSpan` + Logger — อย่า sprinkle console.log ใน fibers

## Do / Don't

| Do | Don't |
|----|-------|
| `runPromise`/`runMain` ที่ boundary | `run*` กลาง business logic |
| `catchTag` เจาะจง error type | `catchAll` swallow ทุกอย่าง |
| `Layer` composition ตอน boot | construct services มือทุก call site |
| `Effect.all` parallel | sequential `await` chains ที่อิสระกัน |
