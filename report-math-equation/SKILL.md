---
name: report-math-equation
description: Answer questions or compare options as + - = equations for easy understanding
argument-hint: "[scope]"
related:
  - report
  - plan
  - deep-analyze
  - ask-me

---

## Goal

Answer questions or compare options with `+`, `-`, `=` equations that are easy to understand and not overly complex

## Scope

Use when the work involves:
- Comparing trade-offs between options
- Explaining a root cause or outcome
- Summarizing pluses, minuses, and the final result
- Helping decide between 2+ options
- Converting code/algorithm/description/problem into a math formula (LaTeX)

Not for:
- Factual questions needing a short answer (e.g. "where is this file")
- Questions with no variables to compare

## Execute

### 1. Identify Variables

> Goal: Identify the components of the equation

1. Read the prompt or context
2. Identify:
   - `+` the positives/benefits/costs/components
   - `-` the negatives/risks/drawbacks/things to reduce
   - `=` the result/answer/conclusion
3. If the options are unclear → run `/ask-me` first

### 2. Build Equations

> Goal: Write equations with only one interpretation

1. Start from the current state:
   ```
   problem = current_state + missing_parts
   ```
2. Write the option equations:
   ```
   option_a = benefit_a + cost_a - risk_a
   option_b = benefit_b + cost_b - risk_b
   ```
3. Write the outcome equation:
   ```
   best_choice = option_a - option_b (if a is better)
   ```

### 3. Evaluate

> Goal: Decide which direction the equations point

1. Compare the totals of each option
2. State the conditions that favor one side
3. If data is insufficient → state the assumptions

### 4. Output

> Goal: Summarize in an easy-to-read form

1. Show the 3-5 main equations
2. Follow with a `/report` summary:
   - Options
   - Positives (+)
   - Negatives (-)
   - Result (=)
3. End with a short answer

### 5. LaTeX Formula (Optional)

> Goal: Produce a correct math formula

1. If the input is code/algorithm/description/problem that needs a real formula → use LaTeX: `$...$` inline, `$$...$$` block
2. Summarize the variables, relations, and conditions
3. Use standard notation: `\sum`, `\prod`, `\int`, `\frac`, `\sqrt`, `\begin{cases}`
4. Test with 1 sample value
5. State the conditions and constraints

## Rules

### 1. Simplicity

- No more than 3-5 equations
- Each equation has a clear meaning
- Not real math — the + - = signs serve as an analogy

### 2. One-Way Interpretation

- Reading it must yield the same direction of understanding
- Do not write ambiguous equations like `A + B = ?`

### 3. Always Include Table

- A `/report` must accompany every answer
- The table helps the user scan quickly

### 4. Honest About Uncertainty

- If data is insufficient, state the assumptions
- Do not decide for the user without enough data

- Use /report if needed
- Use /plan if needed
- Use /deep-analyze if needed

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status) when findings are reported; equation answers stay in chat

## Expected Outcome

- 3-5 equations reflecting the problem/options/outcome
- A + - = summary table
- An answer the user understands immediately
- Not lengthy, no over-engineering
