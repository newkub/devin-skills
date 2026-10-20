---
name: gen-postman-collection
description: Generate a Postman/Bruno collection from API routes or an OpenAPI spec with environments
argument-hint: "[spec-or-framework]"
related:
  - deep-review
  - scan-codebase
  - report
  - run-test

---

## Goal

Generate an API collection (Postman or Bruno) from a real OpenAPI spec or route definitions — with folders, example requests, auth setup, and environments

## Scope

- Input: an OpenAPI spec (`openapi.yaml`) or route definitions in code
- Output: a Postman collection v2.1 (`*.postman_collection.json`) or a Bruno collection (`*.bru` files)
- Covers: endpoints, methods, params, example bodies, auth config, environment variables

## Execute

### 1. Get API Surface

> Goal: Collect all endpoints

1. If an OpenAPI spec exists → use it as the source of truth
2. If not → run a framework generator first, or extract routes from code with `scan-codebase`/`use-astgrep`
3. Group endpoints by resource/tag

### 2. Generate Collection Structure

> Goal: Build the collection with folders per resource

1. Postman: create the JSON v2.1 schema — `info`, `item[]` (nested folders per tags)
2. Bruno: create `*.bru` files + `bruno.json` + `environments/`
3. Per request: method, URL (using the `{{baseUrl}}` variable), headers, params, body example

### 3. Add Request Details

> Goal: Make requests immediately usable

1. Base URL: environment variable `{{baseUrl}}` — create environments: `local`, `staging`, `prod`
2. Auth: collection-level auth (Bearer/API key) if the API uses it — use variables, never hardcode
3. Examples: request bodies from schema examples or generated from types
4. Descriptions: from spec descriptions or docstrings
5. Path params and query params fully taken from the spec

### 4. Add Test Scripts (when appropriate)

> Goal: Add basic assertions per request

1. Postman test scripts: `pm.response.to.have.status(200)` matching the expected status
2. A schema validation script if the response schema is clear
3. Bruno: equivalent `assert`/`tests` blocks

### 5. Verify And Report

> Goal: Confirm the collection imports and is complete

1. Validate the JSON schema (Postman collection schema) or open it in Bruno
2. Compare the endpoint count with the spec — nothing missing
3. Use `/report` to summarize: `No.`, `Folder`, `Endpoints`, `Auth`, `Examples`
4. State how to import/run it

## Rules

### 1. From Spec Or Real Code

- Generate only from a real spec/code — never guess endpoints
- If spec and code drift → run `/deep-review` first, then generate from the source of truth

### 2. No Secrets

- Never put real tokens/keys in the collection — always use variables
- Environment files contain placeholders only

### 3. Usable Immediately

- After import it must actually fire requests (once baseUrl/auth are filled in) — not an empty skeleton
- Example bodies must be valid per the schema
- Use /deep-test api if needed
- Use /run-test if needed


## Expected Outcome

- A collection file ready to import and use immediately
- Environments (local/staging/prod) with variables
- Endpoint coverage complete per the spec with basic test scripts
