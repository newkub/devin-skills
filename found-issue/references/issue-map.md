# Issue To Solution Map

ตาราง map อาการ (symptom) ทั่วไปไปยัง skill หรือ workflow ทีควรใช้

| ถ้า (Issue) | ทำอย่างไร (Solution) |
|---|---|
| disk เต็ม / ใกล้เต็ม | `/cleanup-files-in-computer` หรือ `/uninstall-program-in-computer` หรือ `/follow-tool-mise` (`mise cleanup`) |
| memory leak / ใช้ RAM สูง | `/run-profiler` หรือ `/check-bottlenecks`; ถ้าต้องการให้ CI ตรวจ → `/setup-ci-cd` + `/run-verify` |
| CPU สูง / ช้าผิดปกติ | `/check-bottlenecks`, `/run-bench`, `/run-profiler` |
| build fail | `/run-build`, `/watch-build`, `/resolve-errors` |
| lint fail | `/run-lint`, `/watch-lint`, `/resolve-errors` |
| typecheck fail | `/run-typecheck`, `/resolve-errors` |
| test fail / flaky | `/run-test`, `/watch-test`, `/run-test-all`, `/resolve-errors` |
| CI/CD pipeline fail | `/watch-ci-and-resolve`, `/watch-github-actions`, `/list-github-action-fail`, `/setup-ci-cd` |
| deploy fail | `/watch-cd-and-resolve`, `/watch-deploy`, `/list-deployment-fails`, `/run-deploy`, `/deploy-to-cloudflare`, `/deploy-to-vercel` |
| secrets leak / สงสัย hardcoded secret | `/check-secrets-leak`, `/follow-secret-manager`, `/open-github-secrets` |
| unused dependencies | `/check-unused-deps`, `/follow-tool-knip` |
| dead code / unused files | `/check-dead-code`, `/check-unused-files` |
| circular dependencies | `/check-circular-dependencies` |
| long files (>250 บรรทัด) | `/check-long-files`, `/refactor` |
| code duplication | `/check-code-structure`, `/follow-tool-jscpd` |
| broken references / skill refs ขาด | `/check-broken-skills-references`, `/update-references` |
| TODO/MOCK/placeholder เหลือ | `/report-scan-todo`, `/implement-mock` |
| dependencies outdated | `/update-dependencies-latest`, `/update-version-latest`, `/follow-tool-taze` |
| ไฟล์/branch/worktree รก | `/run-cleanup`, `/cleanup-files-in-project`, `/cleanup-git-branch`, `/cleanup-worktree` |
| git conflict | `/resolve-merge-conflicts`, `/git-debug` |
| workspace หลายอันไม่ตรงกัน | `/alignment`, `/sync-drive-d-submodules` |
| ไม่รู้ว่าควรใช้ skill ใด | `/search-skills`, `/suggest-next-action`, `/ask-me` |
