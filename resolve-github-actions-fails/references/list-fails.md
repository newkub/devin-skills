# List fails

## List Github Actions Fails

### Goal

Summarize all GitHub Actions workflow runs with conclusion=failure or failed status that the user can access on GitHub

### Scope

Used to inspect CI/CD failures using the `gh` CLI without modifying the repo or workflow — supports 2 modes:

- repo-scoped (default if inside a git repo): inspect the current repo or `--repo <owner/repo>`
- account-wide: specify `--all` to inspect all personal and org repositories the user is a member of

See also: /list-github-repo, /check-deployment-fails

### Execute

#### 1. Verify gh CLI

> Goal: Confirm that `gh` is installed and authenticated

1. Run `gh --version` to check the installation
2. Run `gh auth status` to check authentication
3. If not authenticated → run `/ask-me` to have the user run `gh auth login`
4. If ready → record the username

#### 2. Detect Mode And List Repos

> Goal: Choose the scope — a single repo or the whole account

1. If there is `--repo <owner/repo>` → repo-scoped on that repo
2. If there is no `--all` and you are in a git repo → repo-scoped on the current repo (`gh repo view --json nameWithOwner` or `git remote -v`)
3. If there is `--all` or you are not in a git repo → account-wide:
   - Run `gh repo list --json nameWithOwner,updatedAt --limit 100`
   - Run `gh org list` or `gh api user/orgs --jq '.[].login'`
   - For each org run `gh repo list <org> --json nameWithOwner,updatedAt --limit 100`
   - Skip archived repositories by default
4. Record the list of repo names to inspect

#### 3. Query Failed Runs

> Goal: Find the failed workflow runs in each repo

1. For each `owner/repo` run:
   `gh run list --repo <owner/repo> --json databaseId,name,headBranch,headSha,status,conclusion,event,startedAt,displayTitle,url --limit 20 --jq '.[] | select(.conclusion=="failure")'`
2. If some repo has no GitHub Actions or no failure → skip
3. Record all the failed runs

#### 4. Aggregate And Build Report

> Goal: Summarize the result as a table

1. Combine the failed runs from every repo
2. Use `/report` columns:
   - No.
   - Repo
   - Workflow
   - Branch
   - Commit
   - Event
   - Started At
   - URL
3. Sort by latest Started At
4. State a summary of the number of repos with failures and the number of failed runs

#### 5. Suggest Next Action

> Goal: Suggest the next step

1. Run `/suggest-next-action` to suggest fix workflow, view logs, or `/resolve-github-actions-fails`

### Rules

#### 1. Read Only

- Do not re-run, cancel, delete any workflow run
- Do not push code or modify the repo

#### 2. Rate Limit And Scope

- If there are many repos → limit to the most recently updated repos, or filter by `limit`
- Use pagination per `--limit` and `--page`
- If `gh` is rate limited → wait and retry per the header, or report

#### 3. Skip Archived

- Skip archived repositories by default
- If archived ones should be included, the user specifies it

#### 4. Privacy

- Supports public/private repositories per the permissions of the `gh` token
- Do not expose secrets or tokens in the output

### Expected Outcome

- A list of failed GitHub Actions runs across personal/org repos
- A table sorted by the date the failure occurred
- repo, workflow, branch, commit, event, url data available
- No repo or workflow is modified in any way
