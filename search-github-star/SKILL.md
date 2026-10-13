---

name: search-github-star
description: Search repositories from GitHub stars with the gh CLI
argument-hint: "[query]"
related:
  - list-github
  - all-github-repo
  - follow-tool-crw
  - learn

---

## Goal

Search repositories from GitHub stars with the `gh` CLI

## Scope

Use for searching repositories from GitHub stars via the `gh search` command

See also: /all-github-repo, /list-github-star-latest

## Execute

### 1. Search Repositories By Stars

> Goal: Search Repositories By Stars

Search repositories with the `gh search` command

1. Use the `gh search repos <query>` command
2. Use the `stars:>N` syntax to filter by stars
3. Use flags: `--sort stars`, `--order desc`
4. Use `--limit N` for pagination
5. Use qualifiers: `language:`, `topic:`, `user:`, `org:`

### 2. Filter Results

> Goal: Filter Results

Filter results by criteria

1. Filter by language with `language:<lang>`
2. Filter by topics with `topic:<topic>`
3. Filter by stars count with `stars:>N`
4. Filter by updated date with `pushed:>YYYY-MM-DD`
5. Filter by license with `license:<license>`

### 3. Parse Output

> Goal: Parse Output

Transform output from the `gh` CLI

1. Use the `--json` flag for JSON output
2. Extract fields: `name`, `fullName`, `description`, `url`
3. Extract stats: `stargazersCount`, `forksCount`, `openIssuesCount`
4. Extract timestamps: `createdAt`, `updatedAt`, `pushedAt`
5. Extract owner: `owner.login`, `owner.avatarUrl`

## Rules

### 1. Gh CLI Authentication

Handle authentication securely

- Use `gh auth login` for authentication
- The `gh` CLI handles tokens automatically
- No need to manage tokens in code
- Verify authentication with `gh auth status`

### 2. Search Query Construction

Build search queries correctly

- Use specific qualifiers to shrink the result set
- Use `stars:>N` qualifiers instead of broad searches
- Use `--limit` for pagination
- Use the `--sort` and `--order` parameters appropriately
- Use the `--json` flag for programmatic output

### 3. Output Formatting

Manage output from the `gh` CLI

- Use the `--json` flag for structured output
- Specify the desired fields with `--json field1,field2`
- Use `--jq` for additional filtering
- Use `--template` for custom formatting
- Use `--limit` for large result sets

### 4. Error Handling

Handle errors from the `gh` CLI

- Verify the `gh` CLI is installed
- Handle authentication errors with `gh auth login`
- Handle rate limit errors (GitHub API limits)
- Handle network errors with retries
- Check exit codes from the `gh` command

### 5. Performance Optimization

Improve search performance

- Use specific qualifiers to shrink the result set
- Use `--limit` to cap the number of results
- Use `--json` instead of text output for parsing
- Cache frequent search queries if needed
- Use `gh search` directly instead of API calls

- Use /list-github-star-latest if needed
- Use /follow-tool-crw if needed
- Use /learn-from-web if needed

## Expected Outcome

- Working `gh` CLI commands
- Efficient search functionality
- JSON output that is easy to parse
- Comprehensive error handling