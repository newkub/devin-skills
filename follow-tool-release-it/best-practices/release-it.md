# release-it — Best Practices

Automated releases — version bump, changelog, tag, publish ในคำสั่งเดียว

## Recommended Patterns

- `.release-it.json` ที่ root — `git` (tag/commit), `npm` (publish), `github` (release notes), `hooks` sections
- Conventional commits + `@release-it/conventional-changelog` — auto changelog จาก commit history
- `git.tagName`/`git.commitMessage` templates consistent — `v${version}` convention
- `--dry-run` ก่อนจริงเสมอ — ตรวจ version bump + files ที่จะเปลี่ยน
- Hooks: `before:bump` (tests), `after:release` (post-release tasks) — fail fast ก่อน tag

## Common Pitfalls

- release-it รันจาก clean working tree — dirty tree = abort; commit ทุกอย่างก่อน
- npm publish needs auth — `npm whoami` ก่อน; CI ใช้ `NPM_TOKEN` env
- `--ci` mode ใน pipelines (no prompts); interactive ที่ local
- Changelog quality = commit quality — ขยะใน commits = ขยะใน changelog; squash merge discipline
- Major bumps: `release-it major` explicit — อย่า let auto-increment ตัดสิน breaking releases

## CI / Automation

- Workflow: version → changelog → commit → tag → GitHub release → npm publish — atomic sequence
- Pair กับ `/follow-tool-changesets` ใน monorepos — release-it เหมาะ single-package มากกว่า
- `github.release: true` + `releaseNotes` generated — attach artifacts ผ่าน hooks ถ้าต้องการ

## Do / Don't

| Do | Don't |
|----|-------|
| `--dry-run` ก่อนทุก release | blind releases |
| conventional commits → auto changelog | hand-edit CHANGELOG แล้ว generate ทับ |
| clean tree + tests pass ก่อน bump | release จาก dirty state |
| `--ci` non-interactive ใน pipelines | prompts ใน automation |
