---
name: resolve-github-actions-fails
argument-hint: "[--repo <owner/repo> | verify]"
description: ตรวจสอบและแก้ไข GitHub Actions workflow runs ทีล้มเหลวสำหรับ repo ปัจจุบันหรือ repo ทีระบุ
related:
  - resolve-errors
  - search
  - report
  - suggest-next-action
  - ask-me

---

## Goal

List GitHub Actions workflow runs ทีล้มเหลวสำหรับ project/repo ทีระบุ แล้ว resolve ให้หมด

## Scope

ใช้กับ repo ปัจจุบันหรือ repo ที user ระบุ ครอบคลุม public/private ตามสิทธิ์ `gh` token

- สำหรับ list fails ดู `references/list-fails.md`

## Execute

### Subskills

| Argument | Subskill |
|----------|----------|
| `verify`, `verify-resolved` | `subskills/verify-resolved/SKILL.md` — watch run ใหม่จนจบ ยืนยัน success บน remote |

1. ถ้า argument เป็น `verify` → อ่าน `subskills/verify-resolved/SKILL.md` แล้วทำตาม flow — ไม่ resolve ใหม่
2. ถ้าไม่ระบุ → ทำ Steps 1-8 ตามปกติ

### 1. Verify gh CLI

> Goal: ยืนยันว่า `gh` พร้อมและ authenticated
1. รัน `gh --version`
2. รัน `gh auth status`
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `gh auth login`
4. บันทึก username

### 2. Identify Repo

> Goal: ระบุ repo ทีจะ resolve
1. ถ้ามี `--repo` → ใช้ค่านั้น
2. ถ้าไม่มี → ใช้ `gh repo view --json nameWithOwner` หรือ `git remote -v` จาก current directory
3. ถ้าหา repo ไม่พบ → ทำ `/ask-me` เพื่อให้ user ระบุ

### 3. List Failed Runs

> Goal: หา workflow runs ทีล้มเหลวใน repo นั้น
1. รัน `gh run list --repo <owner/repo> --status failure --limit 30`
2. รับรายการ: workflow, branch, commit, event, started at, url
3. ถ้าไม่มี failures → report ว่างานเสร็จแล้ว stop

### 4. Analyze Logs

> Goal: หา root cause ของแต่ละ failure
1. สำหรับแต่ละ failed run รัน `gh run view <run-id> --repo <owner/repo> --log-failed`
2. หรือดู log จาก URL ทีได้
3. บันทึกข้อผิดพลาดหลักของแต่ละ run

### 5. Resolve Each Failure

> Goal: แก้ไข workflow failures
1. ถ้าเป้น transient/error เดิม → รัน `gh run rerun <run-id> --repo <owner/repo>`
2. ถ้าเป้น issue ที fix ได้ด้วย code change → ทำ `/resolve-errors` แล้วให้ user ตัดสินใจ commit/push
3. หา local project ด้วย `/search-project-in-drive-d <repo-name>` ถ้าต้องการ code fix
4. ถ้าเป้น config/secret issue → แนะนำให้ user ตรวจ `.github/workflows/` หรือ repository settings
5. รอผล rerun ถ้ามี และ recheck
6. ทำซ้ำสูงสุด 3 รอบต่อ run
7. ถ้า resolve ไม่ได้ → ทำเครื่องหมาย `manual-fix-required`

### 6. Watch Run Real-time

> Goal: ติดตาม run แบบ real-time จนกว่าจะจบ
1. รัน `gh run watch <run-id> --repo <owner/repo>` เพื่อติดตามแบบ real-time
2. ถ้า `gh run watch` ค้างหรือ timeout → รัน `gh run view <run-id>` เพื่อตรวจสอบสถานะแทน
3. ถ้า run ล้มเหลว → กลับไปขั้นตอน Analyze Logs และ resolve ต่อ
4. loop จนกว่าทุก workflow ผ่าน — สูงสุด 5 รอบ ถ้ายังไม่ผ่าน → หยุดและรายงานสถานะ
5. ก่อน push fix ให้บันทึก last green SHA ด้วย `git rev-parse HEAD`
6. ถ้า fix round ≥ 3 และสร้าง failure ใหม่ → `git revert` กลับไป last green SHA

### 7. Delete Failed Runs

> Goal: ลบ workflow runs ที fail ออกจาก repo
1. หลัง resolve/re-run เสร็จ ให้ลบ failed runs ทีเหลือด้วย `gh run delete <run-id> --repo <owner/repo>` หรือ `/delete-cicd-fails`
2. ลบทั้ง runs ที resolve แล้ว (superseded) และ runs ทียัง fail — ไม่คง run แดงค้างไว้
3. ถ้าจำนวน runs ทีจะลบ > 5 → ทำ `/ask-me` เพื่อยืนยันก่อนลบทีเดียว
4. บันทึก last green SHA ก่อนลบ เพื่อให้ rollback/วิเคราะห์ย้อนหลังได้

### 8. Build Report

> Goal: สรุปผลเป็นตาราง
1. รวมผลจาก repo ทีระบุ
2. ใช้ `/report` คอลัมน์: No., Workflow, Branch, Commit, Event, Started At, Status After Resolve, Deleted, Notes
3. เรียงตาม Started At ล่าสุด
4. ระบุสรุป: จำนวน failures ทั้งหมด, ที resolve ได้, ทีถูกลบ, ทีค้าง manual-fix-required

### 9. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป
1. ทำ `/suggest-next-action` เพื่อแนะนำ fix workflow, view logs, หรือ `/resolve-cicd`

## Rules

### 1. Safety
- ถาม user ก่อน rerun ถ้าจำนวน failures เยอะหรือกระทบ production
- ไม่ push หรือ merge code โดยอัตโนมัติ
- ไม่แก้ไข workflow files โดยไม่ได้รับอนุญาต

### 2. Rate Limit And Scope
- ใช้ pagination `--limit` และ `--page`
- ถ้า `gh` ถูก rate limit → รอและ retry

### 3. Local Project Matching
- ใช้ `/search-project-in-drive-d` เมื่อต้องหา local repo เพื่อ code fix
- ถ้าไม่พบ local repo → แนะนำ user แก้ไขเอง

### 4. Privacy
- รองรับ public/private repositories ตามสิทธิ์ของ `gh` token
- ไม่ expose secrets หรือ tokens ใน output

### 5. Account-wide
- ถ้า user ต้องการ resolve ทั่วทุก repo → ใช้ `/resolve-all-github-actions-fails` แทน (skill นี้ทำทีละ repo)

### 6. Watch Timeouts
- `perRoundTimeout` = `120` วินาที สำหรับแต่ละรอบ fix-and-push
- `ghRunWatchTimeout` = `300` วินาที สำหรับ `gh run watch`
- หยุดทันทีเมื่อ user กด `Ctrl+C` — บันทึกสถานะ run ก่อนหยุด

### 7. Push Failure Handling
- ถ้า `git push` ล้มเหลวเพราะ merge conflict → `git pull --rebase` แล้ว push ใหม่
- ถ้า `git push` ล้มเหลวเพราะ branch protection → ทำ `/ask-me`
- ถ้า `git push` ล้มเหลวเพราะ network → retry สูงสุด `3` ครั้ง

### 8. Delete Failed Runs
- Default: ลบ runs ที fail หลัง resolve เสร็จ (`gh run delete` หรือ `/delete-cicd-fails`) — ดู Step 7
- บันทึก last green SHA ก่อนลบเสมอ เพื่อให้ post-incident analysis/rollback ได้
- ถ้าจำนวนมาก (>5 runs) หรือเป็น production repo → ทำ `/ask-me` ยืนยันก่อนลบ

## Expected Outcome

- รายการ GitHub Actions runs ทีล้มเหลวพร้อมสถานะหลัง resolve สำหรับ repo ทีระบุ
- ตารางที sort ตามวันที failure เกิด
- ข้อมูล workflow, branch, commit, url, action taken พร้อม
- ไม่มีการ push/merge หรือแก้ไข repo โดยไม่ได้รับอนุญาต

- ใช้ใน `git-push` ด้วย; account-wide scope อยู่ที่ `/resolve-all-github-actions-fails`

