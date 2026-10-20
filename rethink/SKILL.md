---
name: rethink
description: Re-evaluate a decision, plan, or implementation when stuck or when new information arrives
argument-hint: "[topic]"
related:
  - deep-thinking
  - reframe
  - plan
  - deep-analyze
  - deep-research
  - deep-review
  - deep-validate
  - refactor
  - ask-me

---

## Goal

Re-evaluate an existing decision, plan, or implementation when you hit a dead end, results miss the target, or new information suggests a change of direction.

## Scope

Use when work is already underway but you need to step back and reconsider. It is not first-time thinking (use `/deep-thinking`) and not deliberation before deciding (use `/deep-thinking`).

## Execute

### 1. Pause And State Current Position

> Goal: Pin down the current state before reconsidering

1. Identify the decision, plan, or implementation being rethought
2. Summarize what has been done and the results so far
3. Identify the original assumptions and constraints
4. Record the evidence behind the original decision

### 2. Identify Rethink Triggers

> Goal: Find out why a rethink is needed

1. Check whether new information exists or the context has changed
2. Check whether results match the success criteria
3. Identify where you are stuck or what failures occurred
4. Assess whether it is a technical block, a wrong assumption, or scope drift

### 3. Challenge Assumptions

> Goal: Test the assumptions previously used

1. List all relevant assumptions
2. Ask in reverse: if this assumption were wrong, what would happen
3. Find evidence supporting or refuting each assumption
4. Flag assumptions that are invalid or outdated

### 4. Generate Alternatives

> Goal: Brainstorm viable new options

1. Generate at least 2-3 alternatives beyond the original plan
2. Include simple options such as do nothing, simplify, pivot, stop
3. Assess effort, risk, and expected outcome of each option
4. Compare trade-offs explicitly

### 5. Compare And Decide

> Goal: Pick the best approach

1. Evaluate each alternative against the success criteria
2. Mark which options are reversible and which are irreversible
3. Choose: continue, pivot, simplify, stop, or gather more data
4. State the reasoning and evidence supporting the decision

### 6. Update And Report

> Goal: Update the plan and communicate

1. Update the plan, skill, or code per the new decision
2. Run `/update-references` if paths or names changed
3. Record what changed and why
4. Run `/suggest-next-action` to find the next step

## Rules

### 1. When To Rethink

Use rethink when:

- You are halfway through and realize the original path is unworkable
- New information invalidates an original assumption
- Results do not match the success criteria
- A simpler alternative has just become visible
- You need to avoid the sunk cost fallacy
- The work has scope creep or over-engineering

### 2. When Not To Rethink

Do not use rethink when:

- It is a low-risk, easily fixed change
- Work has not started or there is not enough data yet (use `/deep-thinking`)
- You just want to review before deciding (use `/deep-thinking`)
- Everything is proceeding per plan with no red flags

### 3. Sunk Cost

- Do not cling to time or effort already spent
- Decide based on expected future value, not past investment
- If stopping or pivoting is better, recommend it plainly

### 4. Evidence Based

- Every change must be justified by evidence
- Do not change course on gut feeling or an unsupported new assumption
- If evidence is missing, run `/deep-research` or `/ask-me` first

### 5. Timebox

- Small rethinks take at most 3 minutes
- Medium rethinks take at most 10 minutes
- Large rethinks take at most 20 minutes
- If it takes longer, use `/ask-me` to request more information

### 6. Integration

- Use `/deep-thinking` if fresh structural analysis is needed
- Use `/deep-thinking` if review is needed before deciding
- Use `/plan` if a new plan must be created
- Use `/ask-me` if user input is needed
- Use `/update-references` if the structure changes

- Use /deep-analyze if needed
- Use /deep-review if needed
- Use /deep-validate if needed
- Use /deep-review if needed
- Use /refactor if needed
- Use /deep-review then-fix if needed
- Use /reframe if needed


## Expected Outcome

- It is clear whether to continue, pivot, simplify, stop, or gather more data
- Invalid assumptions are identified and replaced
- The plan or implementation is updated per the new decision
- A report summarizing the reasoning and next action
