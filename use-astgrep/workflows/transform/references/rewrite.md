---
title: ast-grep Rewrite — transform & rewriters
description: YAML transform/rewriters fields สำหรับ fix ที่ metavar replacement ธรรมดาทำไม่ได้
---

# ast-grep Rewrite Reference

Source: `https://ast-grep.github.io/guide/rewrite/transform` + `.../rewriter` (checked 2026-10-01)

ใช้เมื่อ `-r '<replacement>'` ธรรมดาไม่พอ — ต้องแปลง case, ตัด/ต่อข้อความ, ใส่ข้อความแบบมีเงื่อนไข หรือ rewrite sub-nodes หลายแบบใน match เดียว ทั้งหมดทำใน rule YAML ผ่าน `transform:` + `rewriters:`

## `transform` — แปลง metavariable ก่อนใส่ `fix`

`transform:` = dict — key = ชื่อ var ใหม่ (ไม่มี `$` นำหน้า), value = transformation object (หรือ string-style ตั้งแต่ `0.38.3`) — var ใหม่ใช้ใน `fix` หรือ transform ถัดไปได้ (chain)

| op | args | use |
|----|------|-----|
| `replace` | `source: $X`, `replace: <regex>`, `by: <text>` | regex replace; capture group `(?<NAME>.*)` อ้างใน `by` เป็น `$NAME` |
| `substring` | `source: $X`, `startChar`, `endChar` | ตัดหัว/ท้าย (`endChar: -1` = ตัดตัวสุดท้าย) |
| `convert` | `source: $X`, `toCase` | แปลง case — `camelCase`, `kebabCase`, `snake_case` ฯลฯ |
| `rewrite` | `source: $X`, `rewriters: [id...]`, `joinBy?` | apply rewriter rules กับ sub-nodes (ดูหัวข้อล่าง) |

String style (`0.38.3+` — ถ้า ast-grep เก่ากว่าใช้ object style):

```yaml
transform:
  NEW_VAR: replace($VAR_NAME, replace=regex, by=replacement)
  LIST: substring($GEN, startChar=1, endChar=-1)
  KEBABED: convert($OLD_FN, toCase=kebabCase)
```

### Limitations & Tricks

- regex capture groups ใช้ได้เฉพาะใน `replace` transform (`replace:` field) และอ้างได้เฉพาะใน `by:` ของ transform เดียวกัน — `regex` rule ธรรมดาไม่รองรับ capture groups
- concat metavar กับตัวพิมพ์ใหญ่ตรงๆ ไม่ได้ — `$REGRelease` ถูกตีเป็น var ชื่อ `REGRelease` → workaround: chain `convert`/`replace`
- Conditional text (DasSurma trick) — var มีค่าเฉพาะเมื่อ source match:

```yaml
rule: { pattern: $FUNC($$$ARGS) }
transform:
  MAYBE_COMMA:
    replace: { source: $$$ARGS, replace: '^.+', by: ', ' }
fix: $FUNC(new_argument$MAYBE_COMMA$$$ARGS)
```

`$$$ARGS` ว่าง → replace ไม่ทำงาน → `f(new_argument)`; มี args → `f(new_argument, ...old)`

### Chain Example — `fooDebug` → `fooRelease`

```yaml
rule: { pattern: $OLD_FN($$$ARGS) }
constraints: { OLD_FN: { regex: Debug$ } }
transform:
  KEBABED:   { convert: { source: $OLD_FN, toCase: kebabCase } }        # foo-debug
  RELEASED:  { replace: { source: $KEBABED, replace: '(?<ROOT>)-debug', by: '$ROOT-release' } }  # foo-release
  UNKEBABED: { convert: { source: $RELEASED, toCase: camelCase } }      # fooRelease
fix: $UNKEBABED($$$ARGS)
```

## `rewriters` — fix ต่างกันต่อ sub-node ใน match เดียว

`fix` ธรรมดาแทน matched node ทั้งก้อนทีละอัน — `rewriters` ให้ sub-nodes แต่ละตัวมี rule+fix ของตัวเอง แล้ว join กลับ

### 3 Steps

1. ประกาศ `rewriters:` list ที่ top level ของ rule file — แต่ละตัวต้องมี `id`, `rule`, `fix` (เพิ่ม `transform`/`constraints` ได้; ไม่มี `severity`/`message` — เฉพาะ Finding + Patching fields)
2. Apply ผ่าน `transform` → `rewrite: { rewriters: [id...], source: $VAR, joinBy? }`
3. ใช้ var ใหม่ใน `fix:`

### Example — `dict(a=1, b=2)` → `{'a': 1, 'b': 2}` (Python)

```yaml
rewriters:
- id: dict-rewrite
  rule:
    kind: keyword_argument
    all:
    - has: { field: name, pattern: $KEY }
    - has: { field: value, pattern: $VAL }
  fix: "'$KEY': $VAL"
rule: { pattern: dict($$$ARGS) }
transform:
  LITERAL:
    rewrite:
      rewriters: [dict-rewrite]
      source: $$$ARGS
fix: '{ $LITERAL }'
```

### Multiple Rewriters & Joiner

- `rewriters: [rewrite-num, rewrite-str]` — แต่ละ sub-node ใช้ตัวแรกที่ match → ลำดับใน list สำคัญ
- `joinBy: ' + '` — join transformed nodes ด้วย joiner แทน in-place replace (`1, 2, 3` → `integer + integer + integer`)

## Safety (เหมือน flow หลัก)

Dry run ก่อนเสมอ: `sg scan --rule <file>` list findings → `sg scan --rule <file> --fix` preview diff ทีละ change → user confirm → `--fix-all`
