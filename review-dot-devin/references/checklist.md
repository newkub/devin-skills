# review-dot-devin — Full Dimension Checklist

## 1. Directories

- [ ] `.devin/` structure: rules/, skills/, subagents/, hooks/ ตาม convention
- [ ] naming: kebab-case, no stray files
- [ ] no secrets/env files ใน `.devin/`

## 2. Hooks And Rules

- [ ] hooks executable, correct event bindings, fast
- [ ] always-on rules valid frontmatter + content
- [ ] ast-grep rules: sgconfig valid, rules test ผ่าน

## 3. AGENTS.md

- [ ] workspace AGENTS.md ครบ: commands, conventions, structure
- [ ] ตรงกับ global rules, no contradictions
- [ ] skills referenced มีอยู่จริง

## 4. Language And Content

- [ ] content language consistent กับ project convention
- [ ] no stale commands/versions/paths
- [ ] references ใน `.devin/` resolve ได้

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
