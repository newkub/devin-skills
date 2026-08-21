---
name: run-cleanup
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

run task มีปัญหา ต้อง cleanup file ต่างๆ เช่น node_modules, dist, .nuxt, target และอื่นๆ ที่อยู่ใน .gitignore ตามตามเหมาะสมและให้เข้ากับภาษา
