# Follow Tool Github Actions Route Map

- Website: <https://docs.github.com/en/actions>
- gh manual: <https://cli.github.com/manual>

## Routes

| Route / Topic | URL |
|---|---|
| Actions overview | https://docs.github.com/en/actions |
| Workflow syntax | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax |
| Events that trigger workflows | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows |
| Contexts (`github`, `runner`, `env`) | https://docs.github.com/en/actions/reference/workflows-and-actions/contexts |
| Permissions (`GITHUB_TOKEN`) | https://docs.github.com/en/actions/tutorials/authenticate-with-github_token |
| Caching dependencies | https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching |
| Secrets | https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets |
| `gh workflow` manual | https://cli.github.com/manual/gh_workflow |
| `gh run` manual | https://cli.github.com/manual/gh_run |
| actionlint checks | https://rhysd.github.io/actionlint/ |

## Key Concepts

- CI (`ci.yml`) trigger บน `push`/`pull_request`; CD แยก workflow ตาม platform
- `permissions` แบบ least-privilege; pin actions ด้วย major tag (`@v7`) หรือ SHA
- validate ด้วย `actionlint` ก่อน commit
