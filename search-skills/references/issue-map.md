# Issue To Solution Map

Table mapping common symptoms to the skill or workflow that should be used

| Issue | Solution |
|---|---|
| disk full / nearly full | `/cleanup-files-in-computer` or `/uninstall-program-in-computer` or `/follow-tool-mise` (`mise cleanup`) |
| memory leak / high RAM usage | `/run-profiler` or `/deep-optimize`; to have CI check it → `/setup-cicd` + `/run-verify` |
| high CPU / abnormal slowness | `/deep-optimize`, `/run-bench`, `/run-profiler` |
| build fail | `/run-build`, `/resolve-errors` |
| lint fail | `/run-lint`, `/resolve-errors` |
| typecheck fail | `/run-typecheck`, `/resolve-errors` |
| test fail / flaky | `/run-test`, `/run-test all`, `/resolve-errors` |
| CI/CD pipeline fail | `/resolve-cicd`, `/resolve-github-actions-fails`, `/setup-cicd` |
| deploy fail | `/resolve-cicd`, `/watch-deploy`, `/list-deployment-fails`, `/run-deploy`, `/deploy-to-cloudflare`, `/deploy-to-vercel` |
| secrets leak / suspected hardcoded secret | `/check-secrets secrets-leak`, `/follow-secret-manager`, `/open-github secrets` |
| unused dependencies | `/follow-tool-knip`, `/follow-tool-knip` |
| dead code / unused files | `/follow-tool-knip` |
| circular dependencies | `/follow-tool-madge` |
| long files (>250 lines) | `/check-long-files`, `/refactor` |
| code duplication | `/check-code-structure`, `/follow-tool-jscpd` |
| broken references / missing skill refs | `/review-devin-global-harness`, `/update-references` |
| package manifest not publish-ready | `/update-project` (`### setup-package`) |
| release workflow/config missing | `/setup-cicd`, `/follow-release`, `/follow-tool-release-it` |
| TODO/MOCK/placeholder left over | `/scan-codebase`, `/update-todo-md`, `/implement-to-production` |
| dependencies outdated | `/update-version-to-latest`, `/follow-tool-taze` |
| cluttered files/branches/worktrees | `/run-cleanup`, `/cleanup-files-in-project`, `/cleanup-git-branch`, `/cleanup-worktree` |
| git conflict | `/resolve-merge-conflicts`, `/deep-debug` |
| multiple inconsistent workspaces | `/review-devin-global-harness`, `/sync-drive-d-submodules` |
| unsure which skill to use | `/search-skills`, `/suggest-next-action`, `/ask-me` |
