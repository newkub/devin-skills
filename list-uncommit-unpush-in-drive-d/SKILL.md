---
name: list-uncommit-unpush-in-drive-d
description: Scan git projects on drive D and show uncommit/unpush status
argument-hint: "[filter]"
related:
  - list-projects-git-in-drive-d
  - check-uncommit
  - report
  - suggest-next-action
---

## Goal

Scan all git projects on drive D and report each repo's status — whether it has uncommitted or unpushed changes

## Scope

Use after `/list-projects-git-in-drive-d` to check the health of repositories on drive D

## Execute

### 1. List Git Projects

> Goal: get the git-projects list on drive D

1. Use `/list-projects-git-in-drive-d` to find all projects
2. Save the list as input for the status check

### 2. Check Each Repo Status

> Goal: check uncommit and unpush

1. Loop over each project
2. Need uncommit details → use `/check-uncommit`
3. Need unpush details → use `/check-unpush`
4. Run `git status --short` to find uncommitted changes
5. Run `git log --branches --not --remotes --oneline` to find unpushed commits
6. Run `git branch -vv` to find branches lagging behind remote

### 3. Report

> Goal: summarize status

1. Use `/report` columns: `No.`, `Project`, `Path`, `Uncommit`, `Unpush`, `Status`
2. Identify repos that need action
3. Use `/suggest-next-action`

## Rules

- Supports both PowerShell and Bash
- Skip unreadable repos and report as a warning
- Never modify any repo automatically
- Use dry run first when there are many projects

## Expected Outcome

- A list of git projects on drive D with uncommit/unpush status
- Know which repo needs commit, push, or sync
