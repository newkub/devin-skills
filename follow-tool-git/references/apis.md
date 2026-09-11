# Tool Git API & Dependencies

## Install

```sh
# Git เป็น system tool — ไม่ใช่ npm package
winget install Git.Git
# or
scoop install git
# or mise use -g git
```

หมายเหตุ: npm package `git` เป็น library เก่าที่ไม่เกี่ยวกับ Git CLI — อย่าติดตั้ง

## Version

- Latest stable: `2.51.x` (ตรวจ `git --version` หรือ https://git-scm.com/downloads)
- [Website](https://git-scm.com)
- [Repository](https://github.com/git/git)

## Dependencies

- System binary — ไม่มี npm transitive dependencies
- JS libraries สำหรับ programmatic access: `simple-git` (`bun add simple-git`), `isomorphic-git` (`bun add isomorphic-git`)

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `git init` | Initialize repo | current dir | --bare |
| `git clone` | Clone repo | - | --depth, --branch |
| `git add` / `git commit` | Stage & commit | - | -a, -m, --amend |
| `git push` / `git pull` | Sync remote | origin | -u, --force-with-lease |
| `git worktree` | Parallel worktrees | - | add, list, remove |

## Source

- Official docs: https://git-scm.com/doc
- Description: Distributed version control system.
