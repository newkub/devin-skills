---
name: report-slides
description: Build a Slidev presentation summarizing a given topic in `.devin/temp/` — a temporary slide report
argument-hint: "[topic]"
related:
  - report
  - learn
  - follow-create-slide-slidev
  - convert-to-lang-th
  - delete-project-temp
  - open-web
---

## Goal

Build a Slidev presentation summarizing a concept, tool, library, or topic the user specifies, as Thai-language slides in `.devin/temp/slides/{topic}/` — a temporary report artifact, never stored permanently in the repo

## Scope

Use to build a slide report for presenting or sharing knowledge temporarily — output lives in `.devin/temp/` only (cleanable via `/delete-project-temp`)

## Execute

### 1. Define Topic

> Goal: Know the topic and slide name

1. Identify the topic (concept, tool, library, framework)
2. Set the slide folder name (e.g. `rust`, `solidjs`, `drizzle`)
3. Set the depth level (overview, intermediate, deep)
4. State the main questions that need answers

### 2. Research

> Goal: Collect content before writing slides

1. Run `/learn` for the needed concept, tool, or library
2. Record core concepts, code examples, and best practices
3. Identify the key points to turn into slides

### 3. Create Slide File

> Goal: Create `slides.md` in temp

1. Create `.devin/temp/slides/{topic}/slides.md` with standard frontmatter (`theme`, `title`)
2. Do not create `package.json` — `bunx slidev` resolves dependencies itself
3. Run `/convert-to-lang-th` — slide content is in Thai

### 4. Write Slide Content

> Goal: Write content from the researched data

1. Create a title slide with the topic name and overview
2. Create concept slides explaining core concepts one at a time
3. Create code example slides with syntax highlighting
4. Create comparison slides if comparing with something familiar
5. Create a best practices slide
6. Create a summary slide of key takeaways
7. Add `v-click` and `v-motion` for animations as appropriate

### 5. Run And Open

> Goal: Render the slides for the user immediately

1. `cd .devin/temp/slides/{topic}` then run `bunx slidev slides.md`
2. Run `/open-web` to open `http://localhost:3030`
3. Verify the slides render correctly

## Rules

### 1. Temp Only

- Create only in `.devin/temp/slides/{topic}/` — never write into the repo or `D:/newkub/slides/`
- Do not create `package.json` — `bunx slidev` suffices
- `.devin/temp/` is the artifact zone — clearing it via `/delete-project-temp` never affects the project

### 2. Content Structure

- Start with the overview before the deep dive
- Each slide covers exactly one concept
- Use code examples for every concept
- Use comparison tables for comparisons
- Summarize key takeaways in the final slide

### 3. Slide Quality

- Follow `/follow-create-slide-slidev` for Slidev best practices
- Use `v-click` for step-by-step reveals
- Use transitions for slide transitions
- No more than 5 bullet points per slide

### 4. Learning Integration

- Use the data from `/learn` directly
- Do not write new content beyond what was researched
- Record lessons learned in the final slide
- Run `/convert-to-lang-th` — content and explanations are in Thai
- Keep English technical terms when needed, e.g. `ownership`, `borrowing`, `async`

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status); the Slidev deck in `.devin/temp/` is this skill's artifact, produced only when the user asks for slides explicitly

## Expected Outcome

- A Slidev `slides.md` created in `.devin/temp/slides/{topic}/`
- Slides summarizing the knowledge in Thai, with code examples and best practices
- The dev server running on port 3030
- The browser opened automatically showing the slides
- Ready to share with the team — deletable any time via `/delete-project-temp`
