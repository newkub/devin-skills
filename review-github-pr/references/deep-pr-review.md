# Deep PR Review

(merged from: deep-review-pr)

ใช้เมื่อต้อง review PR แบบละเอียด — ตอบ comments, resolve conversations, และถาม user ก่อน merge

## Execute

### 1. Reply To Comments

> Goal: ตอบ comments ใน PR

1. อ่านทุก comment ที่ยังไม่ resolve
2. ตอบตาม context:
   - ถ้า comment ถูก แก้ code แล้ว → comment สั้นๆ พร้อม commit SHA
   - ถ้า comment ต้องการอธิบาย → ตอบด้วย evidence
   - ถ้า comment เป็น false positive → ชี้แจง
3. ใช้ `gh pr review <pr-number> --comment` ตอบ
4. ใช้ `gh api repos/{owner}/{repo}/pulls/comments/{id}/replies` ถ้าจำเป็น

### 2. Resolve Findings

> Goal: แก้ issues ที่พบ

1. ถ้ามี changes ต้องทำ → implement ตาม severity
2. ทำ `/run-check`, `/run-test-unit` หลังแก้
3. ทำ `/git-push` ไม่ force
4. ถ้า commits บน PR branch รก → ทำ `/refactor-commit` ก่อน push หรือ merge
5. เปิด web ให้ user ดู diff หรือ PR

### 3. Ask To Merge

> Goal: ให้ user ตัดสินใจ merge

1. สรุป findings + resolved comments
2. ทำ `/open-web` เปิด PR
3. ถาม user ว่าจะ merge ไหม
4. ถ้าใช่ → ทำ `/merge-github-pr` หรือ `gh pr merge`
5. ถ้าไม่ → report next actions

## Rules

- ไม่ merge เองถ้าไม่ได้ user บอก
- ต้อง resolve ทุก conversation ก่อน merge
- ต้องมี CI ผ่านก่อน merge
- ถ้ามี change ต้อง push กลับ PR branch
- ใช้ evidence ในการตอบ comment
