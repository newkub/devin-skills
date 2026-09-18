---
title: ast-grep Pattern Catalog
description: Ready-to-use AST patterns for common batch refactors per language
---

# ast-grep Pattern Catalog

Patterns พร้อมใช้ — ปรับ `$VAR`/`$$$ARGS` ตามจริง; metavar: `$X` = single node, `$$$` = zero-or-more nodes

## TypeScript / JavaScript (`--lang ts` / `--lang js`)

| Refactor | Pattern | Replacement | Caveat |
|----------|---------|-------------|--------|
| Remove console.log | `console.log($$$ARGS)` | (ว่าง — ใช้ `-r ''`) | ระวัง `logger.console.log` — scope ด้วย `inside` rule ถ้าจำเป็น |
| API/method rename | `$OBJ.$OLD($$$ARGS)` | `$OBJ.$NEW($$$ARGS)` | ตั้ง `$OLD`/`$NEW` ตามจริง เช่น `.substr(` → `.slice(` |
| `==` → `===` | `$A == $B` | `$A === $B` | อาจ match `==` ที่ตั้งใจ (null check idiom) — interactive mode |
| require → import | `const $X = require($P)` | `import $X from $P` | named destructuring require ต้อง pattern แยก |
| `var` → `let` | `var $X = $V` | `let $X = $V` | const/let แยกไม่ได้ด้วย pattern เดียว — เลือก `let` ปลอดภัยกว่า |
| function → arrow | `function $N($$$P) { $$$B }` | `const $N = ($$$P) => { $$$B }` | ห้ามใช้กับ function ที่อาศัย `this`/hoisting |
| `&&` → optional chain | `$A && $A.$B` | `$A?.$B` | match `$A` ซ้ำต้องเป็น node เดียวกัน — ast-grep เทียบให้ |
| parseInt → Number.parseInt | `parseInt($A)` | `Number.parseInt($A)` | ใส่ radix ด้วยถ้าเดิมมี: `parseInt($A, $R)` → `Number.parseInt($A, $R)` |

## Rust (`--lang rust`)

| Refactor | Pattern | Replacement | Caveat |
|----------|---------|-------------|--------|
| `vec![]` → `Vec::new()` | `vec![]` | `Vec::new()` | `vec![0; n]` ไม่ match — ปลอดภัย |
| inline format args | `format!("{}", $A)` | `format!("{$A}")` | เฉพาะ arg เดียว — หลาย args ใช้ rule YAML |
| `match` → `if let` | `match $X { Some($V) => $B, None => () }` | `if let Some($V) = $X { $B }` | `None => ()` ต้องตรงเป๊ะ |
| `.clone()` หลัง to_owned | `.to_string().clone()` | `.to_string()` | เจอจาก clippy warning ก่อน |
| find unwraps (report-only) | `$X.unwrap()` | — | ใช้หาเฉยๆ ไม่ rewrite — `expect` msg ต้องคิดเอง |
| `&format!()` เป็น arg | `&format!($$$)` | `format!($$$).as_str()` | ตรวจ type context ก่อน |

## Python (`--lang python`)

| Refactor | Pattern | Replacement | Caveat |
|----------|---------|-------------|--------|
| `len(x) == 0` → falsy | `len($X) == 0` | `not $X` | ใช้ใน `if`/`while` context เท่านั้น |
| bare except | `except:` | `except Exception:` | pattern ภาษาไวยากรณ์ — ทดสอบก่อน |
| `for k in d.keys()` | `for $K in $D.keys():` | `for $K in $D:` | dict เท่านั้น — set/list ไม่มี .keys() |
| `x == True` | `$X == True` | `$X` | `is True` ตั้งใจก็โดน — interactive |
| `%` → f-string | `"%s" % $A` | `f"{$A}"` | หลาย %s ต้อง rule ซับซ้อน — เหมาะเคสเดียว |
| print py2→py3 | `print $X` | `print($X)` | py2 files เท่านั้น |

## Go (`--lang go`)

| Refactor | Pattern | Replacement | Caveat |
|----------|---------|-------------|--------|
| `interface{}` → `any` | `interface{}` | `any` | go1.18+ เท่านั้น |
| `errors.New(fmt.Sprintf)` | `errors.New(fmt.Sprintf($$$A))` | `fmt.Errorf($$$A)` | ต้องมี `%` verb — ไม่มีก็ `errors.New(fmt.Sprint)` |
| ioutil deprecated | `ioutil.$F($$$A)` | (mapping ตาราง: ReadFile→os.ReadFile, ReadAll→io.ReadAll, WriteFile→os.WriteFile) | ทีละ pattern — ตาราง deprecated ใน Go 1.16 |
| `x = append(x)` style check | — | — | ใช้หาเฉยๆ |

## Rule YAML (เมื่อ pattern เดียวไม่พอ)

ใช้เมื่อต้อง constraints: kind, regex, inside, has, precedes, follows:

```yaml
# sg-rules/remove-debug.yml — ลบ console.log เฉพาะใน src/ ไม่รวม logger wrapper
id: remove-console-log
language: TypeScript
rule:
  pattern: console.log($$$ARGS)
  inside:
    pattern: function $F($$$P) { $$$B }
fix: ''
```

รัน: `sg scan --rule sg-rules/remove-debug.yml --fix` (interactive) หรือ `--fix-all`

## Tips

- ทดสอบ pattern ด้วย `sg run -p '<pattern>' <file>` บนไฟล์เดียวก่อน scope กว้าง
- `$$$` หน้า/หลัง args list เก็บ trailing comma/whitespace ให้อัตโนมัติ
- replacement ต้องใช้ metavar ที่ pattern capture จริง — ชื่อใหม่ที่ไม่ได้ capture = literal text
- escape `$` ใน pattern เป็น `$$` ถ้าต้องการ literal dollar (เช่น template literal `${x}`)
