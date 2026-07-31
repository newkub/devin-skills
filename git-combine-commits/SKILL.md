---
name: git-combine-commits
description: Skill: git-combine-commits
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'write', 'grep', 'glob', 'exec', 'ask_user_question']
---

- ผมต้องการรวม commit
  - `git log --oneline`
  - `git reset --soft HEAD~<number of commits to combine>`
  - `git commit -m "New commit message"`