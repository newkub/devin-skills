# Semgrep Rules Authoring Best Practices

## Recommended Patterns

- เก็บ custom rules ใน `.semgrep/` หรือ `semgrep/rules/` ใน repo เดียวกับ code — version ตาม code, review ผ่าน PR
- ทุก rule ต้องมี test file (`tests/` หรือ `*.test.*` ข้าง rule) แล้วรัน `semgrep --test` — pattern ที่ไม่มี test คือ pattern ที่เดาพฤติกรรม
- ตั้ง rule id เป็น namespaced เช่น `org.project.no-direct-fetch` — เลี่ยงชนกับ registry rules
- ใส่ metadata ครบ: `message`, `severity` (`ERROR`/`WARNING`/`INFO`), `confidence`, `category`, `references` — findings ที่ไม่มี context triage ยาก
- ใช้ metavariables (`$X`, `$REQ`) แทน literal matching — จับ pattern ได้กว้างโดยไม่เพิ่ม false positives
- ใช้ `pattern-either` สำหรับ variants และ `pattern-not`/`pattern-not-inside` ตัด case ที่ถูกต้องออก
- ใช้ `patterns` กับ `focus-metavariable` เมื่อต้องการจับเฉพาะจุดของ expression ใหญ่
- ใช้ taint mode (`pattern-sources`/`pattern-sinks`/`pattern-sanitizers`) สำหรับ injection/dataflow rules — อย่าเขียน dataflow ด้วย pattern matching ล้วน
- เพิ่ม `fix:` key เฉพาะเมื่อ rewrite ปลอดภัยและ deterministic — ทดสอบ autofix บน codebase จริงก่อน commit

## Common Pitfalls

- pattern กว้างเกิน เช่น `foo(...)` จับทุก call — ใช้ `pattern-not`/`paths.exclude` จำกัด scope
- เขียน rule แล้วไม่ test — rule ที่ match ผิดพบทีหลังใน production scan
- `severity: ERROR` ทุก rule — alert fatigue; ให้ severity ตามผลกระทบจริง
- autofix ที่เปลี่ยน semantics (เช่น ลบ code ที่มี side effect) — autofix ต้อง behavior-preserving
- rule ภาษาเดียวแต่ไม่ระบุ `languages:` ชัดเจน — match ไฟล์อื่นที่ syntax คล้าย
- message ไม่บอกวิธีแก้ — developer เห็น finding แล้วไม่รู้ต้องทำอะไร; เขียน remediation hint ใน `message` เสมอ

## Do / Don't

| Do | Don't |
|----|-------|
| เขียน test ทั้ง positive (ต้อง match) และ negative (ต้องไม่ match) | commit rule ที่ไม่มี `semgrep --test` ผ่าน |
| ใช้ taint mode สำหรับ user-input → dangerous-sink | ใช้ pattern regex หลายชั้นเลียนแบบ dataflow |
| scope rule ด้วย `paths.include`/`paths.exclude` | รัน rule กับ generated/vendor code |
| เขียน `message` ที่บอกเหตุผลและวิธีแก้ | message สั้นๆ ที่อธิบายแค่ pattern |
| ใช้ `severity` สะท้อนความเสี่ยงจริง | mark ทุกอย่างเป็น ERROR |

## Config Guidance

- โครง rule YAML พื้นฐาน:
  ```yaml
  rules:
    - id: org.project.no-eval
      languages: [typescript]
      severity: ERROR
      message: "ห้ามใช้ eval — ใช้ JSON.parse หรือ safer alternative"
      metadata:
        category: security
        confidence: HIGH
      pattern: eval(...)
  ```
- ใช้ `rules:` array เดียวต่อไฟล์ แยกไฟล์ตาม domain (security, style, framework) เพื่อเลือกใช้เป็น ruleset
- registry rulesets (`p/security-audit` ฯลฯ) เป็น baseline — custom rules เติมสิ่งที่ registry ไม่ cover เช่น internal API misuse
- commit `.semgrepignore` (หรือ `paths.exclude` ใน config) เพื่อข้าม `dist/`, `node_modules/`, snapshots, generated code

## Performance & CI

- รัน `semgrep --test` ใน CI ทุกครั้งที่แก้ rule — rule regression ต้อง fail build
- จำกัด rule count ต่อ scan — rules เยอะ + ไฟล์เยอะ = scan ช้า; แยก ruleset ตาม CI stage ถ้าจำเป็น
- autofix (`--autofix`) ควรรัน local/manual เท่านั้น — ห้าม autofix ใน CI แล้ว commit อัตโนมัติโดยไม่ review
- taint rules ช้ากว่า pattern rules — รันเฉพาะบน paths ที่เกี่ยวข้อง
