# review-docs — Full Dimension Checklist

## 1. USAGE.md Structure

- [ ] sections ครบ: installation, usage, commands, options, examples
- [ ] heading hierarchy, TOC ถ้ายาว

## 2. Content

- [ ] examples runnable, copy-paste safe
- [ ] common workflows documented end-to-end
- [ ] error/troubleshooting section

## 3. Consistency

- [ ] ตรงกับ README, package.json, actual code behavior
- [ ] flags/commands ตรงกับ `--help` output จริง
- [ ] versions/paths/commands current

## 4. Formatting

- [ ] code fences, table format, link validity
- [ ] consistent style, scannable

## 5. usage.kdl Spec (merged: review-app-usage)

- [ ] syntax valid, metadata complete
- [ ] flags/args/commands coverage vs actual CLI (references/usage-kdl-*.md)
- [ ] generated USAGE.md freshness vs spec

## Scoring

- ตาม references/scoring.md; grade A (90+), B (80+), C (70+), D (60+), F (<60)
