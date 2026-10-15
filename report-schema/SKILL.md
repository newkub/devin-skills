---
name: report-schema
description: alias → /report-database-schema (database schema report + ER diagram)
argument-hint: "[path]"
related:
  - report-database-schema
---

## Goal

Alias of `/report-database-schema` — report database schema, tables, columns, indexes, relations and ER diagram

## Scope

Use when the user calls `/report-schema` — this skill is an alias stub only; the real workflow lives in `report-database-schema`

## Execute

Run `/report-database-schema` full workflow

## Rules

- Never duplicate the workflow of `/report-database-schema` in this file
- If the alias lacks steps → always read `report-database-schema/SKILL.md`

## Expected Outcome

- `/report-database-schema` is executed through every step
