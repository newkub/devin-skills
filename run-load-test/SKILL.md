---
name: run-load-test
description: alias → /test-load (k6/autocannon load test; measures throughput, latency, breaking point)
argument-hint: "[url-or-endpoints] [--vus N] [--duration Ns]"
related:
  - test-load
  - run-test
---

## Goal

Alias for `/test-load` — run a load test against the app/API, measuring throughput, latency distribution, and the breaking point

## Scope

Use when the user calls `/run-load-test` — this skill is only an alias stub; the real workflow lives in `test-load`

## Execute

Run the full `/test-load` workflow

## Rules

- Never duplicate the `/test-load` workflow in this file
- If the alias is missing steps → always read `test-load/SKILL.md`
