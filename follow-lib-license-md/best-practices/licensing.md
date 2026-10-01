# License Management — เลือกและประกาศ License อย่างถูกต้อง

## Recommended Patterns

### เลือก License

- `MIT` เป็น default สำหรับ open source ทั่วไป — permissive, เข้าใจง่าย, ใช้ใน commercial ได้
- `Apache-2.0` เมื่อต้องการ patent grant ชัดเจน — เหมาะกับ corporate/enterprise contributions
- `GPL-3.0-only`/`AGPL` เมื่อต้องการ copyleft — derivatives ต้อง open source เหมือนกัน
- `BSD-3-Clause`, `ISC` permissive alternatives; `Unlicense` สำหรับ public domain
- private/unpublished project → ไม่สร้าง `LICENSE`, ใช้ `UNLICENSED` + `"private": true` ใน manifest

### Canonical License Text

- ดึงจาก GitHub Licenses API: `gh api licenses/{key} --jq .body` (เช่น `mit`, `apache-2.0`) — text ตรง canonical เสมอ
- หรือ copy จาก `https://choosealicense.com/licenses/{key}/`
- สร้างไฟล์ `LICENSE` ที่ root (ไม่มี extension) — GitHub/registry detect อัตโนมัติ
- แก้ copyright line: `Copyright (c) <year> <holder>` — ปีที่ publish, holder = ชื่อ owner/org

### Manifest Declaration

- `package.json` → `"license": "MIT"` (SPDX expression string เท่านั้น); dual: `"(MIT OR Apache-2.0)"`
- `pyproject.toml` → PEP 639: `license = "MIT"` + `license-files = ["LICENSE*"]` — ห้าม table แบบเก่า
- `Cargo.toml` → `license = "MIT"` หรือ `license-file = "LICENSE"` สำหรับ non-SPDX
- manifest value ต้องตรงกับ `LICENSE` file — mismatch ทำให้ audit tools เตือน

### Monorepo / Multi-package

- license เดียวกันทั้ง repo → `LICENSE` ที่ root + manifest แต่ละ package ใช้ SPDX เดียวกัน
- license ต่างกัน per package → `LICENSE` file ในแต่ละ package dir + manifest ของ package นั้น
- root `LICENSE` ไม่ override package manifests — แต่ละ package declare เอง

## Do / Don't

| Do | Don't |
|---|---|
| SPDX expression ใน manifest เสมอ | `licenses` array หรือ `license` object แบบเก่า (deprecated) |
| `LICENSE` ที่ root ไม่มี extension | `LICENSE.md`, `LICENSE.txt` (registry อาจไม่ detect) |
| sync manifest ↔ `LICENSE` file | `"license": "MIT"` แต่ file เป็น Apache |
| `UNLICENSED` + `"private": true` สำหรับ private | ปล่อย field ว่างหรือไม่ใส่ license เลย |
| ใช้ `gh api licenses/{key}` ดึง canonical text | copy license จาก repo อื่นแล้วปี/holder ผิด |
| เปลี่ยน license ระวัง — ต้อง consent จาก contributors หลัก | เปลี่ยน permissive → copyleft โดยไม่ review |

## Common Pitfalls

- ไม่มี `LICENSE` file + ไม่มี manifest field = all rights reserved — คนอื่นใช้ code ไม่ได้โดย default
- `"license": "MIT"` แต่ไม่มี `LICENSE` file → registry แสดง MIT แต่ legal text ไม่มี — ยังโอเคแต่ควรมี file
- `license` object แบบเก่า `{ "type": "MIT", "url": "..." }` — deprecated ใน package.json
- pyproject table `license = { text = "MIT" }` — deprecated ตาม PEP 639 ใช้ string
- copyright holder ผิด (ชื่อ template `[fullname]` ค้าง) — ต้องแก้ก่อน publish
- license ใน `LICENSE` กับ manifest ไม่ตรง → audit/license checker flag conflict

## Performance Notes

- ไม่ใช่ runtime concern — แต่ audit tools (`license-checker`, `license-md`) scan `LICENSE` + manifest ตรงกันทำให้ report สะอาด
- `license-files = ["LICENSE*"]` ใน pyproject glob รวม `LICENSE`, `LICENSE.txt`, `LICENSE.md` — wildcard ครอบคลุม variants

## Ecosystem / Integration

- `license-md` package เป็น badge generator เก่า (unmaintained) — ใช้ `gh api` + manifest fields โดยตรง
- GitHub detect license จาก `LICENSE` file อัตโนมัติ — แสดง badge ใน repo header
- npm/PyPI/crates.io อ่าน manifest `license` field — ต้อง SPDX expression ถึง filter/search ได้
- audit dependencies แยกต่างหาก — ใช้ `license-checker`, `cargo-deny`, `pip-licenses` — ไม่ใช่ scope ของ skill นี้
- `https://choosealicense.com` — decision tree เลือก license; `https://spdx.org/licenses` — SPDX ID reference
