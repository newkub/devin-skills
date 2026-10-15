---
name: learn-from-codebase
description: Learn a codebase — `/deep-analyze` + a learning path of files to read, in order, and concept map
argument-hint: "[area-or-role]"
related:
  - report-architecture-diagram
  - scan-codebase
  - deep-analyze
  - report-file-structure
  - create-report-in-dot-devin

---

## Goal

Build a guided learning path from the real codebase — the files/modules to read in order, the concepts to understand, and a map of the main flows — so a newcomer or agent understands the project fast

## Scope

- Use when you need to understand an unfamiliar codebase — onboarding, handoff, or agent context building
- Covers: entry points, core domain, data flow, key abstractions, the spots people commonly get confused
- Output: a learning path document in `.devin/` or shown in chat — no code edits

## Execute

### 1. Deep Analyze

> Goal: always deep-analyze the codebase first

1. Always run `/deep-analyze` first — tech stack, structure, entry points, layers, boundaries, data flow
2. Supplement with `/scan-codebase` — symbols, call sites, consumers
3. Run `/report-file-structure` or `/report-architecture-diagram` as the base map
4. Separate core domain vs peripheral (infra, utils, generated)

### 2. Identify Critical Path

> Goal: find the "fastest to understand" route

1. Order the reading: entry → config/boot → domain core → 1-2 feature flows end-to-end
2. Pick flows that represent the codebase's dominant patterns (happy path + 1 edge)
3. Cut: generated code, vendored, unused legacy, tests (read later)

### 3. Build Concept Ladder

> Goal: the concepts to know before reading each part

1. List prerequisite knowledge per section: framework conventions, patterns used, domain terms
2. Link to the related skills/docs (`follow-*` matching the stack)
3. Identify "gotchas" — where the code misleads or the conventions are unusual

### 4. Write Learning Path

> Goal: a document people can actually follow

Output structure:

```markdown
# Learning Path: <project>

## Level 0: Big Picture (10 min)
- Read: README, `docs/architecture.*`
- Understand: <core flow diagram>

## Level 1: Entry Points
- Read: `src/main.ts` → `src/app.ts` — what happens at boot
- Concept: <framework init pattern>

## Level 2: Core Domain
- Read: `<domain files>` — the main models and rules
- Concept: <domain pattern>

## Level 3: Feature Walkthrough
- Follow the flow: `<route>` → `<handler>` → `<service>` → `<repo>` → DB
- Concept: <request lifecycle>

## Level 4: Depth
- tests, edge cases, config, deployment

## Gotchas
- <what people commonly get wrong>
```

5. Save with `/create-report-in-dot-devin` if the user wants it kept

## Rules

### 1. From Real Code

- Every step must point to real, verified files — never a generic "read src/"
- The route must be actually traceable in the code

### 2. Minimal Path

- Choose the shortest route that gives 80% understanding — not covering every file
- State what is skipped and why

### 3. Role Aware

- Adjust the path per role when specified (frontend vs backend vs fullstack)
- Language/depth per audience — a newcomer needs more context than a senior

## Expected Outcome

- A learning path that can actually be followed, with files and concepts
- A clear architecture map and critical flows
- Gotchas that help avoid misunderstandings

