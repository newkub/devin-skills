# jscpd — Best Practices

Copy-paste detection — thresholds, ignores และ CI discipline

## Recommended Patterns

- Config ใน `.jscpd.json` หรือ `package.json` key — `threshold` (default 5%), `minTokens` (50-70 sweet spot), `reporters`
- Excludes: generated code, lockfiles, `*.min.*`, snapshots, fixtures — ผ่าน `ignore` patterns
- `minLines`/`minTokens` สูงขึ้นสำหรับ strict mode — default ต่ำ = false positives จาก boilerplate
- CI: `jscpd --exitCode 1` fail เมื่อ threshold เกิน — baseline current % ก่อนแล้วค่อย ratchet ลง
- Reporters: `console` dev + `html`/`badge` สำหรับ reports

## Common Pitfalls

- Test files = legit duplication (setup patterns) — ignore `**/*.test.*` หรือยอมรับ threshold สูงกว่าสำหรับ tests
- jscpd detect cross-language clones — `.tsx` vs `.ts` near-identical files จะ flag; มองเป็น signal ไม่ใช่ noise เสมอ
- Generated code (proto, gql codegen) ต้อง ignore — duplication ตรงนั้นแก้ไม่ได้
- Threshold 0 = noisy เกินใช้ — เริ่ม 5-10% แล้วลดทีละนิด
- Ignore blocks (`/* jscpd:ignore-start */`) — ใช้เฉพาะ justified cases (protocol-mandated boilerplate)

## Workflow

- Baseline → ratchet: วัด current dup % → set threshold = current → ticket เพื่อลด → ลด threshold
- Findings = refactor targets: extract shared module/hook — แต่ไม่ใช่ทุก clone ต้องแก้ (similar ≠ same abstraction)

## Do / Don't

| Do | Don't |
|----|-------|
| threshold + ignores ใน config file | CLI flags scattered ต่อ invocation |
| ignore generated/test boilerplate | tune minTokens จน silent |
| ratchet threshold ลงเรื่อยๆ | ตั้ง 0% แล้วทีม mute |
| review clones เป็น refactor signals | auto-extract ทุก match |
