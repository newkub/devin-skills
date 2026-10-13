---
name: deep-verify
description: alias → /run-verify (run full local and CI/CD verification per project)
argument-hint: "[scope]"
related:
  - run-verify

---

## Goal

Alias of `/run-verify` — run full local and CI/CD verification per project

## Scope

Use when the user invokes `/deep-verify` — this skill is only an alias stub; the real workflow lives in `run-verify`

## Execute

Run the full `/run-verify` workflow

## Rules

- Never duplicate the `/run-verify` workflow in this file
- If the alias is missing steps → always read `run-verify/SKILL.md`

## Expected Outcome

- `/run-verify` is executed through every step
