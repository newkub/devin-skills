---
name: git-bisect
description: Binary search for the commit that introduced a bug — manual marks or bisect run script
argument-hint: "[<good-sha> <bad-sha>|run <script>]"
related:
  - deep-debug
---

## Goal

Find the commit that introduced a bug with `git bisect` — binary search reduces N commits to ~log2(N) checks

## Scope

- manual bisect (`start`, `good`, `bad`) and automated (`bisect run <script>`)
- use when you know the bug is absent in commit A but present in commit B and you want to find the culprit
- pairs with `/deep-debug` — bisect finds the culprit commit, debug finds the root cause inside it

## Execute

### 1. Establish Range

> Goal: have verified good/bad boundaries that are real

1. find the `bad` commit (usually HEAD): confirm the bug reproduces
2. find the `good` commit: an older tag/release or commit where the bug is not yet present — must be really verified before starting, never guessed
3. `git bisect start <bad> <good>` — git checks out the midpoint commit automatically

### 2. Mark Each Check

> Goal: each step cuts the search space in half

1. Reproduce the test at the current commit → `git bisect good` or `git bisect bad`
2. commits that cannot be tested (broken build, etc.) → `git bisect skip`
3. repeat until git reports the culprit: `<sha> is the first bad commit`

### 3. Automate With bisect run

> Goal: automated bisect when the test is scriptable

```bash
git bisect start <bad> <good>
git bisect run <test-command>     # exit 0=good, 1-124/126-127=bad, 125=skip
git bisect run bun test path/to/specific.test.ts
```

1. the test command must exit with correct codes — write a short wrapper script if needed
2. keep the test scope small (one test/one command) — bisect runs it many times

### 4. Conclude

> Goal: get the culprit commit and return to the normal state

1. `git show <culprit>` — see the change that caused the bug
2. `git bisect reset` — always return to the original branch (never forget — a lingering detached HEAD breaks further work)
3. continue with `/deep-debug` to find the root cause in the culprit, or `/git-revert` if a rollback is needed

## Rules

- verify `good` for real before starting — a wrong good = the whole bisect points at the wrong commit
- `bisect run` must be deterministic — a flaky test makes bisect lie → fix the flakiness first
- `git bisect reset` every time you finish — whether a normal end or an abort
- Use /deep-debug if needed

## Expected Outcome

- the culprit commit identified with `git show` evidence in ~log2(N) checks
- repo back on its original branch (`bisect reset`), ready to continue the fix
