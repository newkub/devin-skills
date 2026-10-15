---
name: list-x-newkub-reposts
description: List reposts (retweets) of @newkrubx from X via local CLI + env config
argument-hint: "[username] [--limit <n>]"
related:
  - list-github-star-latest
  - list-raindrop-favorite
  - search
  - report
  - suggest-next-action
---

## Goal

Fetch reposts (retweets) of X user `@newkrubx` (https://x.com/newkrubx/reposts) via the local CLI `scripts/list-x-reposts.ts` — uses X API v2 user timeline + `referenced_tweets` filter

## Scope

- Uses X API v2 — reposts = timeline items with `referenced_tweets[].type == "retweeted"`
- CLI is bun/TypeScript with no external deps — reads the token from env or `.env` locally only
- Read-only — never posts, reposts, or modifies any account
- Supports other users via the `[username]` argument (default `newkrubx`)

## Execute

### 1. Prepare Env

> Goal: token ready without leaking it

1. Set `X_BEARER_TOKEN` in `.env` at this skill's root or export it in the shell — bun auto-loads `.env`
2. No token → stop and tell the user to create a Bearer Token from https://developer.x.com (free tier can read timeline)
3. Never put the token on the command line or commit `.env`

### 2. Run CLI

> Goal: fetch reposts with one command

```sh
bun run scripts/list-x-reposts.ts [username] [--limit 50]
```

1. CLI resolves `@username` → user id via `GET /2/users/by/username/:username`
2. Fetches timeline `GET /2/users/:id/tweets` with `expansions=referenced_tweets.id,referenced_tweets.id.author_id` + `tweet.fields=created_at,author_id` + `user.fields=username,name`
3. Filters only `referenced_tweets[].type == "retweeted"` then maps to original tweet + author
4. Output `--json` or TSV: `reposted_at`, `author`, `text`, `url`

### 3. Report

> Goal: show a table

1. Use `/report` columns: No., Reposted At, Author, Text (truncated), URL
2. Summarize the repost count and time range covered
3. Use `/suggest-next-action` if needed

## Rules

### 1. Secrets

- `X_BEARER_TOKEN` stays in `.env` or env only — never in command args, logs, or reports
- `.env` must always be in `.gitignore`

### 2. Read Only

- GET requests only — never POST/DELETE
- Respect rate limits — `--limit` max 100 per page, paginate with `pagination_token`

### 3. Fallback

- X API unavailable (no token/quota) → recommend `/watch-browser` to open `x.com/newkrubx/reposts` as a fallback
- Use /list-github-star-latest if needed
- Use /list-raindrop-favorite if needed
- Use /search if needed


## Expected Outcome

- A reposts table for @newkrubx sorted new → old with author, text, URL
- No token/secret leaked
- Next action clear
