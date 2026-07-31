---
name: git
description: "แนวทางการใช้งาน Git สำหรับ version control และ collaborative development"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Git สำหรับ version control และ collaborative development


## Scope

ใช้สำหรับ track การเปลี่ยนแปลงของ code, ทำงานร่วมกับ team, version control, rollback การเปลี่ยนแปลง, และ code review ผ่าน pull requests


## Execute

### เริ่มต้น

- อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `key-concepts/repository.md` เพื่อเข้าใจ repository structure

### แนวคิดพื้นฐาน

- อ่าน `key-concepts/commit.md` สำหรับเข้าใจ commits
- อ่าน `key-concepts/branch.md` สำหรับ branching
- อ่าน `key-concepts/merge.md` สำหรับ merging
- อ่าน `key-concepts/staging-area.md` สำหรับ staging area
- อ่าน `key-concepts/head.md` สำหรับ HEAD reference
- อ่าน `key-concepts/remote.md` สำหรับ remotes

### Features ขั้นสูง

- อ่าน `key-concepts/rebase.md` และ `guide/rebase.md` สำหรับ rebase
- อ่าน `key-concepts/stash.md` และ `guide/stash.md` สำหรับ stash
- อ่าน `key-concepts/tag.md` และ `guide/tag.md` สำหรับ tags
- อ่าน `key-concepts/submodule.md` และ `guide/submodule.md` สำหรับ submodules
- อ่าน `key-concepts/reset.md` และ `guide/reset.md` สำหรับ reset
- อ่าน `key-concepts/checkout.md` และ `guide/checkout.md` สำหรับ checkout

### Advanced Features

- อ่าน `key-concepts/sparse-checkout.md` สำหรับ sparse checkout
- อ่าน `key-concepts/worktree.md` สำหรับ worktrees
- อ่าน `key-concepts/blame-grep-search.md` สำหรับ search tools

### Best Practices

- อ่าน `principles/atomic-commits.md` สำหรับ atomic commits
- อ่าน `principles/meaningful-messages.md` สำหรับ commit messages
- อ่าน `principles/branch-strategy.md` สำหรับ branch strategies
- อ่าน `principles/collaboration.md` สำหรับ collaboration
- อ่าน `principles/security.md` สำหรับ security
- อ่าน `guide/best-practices.md` สำหรับ best practices โดยรวม

### Workflows

- ใช้ `workflows/init-repository.md` สำหรับสร้าง repository ใหม่
- ใช้ `workflows/clone-repository.md` สำหรับ clone repository
- ใช้ `workflows/commit-changes.md` สำหรับ commit changes
- ใช้ `workflows/push-changes.md` สำหรับ push changes
- ใช้ `workflows/pull-changes.md` สำหรับ pull changes
- ใช้ `workflows/manage-branches.md` สำหรับจัดการ branches
- ใช้ `workflows/merge-branches.md` สำหรับ merge branches
- ใช้ `workflows/resolve-conflicts.md` สำหรับแก้ conflicts


## Rules

- ใช้ `git init` สำหรับ initialize
- ใช้ `git clone` สำหรับ clone
- ใช้ `git add` และ `git commit` สำหรับ commit
- ใช้ `git push` สำหรับ push
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Version control ที่ reliable
- Collaboration ที่ efficient
- Code history ที่ tracked
- Rollback ที่ safe
