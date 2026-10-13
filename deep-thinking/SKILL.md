---
name: deep-thinking
description: Analyze problems systematically with structured thinking before acting, using no external tools
argument-hint: "[topic]"
related:
  - rethink
  - plan
  - ask-me
  - deep-debug
  - analyze-root-cause-analysis
  - suggest-next-action

---
## Goal

Use structured thinking to analyze problems systematically before taking any action, with the AI reasoning on its own

## Scope

Use for tasks that need deep analysis, planning, or complex problem-solving — not for a pre-decision review (use `/deep-thinking`) and not for work planning (use `/plan`)

## Execute

### 1. Define Problem Clearly

> Goal: Define Problem Clearly

Define the problem or goal clearly:

1. Write the problem as a question
2. State the constraints and requirements
3. Set success criteria
4. Identify the involved stakeholders

### 2. Break Down Problem

> Goal: Break Down Problem

Split the problem into sub-parts:

1. List all sub-problems
2. Prioritize each part
3. Identify dependencies between the parts
4. Identify the unknowns

### 3. Generate Alternatives

> Goal: Generate Alternatives

Generate possible alternatives:

1. Think of several options (at least 2-3)
2. Evaluate the pros/cons of each
3. Compare the trade-offs between options
4. Consider the worst-case scenario of each
5. Pick the best option with clear reasons

### 4. Validate Assumptions

> Goal: Validate Assumptions

Check the assumptions used:

1. List all assumptions used in the analysis
2. Separate safe assumptions from risky assumptions
3. Verify the assumptions with supporting evidence
4. Correct any wrong assumptions and re-analyze if needed

### 5. Create Action Plan

> Goal: Create Action Plan

Create an action plan:

1. Break the work into clear, ordered steps
2. State the dependencies of each step
3. Set success criteria for each step
4. Identify risks and mitigation plans
5. Note whether each step is reversible

### 6. Execute And Iterate

> Goal: Execute And Iterate

Carry out the plan:

1. Follow the planned steps one by one
2. Check each step's result against its success criteria
3. Adjust the plan if results are not as expected
4. Record lessons learned for next time

## Rules

### 1. When To Use Deep Thinking

Use deep thinking when:

- The problem is highly complex
- There are multiple possible options
- Deep analysis is needed
- The approach is uncertain
- The risk is high
- The problem has complex structure that must be decomposed

### 2. When Not To Use Deep Thinking

Do not use deep thinking when:

- It is a low-risk action that can just be done
- The answer is obvious from context or memory
- Only a light review before deciding is needed
- It is an easily reversible change
- Analyzing would take longer than just doing the work

### 3. Thinking Process

The thinking process must:

- Start from a clearly defined problem
- Break the problem into sub-parts
- Consider multiple options
- Compare and pick the best one
- Check the assumptions
- Create an action plan
- Verify results step by step

### 4. Quality Of Thinking

The quality of thinking must:

- Have clear, verifiable logic
- Be backed by evidence
- Skip no critical step
- Cover every aspect
- Distinguish facts from assumptions
- Be reproducible by others

### 5. Common Pitfalls

Avoid common mistakes:

- Not defining the problem clearly
- Skipping analysis steps
- Thinking of only one option without comparison
- Not checking assumptions
- Failing to adjust the plan when needed
- Anchoring on the first option that comes to mind
- Ignoring worst-case scenarios

### 6. Time Budget

- For a small problem, spend at most 3 minutes analyzing
- For a medium problem, spend at most 10 minutes analyzing
- For a large problem, spend as long as needed, but always produce a summary
- If analysis runs too long, use `/ask-me` to gather more information from the user

### 8. Integration With Other Workflows

Connect with other workflows:

- Pondering perspectives before starting analysis can happen inside this skill
- Use `/deep-debug` for problems that need fixing
- Use `/analyze-root-cause-analysis` to find the root cause
- Use `/plan` to plan the work after analysis
- Use `/ask-me` if the analysis still isn't clear
- Use `/suggest-next-action` after analysis to know what to do next

- Use /rethink if needed

## Expected Outcome

- A systematic, complete problem analysis
- A clear work plan with success criteria and mitigation plans
- Reduced risk from poor decisions
- Better problem-solving quality through evidence-based analysis
- Lessons learned from each task for future use