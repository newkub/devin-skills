---
name: match
description: Find match items from the codebase then apply rules the user defined to each match
argument-hint: "<what-to-match>"
allowed-tools:
  - read
  - grep
  - find_file_by_name
  - exec
  - ask_user_question
  - skill
  - run_subagent
  - todo_write
  - use-astgrep
triggers:
  - user
  - model
related:
  - scan-codebase
  - search-in-git
  - ask-me
  - follow-your-suggestion
  - use-scripts
  - plan
  - deep-validate
---

## Goal

Find match items in the workspace or skill set, then present them with evidence, and then have the user define conditional rules and apply the rule to each matched item automatically

## Scope

Use when the user speaks in the form "find X, then do Y if A, do Z if B" or wants to run a rule-based batch operation on a set of discovered items. Works with files, code symbols, skills, dependencies, or any searchable target

See also: /search-in-git, /report-file-structure, /ask-me, /follow-your-suggestion, /use-scripts, /plan

## Execute

### 1. Identify What To Match

> Goal: Identify What To Match

1. Accept the match target from the argument or context.
2. Examples: `*.test.ts`, `skills with TODO`, `functions longer than 50 lines`, `packages with no tests`.
3. If the target is vague, ask for a concrete pattern or example.
4. Record the matching criteria in `todo_write`.

### 2. Match Items

> Goal: Match Items

Find all items that match the criteria.

1. Use `find_file_by_name` for file patterns.
2. Use `grep` for text patterns.
3. Use `use-astgrep` for AST-based code patterns.
4. Use `scan-codebase` for broad searches or searches with multiple criteria.
5. Limit the results to a reasonable amount; if there are too many, show a summary and ask before expanding.

### 3. Present Matches

> Goal: Present Matches

Show the match items as a numbered list with evidence.

1. Number each item starting from 1.
2. Show the relevant identifier: path, symbol, skill name, or code snippet.
3. Include the match attribute that will be used for the rules, such as:
   - file extension
   - directory
   - content snippet
   - size or line count
4. Ask the user whether the match set is correct before applying the rules.

### 4. Collect Rules

> Goal: Collect Rules

Accept conditional rules from the user.

1. Ask the user for rules in the form: `if <condition> => <action>`.
2. Accept multiple rules in a single message.
3. Support a default rule: `else => <action>`.
4. Conditions can use the attributes exposed in step 3, such as:
   - `ext == .ts`
   - `path contains packages/`
   - `size > 1000`
   - `content contains TODO`
5. Actions can be skills, commands, or instructions, such as:
   - `review`
   - `refactor`
   - `delete`
   - `update-references`
   - `add tests`
   - `skip`
6. If an action is destructive or irreversible, warn and ask for confirmation.

### 5. Apply Rules

> Goal: Apply Rules

Run the matching action for each item.

1. Iterate over the match list in numbered order.
2. For each item evaluate the rules from top to bottom.
3. Execute the first matching action.
4. If no rule matches, apply the default rule or skip.
5. Record what was done for each item.
6. Stop and ask if a severe or irreversible action is about to run.

### 6. Report And Validate

> Goal: Report And Validate

Report the results and verify correctness.

1. Show a table with columns: No., item, matched rule, action, status.
2. Run `deep-validate` if the actions changed code or skills.
3. Run `run-verify` for lint, typecheck, or tests when relevant.
4. List any items that could not be processed, with the reason.

## Rules

### 1. Match Before Act

- You must find and present the matches before applying the rules.
- Do not assume the user wants the same action for every item.
- Confirm the match set unless the user clearly trusts the criteria.

### 2. Rule Clarity

- Each rule must have exactly one condition and one action.
- Conditions must reference a match attribute.
- Actions must be a known skill, command, or clear instruction.
- If a rule is vague, ask the user for clarity.

### 3. Safety

- Destructive actions require user confirmation before execution.
- Support a dry-run first when requested or when the action is risky.
- Do not run actions that affect secrets, credentials, or remote systems without confirmation.

### 4. Ordering

- Rules are evaluated in the order the user provided them.
- The first matching rule is used.
- If no rule matches, use the default rule or report "no match".

### 5. Evidence

- Every match must have evidence: path, snippet, line number, or attribute.
- Every applied action must be recorded in the report.
- If an action fails, record the error and continue with the next item unless told to stop.

## Expected Outcome

- The match items are shown as a numbered list before any action runs.
- User rules are applied systematically to each matched item.
- The report shows which rule matched and the result for each item.
- Code or skills remain valid if validation is relevant.
