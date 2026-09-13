# Swarm Plan

## Goal

แตก ship work เป็น lanes ที่ทำขนานกันได้โดยไม่ชนกัน — กฎหลักคือ **lane = file ownership** ไม่ให้ 2 lanes แก้ไฟล์เดียวกัน

## Decomposition Steps

1. ระบุงานทั้งหมดที่ `/ship` ต้องทำจาก `AGENTS.md` และ scope ปัจจุบัน
2. map แต่ละงานไปยัง files/directories ที่แตะ — ใช้ `/search-by-astgrep` หา symbols และ call sites
3. จัดกลุ่มเป็น lanes โดย file ownership ไม่ซ้ำกัน
4. ถ้า 2 งานแตะไฟล์เดียวกัน → รวมเป็น lane เดียวหรือทำ sequential phase
5. กำหนด deliverable และ acceptance criteria ต่อ lane

## Dependency Graph

- lane ที่ต้องการ output ของ lane อื่น → sequential phase ไม่ใช่ parallel
- ตัวอย่าง: `fix-code` lane ต้องจบก่อน `verify` lane — แต่ `docs` lane ทำขนาน `verify` ได้

## Preflight

ก่อน fan-out ตรวจด้วย script เดียว (ตาม `/use-scripts`):

```powershell
# git clean, deps พร้อม, env vars ครบ, build tools ใช้ได้
git status --porcelain
bun install --frozen-lockfile  # หรือตาม ecosystem
```

- git ต้อง clean หรือ staged เท่านั้น — ห้ามมี uncommitted half-work
- deps ต้อง install แล้ว — subagent ไม่ควร `install` เอง
- env vars ที่ lanes ต้องใช้ต้องพร้อม

## Lane Template

```
lane: <name>
files: <glob หรือ dirs ที่เป็นเจ้าของ>
deliverable: <ผลลัพธ์ที่วัดได้>
acceptance: <เงื่อนไขผ่าน>
mode: subagent | script | parallel-calls
```
