---
name: update-features-md
description: Analyze the features in a project and write FEATURES.md at the workspace root
argument-hint: "[scope]"
related:
  - deep-analyze
  - use-scripts
  - report
  - update-docs
---

## Goal

Analyze the features in a project and create `FEATURES.md` at the workspace root with a features table

## Scope

- Analyze routes, modules, database schemas, API endpoints
- Identify existing features with name, description, module, domain, status
- Write `FEATURES.md` at the workspace root (for a monorepo, create one per workspace)
- Show the existing features briefly in chat as a table

## Execute

### 1. Analyze Project Structure

> Goal: Identify the workspaces and tech stack to analyze

1. Run `/deep-analyze` to analyze the project structure
2. Identify the workspaces to analyze (for a monorepo, list every workspace)
3. Record the tech stack and dependencies

### 2. Identify Features

> Goal: Identify features from every source

1. Read the routes directory to identify pages and user-facing features
2. Read the modules directory to identify business logic features
3. Read the database schema files to identify tables and relationships
4. Read the server handlers and API routes to identify endpoints
5. Group features by domain and identify name, description, module
6. If the monorepo has more than 10 workspaces, use `/use-scripts`

### 3. Write FEATURES.md

> Goal: Create `FEATURES.md` at the workspace root

1. Create/update `FEATURES.md` at the workspace root with a markdown table:
   - `| Feature | Description | Module | Domain | Status |`
2. Group features by domain using a `## <domain>` heading
3. Write a short description under each feature as a bullet
4. For a monorepo, create `FEATURES.md` at the root of every workspace that has features
5. Do not create `.devin/features/` or `docs/project/features.md`

### 4. Report In Chat

> Goal: Summarize the result for the user

1. Show the existing features table in chat per `/report`
2. State the path of the `FEATURES.md` created and the next action

## Rules

### 1. Feature Identification

- Identify features from: routes, modules, schemas, API endpoints
- Each feature must have name, description, module, domain, status
- For a monorepo, analyze every workspace

### 2. File Location

- Create `FEATURES.md` only at the workspace root
- Do not create `docs/project/features.md`
- Do not create files in `.devin/features/`
- Do not delegate to `/update-docs`

### 3. Markdown Only

- Do not use HTML or interactive UX
- Use a markdown table
- Use headings and bullets for feature details

## Expected Outcome

- `FEATURES.md` at the workspace root has a complete existing-features table
- The existing-features table is shown in chat
- Features cover routes, modules, schemas, API endpoints

