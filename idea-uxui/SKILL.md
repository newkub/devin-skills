---
name: idea-uxui
description: Generate UX/UI improvement and new feature ideas, reply in chat, create no files
argument-hint: "[topic-or-url]"
related:
  - idea
  - validate-idea
  - deep-review
  - follow-design-system
  - report-uxui
  - deep-analyze
  - report
  - enhance-prompt
  - reframe

---

## Goal

Generate UX/UI ideas — improvements to existing work and new features in visual/interaction/usability — and summarize the results back in chat immediately, without creating files

## Scope

- Analyze the project context, existing routes/pages, and the prompt
- Generate `Extends` ideas (improve existing UX/UI) and `New` ideas (new UX/UI features), specifying impact/effort/risk
- Cover dimensions: visual polish, layout/responsive, interaction/feedback, accessibility, design system consistency, empty/error/loading states
- Reply in chat with markdown tables and bullets
- Don't create report/plan files, don't implement
- If you want a visual review of real routes before thinking of ideas → use `/deep-review` (dimension `uxui`)
- If you want implementation → hand off to `/implement-to-production`
- An idea the user will actually take action on but that has no demand/feasibility evidence yet → screen it first with `/validate-idea`

## Execute

### 1. Understand Context

> Goal: Understand the topic and the current UX/UI

1. Take `<topic-or-url>` from the argument or conversation context
2. Run `/deep-analyze` in a lightweight way if needed — look at existing routes, components, design system
3. If a web server is running and you need evidence → use `/deep-review` or `/report-uxui` before thinking of ideas
4. If the topic is unclear → use `/suggest-next-action` to ask the user

### 2. Generate Ideas

> Goal: Generate UX/UI ideas

1. Generate `Extends` ideas (improve existing pages/components/flows) and `New` ideas (new UX patterns/features such as command palette, skeleton states, onboarding, dark mode, shortcuts)
2. No more than 10 ideas per group, no more than 20 in total
3. For each idea specify: idea, description, ux dimension (visual/interaction/a11y/responsive/consistency), impact, effort, risk, mvp score (1-10)
4. Sequential numbering: `Extends` starts at 1, `New` continues from `Extends`

### 3. Rank And Format

> Goal: Rank and format the reply

1. Sort by MVP score high → low
2. Build markdown tables with `/report table`
3. If there is a follow-up action from the previous idea → use `/follow-your-suggestion`
4. Summarize the top 3-5 ideas briefly with bullets
5. Specify phase: quick win, short-term, long-term

### 4. Reply In Chat

> Goal: Reply to the user immediately

1. Show a 1-2 line summary
2. Show the tables in chat
3. Say that these are ideas for consideration
4. If implementation is wanted → recommend `/implement-to-production`
5. If you want to ask more → use `/suggest-next-action`

## Rules

### 1. Chat Only

- Reply in chat only — don't create files in `.devin/temp/report/` or `.devin/temp/plan/`, don't create a permanent web app, don't call `/ship`

### 2. Lightweight

- No deep `/learn` (web) needed unless the user says so — take no more than 5-10 minutes
- Don't analyze the codebase in detail if the context is enough

### 3. UX Dimension Coverage

- Every run must cover at least 3 dimensions: visual, interaction, a11y (per the `/deep-review` checklist)
- Ideas must be actionable and based on the existing design system (`/follow-design-system`) — don't propose conflicting patterns without reason

### 4. Suggest Deep Workflow

- If the user says "do" or "do now" → recommend `/implement-to-production`
- If the user wants a plan or report → recommend `/plan`
- When any idea is implemented → always run `/deep-test all`

### 5. Format

- Every table must have the `No.` column as the first column, ordered 1, 2, 3, ...
- Use `/report` for tables — don't answer longer than necessary
- Use `/enhance-prompt` if the prompt is vague
- Use /reframe if necessary


## Expected Outcome

- The user gets UX/UI ideas in chat immediately, covering multiple dimensions
- There are tables summarizing Extends, New, and priority with the ux dimension
- No files are created and no implementation happens
- Clear next-step recommendations
