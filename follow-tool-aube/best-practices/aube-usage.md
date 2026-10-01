# Aube Best Practices

แนวทางใช้ Aube เป็น Node.js package manager อย่างถูกต้อง — command selection, security posture, lockfile และ CI

## Recommended Patterns

### Command Selection

- `aubr <script>` เมื่อ script ต้องการ `node_modules` ที่ติดตั้งแล้ว (test, build, dev, lint) — auto-install ทำงานก่อนรันเสมอ
- `aubx <tool>` สำหรับ one-off tool ที่ resolve ได้โดยไม่ต้อง install ทั้ง project (เช่น `aubx tsc --noEmit` ชั่วคราว)
- `aube exec <bin>` เมื่อต้องการ binary จาก `node_modules/.bin` ของ project ปัจจุบันโดยตรง — deterministic กว่า `aubx` สำหรับ tools ที่เป็น dependency อยู่แล้ว
- `aube add`/`remove`/`update` สำหรับ dependency lifecycle — อย่าแก้ `package.json` มือแล้วลืม lockfile ให้ aube จัดการคู่กัน

### Lockfile Strategy

- เลือก lockfile เดียวต่อ repo — ถ้ามีทั้ง `package-lock.json` และ `pnpm-lock.yaml` ปนกัน resolution จะไม่ deterministic ให้เก็บตัวที่ทีมใช้จริงแล้วลบตัวอื่น
- commit lockfile เสมอ — Aube อ่าน/เขียน in place จึงไม่ต้อง migrate แต่ lockfile คือ source of truth ของ resolution
- หลัง `aube update` ให้ review lockfile diff ใน PR — auto-install ที่เงียบเกินไปทำให้ dependency drift โดยไม่รู้ตัว

### Security Posture

- เปิด `paranoid: true` ใน `aube-workspace.yaml` สำหรับ production projects และ repos ที่รับ PR จากภายนอก
- Review lifecycle scripts ทุกครั้งก่อน `aube approve-builds` — lifecycle script คือ code execution ตอน install
- ใช้ `allowBuilds` allowlist เฉพาะ package ที่จำเป็นจริง (เช่น native modules) ไม่ใช่เปิดทั้งหมด
- อย่าข้าม near-zero-download prompt โดยไม่ดูชื่อ package — supply-chain attack ชอบ typosquat ที่ยังไม่มี downloads

### Workspace

- ใช้ `aube -r run <script>` สำหรับรันทุก package และ `aube -F '<pattern>' run <script>` เมื่อ scope ชัดเจน — filter ช่วยลดเวลา CI มาก
- Global content-addressable store แชร์ข้าม projects อยู่แล้ว — อย่าลบ `node_modules` ทิ้งบ่อยโดยไม่จำเป็นเพราะ relink ถูกกว่า reinstall

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| ติดตั้งผ่าน npm แล้ว version เก่า | features ใหม่ไม่มี | npm dist-tag lag — ใช้ `mise use -g aube` หรือ `cargo install aube --locked` |
| หลาย lockfile ใน repo เดียว | resolution แกว่ง | เก็บ lockfile เดียว ลบที่เหลือ |
| auto-install ใน read-only env | run script fail หรือช้า | ใน CI ที่ lock deps แล้วให้ install ล่วงหน้าหรือใช้ `aubx` กับ tools ที่ไม่ต้องการ tree |
| approve builds ทั้งหมด | supply-chain risk | `aube approve-builds` ทีละตัว + เก็บ allowlist ใน config |
| คิดว่า `aubx` = `aube exec` | tool version ผิด | `aubx` fetch/run ad-hoc, `aube exec` ใช้ local installed bin เท่านั้น |

## Do / Don't

| Do | Don't |
|---|---|
| `aubr test` ให้ auto-install จัดการ | `aube install` มือทุกครั้งก่อนรัน script |
| commit `aube-workspace.yaml` กับ `paranoid: true` | ปิด security defaults เพราะ prompt รบกวน |
| review lockfile diff หลัง update | merge auto-update โดยไม่ดู transitive changes |
| filter workspace ด้วย `-F` ใน CI | รัน `-r` ทั้ง monorepoเมื่อแก้ package เดียว |
| pin install method ในทีม (mise/brew/cargo) | ให้สมาชิกทีมติดตั้งคนละช่องทางจน version ต่างกัน |

## Performance And CI Notes

- Auto-install เช็ค freshness ก่อน — repeat `aubr` runs เร็วเพราะ skip install เมื่อ lockfile ไม่เปลี่ยน อย่าเพิ่ม install step ซ้ำใน CI
- GitHub Actions: `jdx/aube-action` ติดตั้งและ cache ให้ — ใช้คู่กับ `aubr test` โดยไม่ต้อง `bun install` แยก
- Cache global store ระหว่าง CI runs (key ตาม lockfile hash) เพื่อตัดเวลา resolve+link
- Trust downgrades fail at resolve โดย default — ถ้า CI เริ่ม fail หลัง publish ใหม่ของ upstream ให้เช็คว่าเป็น cooling window (24h) ไม่ใช่ bug
- Script ที่เรียก `aubr` ซ้อน `aubr` ทำให้ freshness check รันซ้ำ — ภายใน script เดียวกันใช้ `aube exec` ต่อกันแทน

## Config Guidance

`aube-workspace.yaml` ที่แนะนำ:

```yaml
paranoid: true          # สำหรับ production / public repos
allowBuilds:            # lifecycle scripts ที่ approve แล้วเท่านั้น
  - esbuild
  - sharp
```

- เก็บ config ไว้ที่ workspace root เดียว — nested configs ทำให้ security posture ไม่สม่ำเสมอ
- Document เหตุผลของแต่ละ `allowBuilds` entry ใน comment — auditor จะได้เข้าใจว่าทำไมต้องรัน native build
- ถ้า migrate จาก pnpm/npm: เก็บ lockfile เดิมให้ Aube ใช้ต่อ แล้วค่อยเพิ่ม security knobs ทีละตัว
