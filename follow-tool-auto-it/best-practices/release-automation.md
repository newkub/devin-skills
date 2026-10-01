# Auto Best Practices

แนวทางใช้ `auto` (intuit/auto) สำหรับ automated releases — label-driven versioning, config, tokens และ CI workflow

## Recommended Patterns

### Label-Driven Versioning

- Auto คำนวณ semver bump จาก PR labels (default: `major`, `minor`, `patch`) ไม่ใช่จาก commit message — สอนทีมให้ติด label ทุก PR ที่ต้องการ release
- ใช้ label `skip-release` หรือ `internal`/`documentation` สำหรับ PR ที่ไม่ควร trigger release (config ผ่าน `labels` section ใน `.autorc`)
- เปิด required-labels check ใน CI (`auto pr-check` หรือ GitHub Action equivalent) เพื่อบังคับว่าทุก PR มี version label ก่อน merge
- PR ที่ไม่มี version label จะถือว่าไม่ bump — ถ้าหลาย PR merge แล้วไม่มี label เลย `shipit` จะ skip release (ไม่ใช่ error)

### Config Structure

- เก็บ config ใน `.autorc` แยกไฟล์เมื่อ options ยาว — `package.json` `auto` field เหมาะกับ config สั้นๆ
- ระบุ `author` เสมอ (name + email) — Auto ใช้ commit changelog/tag; ถ้าไม่มีจะ fail ตอน release
- ตั้ง `baseBranch` ให้ตรงกับ branch จริง (`main`/`master`) — mismatch ทำให้ `shipit` คำนวณ diff ผิด
- ใช้ `onlyPublishWithReleaseLabel: true` เมื่อต้องการให้ merge ได้โดยไม่ release จนกว่าจะติด `release` label — เหมาะกับ batching

### Plugins

- `released` plugin: comment กลับบน PR/issues ว่าออกใน version ไหน — เปิดไว้เสมอเพื่อ traceability
- `conventional-commits` plugin: parse commit messages เพิ่ม label อัตโนมัติ — ใช้เป็น safety net แต่ labels ยังเป็น source of truth
- `npm` plugin เป็น default สำหรับ JS packages — ระบุ `subPackageChangelogs` สำหรับ monorepo ถ้าใช้
- เลือก plugins น้อยที่สุดที่ครบ — แต่ละ plugin เพิ่ม surface ที่ต้อง maintain

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| ไม่มี `author` ใน config | release commit fail | เพิ่ม `author` ใน `.autorc` หรือ `package.json` |
| คาดว่า commit `feat:` จะ bump เอง | merge แล้วไม่มี release | Auto อ่าน labels ไม่ใช่ commits — ติด label หรือใช้ conventional-commits plugin |
| Workflow ไม่มี `permissions` | push tag/release fail 403 | `contents: write` + `pull-requests: write` ใน workflow |
| `fetch-depth` shallow | changelog ขาด commits | `actions/checkout` ต้อง `fetch-depth: 0` |
| Fork PR รัน release job | secrets ไม่ถูก inject | release job ต้อง trigger เฉพาะ push ไป base branch ไม่ใช่ `pull_request` |
| NPM_TOKEN เป็น Publish token แต่ 2FA บังคับ | publish fail | ใช้ Automation token หรือ granular token ที่ bypass 2FA |
| Scoped package แรก | publish fail 404 | publish ครั้งแรกด้วยมือ `--access public` หรือตั้ง `publishConfig` |
| Release ซ้ำเมื่อ re-run job | duplicate tag error | ป้องกันด้วย `concurrency` และเช็ค tag ก่อน publish |

## Do / Don't

| Do | Don't |
|---|---|
| เพิ่ม pr-check step บังคับ version label | ปล่อยให้ PR merge โดยไม่มี label |
| ใช้ prerelease branches (`next`, `beta`) กับ `auto shipit` ที่ branch นั้น | ส่ง prerelease จาก main โดยตรง |
| เก็บ tokens ใน repo secrets ผ่าน `/follow-secret-manager` | hardcode `GH_TOKEN`/`NPM_TOKEN` ใน workflow file |
| review generated CHANGELOG ใน release PR | แก้ CHANGELOG มือหลัง auto generate (จะ conflict รอบถัดไป) |
| ใช้ `--dry-run`/`auto shipit --dry-run` ก่อน setup เสร็จ | ยิง release จริงครั้งแรกโดยไม่ทดสอบ |
| lock action versions และ pin workflow trigger | รัน release job บนหลาย events พร้อมกัน |

## Performance And CI Notes

- Release job เบา — ไม่ต้อง build matrix หรือ cache dependencies หนัก; `bun install` พอสำหรับ run `auto shipit`
- ใช้ `concurrency: release-${{ github.ref }}` ป้องกัน double-release เมื่อ push เร็วติดกัน
- แยก release workflow จาก test workflow — release ควร trigger หลัง CI ผ่าน (ใช้ `workflow_run` หรือ branch protection) ไม่ใช่แข่งกัน
- `auto shipit` ทั้ง bump+changelog+tag+release+publish ในคำสั่งเดียว — ถ้าต้องการแยกขั้นใช้ `auto version`, `auto changelog`, `auto publish` แทน
- Label check (`auto pr-check`) รันเร็ว ใส่ใน PR workflow ได้โดยไม่กระทบเวลา CI

## Config Guidance

`.autorc` ตัวอย่างที่สมดุล:

```json
{
  "baseBranch": "main",
  "author": "team-bot <bot@example.com>",
  "labels": [
    { "name": "major", "releaseType": "major" },
    { "name": "minor", "releaseType": "minor" },
    { "name": "patch", "releaseType": "patch" },
    { "name": "skip-release", "releaseType": "skip" },
    { "name": "internal", "releaseType": "none" }
  ],
  "plugins": ["released", "conventional-commits"]
}
```

- ใช้ `auto info` เพื่อ verify config ถูก load และ tokens พร้อม
- Document label taxonomy ใน `CONTRIBUTING.md` — contributor ต้องรู้ว่า label ไหนทำอะไร
- สำหรับ canary releases จาก PR: `auto canary` ใน PR workflow (ไม่ใช้ NPM_TOKEN scope เดียวกับ production)
