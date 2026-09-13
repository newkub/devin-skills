# Issue To Solution Map

ตาราง map อาการ (symptom) ทั่วไปไปยัง skill หรือ workflow ทีควรใช้

| ถ้า (Issue) | ทำอย่างไร (Solution) |
|---|---|
| disk เต็ม / ใกล้เต็ม | `/cleanup-files-in-computer` หรือ `/uninstall-program-in-computer` หรือ `/follow-tool-mise` (`mise cleanup`) |
| memory leak / ใช้ RAM สูง | `/run-profiler` หรือ `/check-bottlenecks`; ถ้าต้องการให้ CI ตรวจ → `/setup-cicd` + `/run-verify` |
| CPU สูง / ช้าผิดปกติ | `/check-bottlenecks`, `/run-bench`, `/run-profiler` |
| build fail | `/run-build`, `/resolve-errors` |
| lint fail | `/run-lint`, `/resolve-errors` |
| typecheck fail | `/run-typecheck`, `/resolve-errors` |
| test fail / flaky | `/run-test`, `/run-test-all`, `/resolve-errors` |
| CI/CD pipeline fail | `/resolve-cicd`, `/resolve-errors github-actions`, `/setup-cicd` |
| deploy fail | `/resolve-cicd`, `/watch-deploy`, `/list-deployment-fails`, `/run-deploy`, `/deploy-to-cloudflare`, `/deploy-to-vercel` |
| secrets leak / สงสัย hardcoded secret | `/check-secrets secrets-leak`, `/follow-secret-manager`, `/open github secrets` |
| unused dependencies | `/check-repo-hygiene unused`, `/follow-tool-knip` |
| dead code / unused files | `/check-repo-hygiene unused` |
| circular dependencies | `/check-repo-hygiene circular-dependencies` |
| long files (>250 บรรทัด) | `/check-files long-files`, `/refactor` |
| code duplication | `/check-code-structure`, `/follow-tool-jscpd` |
| broken references / skill refs ขาด | `/check-skills-related`, `/update-references` |
| package manifest ไม่พร้อม publish | `/setup-package` |
| release workflow/config ขาด | `/setup-release`, `/follow-release` |
| TODO/MOCK/placeholder เหลือ | `/report-scan-todo`, `/implement-to-production` |
| dependencies outdated | `/update-version-to-latest`, `/follow-tool-taze` |
| ไฟล์/branch/worktree รก | `/run-cleanup`, `/cleanup-files-in-project`, `/cleanup git-branch`, `/cleanup worktree` |
| git conflict | `/resolve-merge-conflicts`, `/deep-debug` |
| workspace หลายอันไม่ตรงกัน | `/review-devin-global-harness`, `/sync-drive-d-submodules` |
| ไม่รู้ว่าควรใช้ skill ใด | `/search skills`, `/suggest-next-action`, `/ask-me` |
