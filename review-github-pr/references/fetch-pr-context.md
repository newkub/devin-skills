# Fetch PR Context

## Goal

รวบรวมข้อมูล PR ทั้งหมด

## Checks

1. ถ้ามี PR number → รัน `gh pr view <pr>` และ `gh pr diff <pr>` — ถ้าไม่มี → รัน `git diff <base>..<head>` และ `git log --oneline <base>..<head>`
2. บันทึกข้อมูล: title, description, author, base branch, commits, files changed, additions/deletions, labels, checks
3. ระบุ domain ของ PR: frontend, backend, infrastructure, docs, config, test, library
4. ถ้าใช้ GitHub → รัน `gh pr checks <pr>` เพื่อดูสถานะ CI
