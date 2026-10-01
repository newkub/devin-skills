# Turborepo — Best Practices

Monorepo task orchestration — pipeline caching และ dependency graphs

## Recommended Patterns

- `turbo.json` pipelines: `build`, `test`, `lint`, `typecheck`, `dev` — `dependsOn: ["^build"]` สำหรับ upstream deps
- `outputs` declarations — cache correctness ขึ้นกับ declared outputs; miss = stale artifacts
- `inputs`/`$TURBO_DEFAULT$` — cache invalidation ตาม source files ไม่ใช่ timestamps
- `turbo run build --filter=...` scope tasks per workspace — `--filter=pkg...` รวม dependents
- Remote caching (Vercel/self-hosted) สำหรับทีม — shared cache = CI เบา

## Common Pitfalls

- `dependsOn` ต่างกัน: `^build` = deps build ก่อน (topological), `build` = ตัวเอง build เสร็จก่อน — เลือกถูก
- `dev`/`watch` tasks = `cache: false` + `persistent: true` — caching persistent tasks breaks everything
- Env vars: `env`/`globalEnv` declarations — undeclared envs ไม่ invalidate cache = stale builds
- `.env` files → `globalDependencies` หรือ per-task `inputs` — มิฉะนั้น env changes ไม่ trigger rebuild
- Pipeline vs package scripts: turbo รัน package scripts — scripts ต้องมีอยู่ใน package.json ของแต่ละ workspace

## CI Integration

- `--affected`/`--filter=[HEAD^]` run เฉพาะ changed-affected packages — CI เบา
- `turbo prune` สำหรับ Docker — partial monorepo copy ลง image
- Remote cache + signature checks — verify cache hits, not silently stale

## Do / Don't

| Do | Don't |
|----|-------|
| `^` prefix สำหรับ dep-graph ordering | flat dependsOn ทุกอย่าง |
| declare outputs+env+inputs | trust default cache keys |
| `--filter` scope CI runs | build ทั้ง monorepo ทุก commit |
| persistent tasks `cache:false` | cache dev servers |
