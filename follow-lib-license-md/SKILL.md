---
name: follow-lib-license-md
description: เลือกและตั้งค่า license ด้วย SPDX identifier ให้ถูกต้องสำหรับ project
argument-hint: "[scope]"
related:
  - follow-agents-md
  - follow-package-manifest
  - publish-package-to-registry
  - update-readme-md
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ตั้งค่า `LICENSE` file และระบุ SPDX license identifier ใน package manifest ให้ถูกต้องและสอดคล้องกัน

## Scope

ใช้สำหรับ project ที่ต้องการ license file ที่ root directory และ declaration ใน package manifest (`package.json`, `pyproject.toml`, `Cargo.toml` ฯลฯ)

## Execute

### 1. Choose License

> Goal: เลือก license ที่เหมาะสมกับ project

1. เลือกจาก common licenses: `MIT`, `Apache-2.0`, `GPL-3.0-only`, `BSD-3-Clause`, `ISC`, `Unlicense`
2. ดูรายละเอียดที่ `https://choosealicense.com` และ SPDX ID เต็มที่ `https://spdx.org/licenses`
3. ถ้า contribute เข้า community ที่มี license อยู่แล้ว → ใช้ license เดียวกัน
4. ถ้าไม่แน่ใจ → ใช้ `MIT` เป็น default; ถ้า project เป็น private/ไม่เผยแพร่ → ไม่สร้าง `LICENSE` และใช้ `UNLICENSED` ใน manifest

### 2. Create License File

> Goal: สร้าง `LICENSE` file ที่ root directory

1. ดึง license text ที่ถูกต้องจาก GitHub Licenses API: `gh api licenses/{key} --jq .body` (เช่น `gh api licenses/mit`) หรือ copy จาก `https://choosealicense.com/licenses/{key}/`
2. สร้างไฟล์ `LICENSE` (ไม่มี extension) ที่ root
3. ระบุ copyright holder และปีให้ถูกต้อง ตัวอย่าง MIT:

```text
MIT License

Copyright (c) [year] [copyright holder]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 3. Update Package Manifest

> Goal: ระบุ license ใน manifest ด้วย SPDX expression ให้ตรงกับ `LICENSE` file

1. `package.json` — ใช้ SPDX expression string เท่านั้น:

```json
{ "license": "MIT" }
```

- หลาย license: `"license": "(MIT OR Apache-2.0)"`
- ไม่เผยแพร่: `"license": "UNLICENSED"` พร้อม `"private": true`
- ห้ามใช้ `licenses` array หรือ `license` object แบบเก่า (`{ "type": ..., "url": ... }`) — deprecated

2. `pyproject.toml` — ใช้ PEP 639 format (string + `license-files`):

```toml
[project]
license = "MIT"
license-files = ["LICENSE*"]
```

- ห้ามใช้ table แบบเก่า `license = { text = "MIT" }` หรือ `license = { file = "LICENSE" }` — deprecated ตาม PEP 639
- รองรับใน setuptools >=77.0.3, hatchling >=1.27.0, flit-core >=3.12, pdm-backend >=2.4.0, poetry-core >=2.2.0, uv-build >=0.7.19 — ถ้า build backend เก่ากว่านี้ให้อัปเกรดก่อน

3. `Cargo.toml` — ใช้ `license = "MIT"` (SPDX expression) หรือ `license-file = "LICENSE"` สำหรับ license ที่ไม่มีใน SPDX

4. ตรวจสอบว่าค่าใน manifest ตรงกับ `LICENSE` file

## Rules

- ใช้ `LICENSE` (ไม่มี extension) เป็นชื่อไฟล์ อยู่ที่ root directory
- ใช้ SPDX license identifier/expression เสมอ — ดู list ที่ `https://spdx.org/licenses`
- ระบุ copyright holder และปีให้ถูกต้อง
- ระบุ license ใน package manifest ให้ตรงกับ `LICENSE` file
- Project ที่ไม่มี license = ไม่มีสิทธิ์ใช้งานโดย default (ดู `https://choosealicense.com/no-permission/`)
- อ้างอิง `https://choosealicense.com` สำหรับเลือก license

- ใช้ `/follow-agents-md` ถ้าจำเป็น
- ใช้ `/follow-package-manifest` ถ้าจำเป็น
- ใช้ `/publish-package-to-registry` ถ้าจำเป็น
- ใช้ `/update-readme-md` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- `LICENSE` file อยู่ที่ root directory พร้อม license text ที่ถูกต้อง
- Copyright holder และปีถูกต้อง
- Package manifest ใช้ SPDX expression ตรงกับ `LICENSE` file
- ไม่มี deprecated license format (`licenses` array, `license` object, pyproject table) เหลืออยู่
