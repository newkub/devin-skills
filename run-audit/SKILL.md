---
name: run-audit
description: Audit dependencies and security to check for vulnerabilities
argument-hint: "[scope]"
related:
  - deep-review
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - run-check
  - run-verify

---

## Goal

Audit dependencies and security to check for vulnerabilities

## Scope

Use `run-audit` for the specific tasks and workflows it covers (audit)

## Execute

> Pre-Run: always run `/deep-review` first — `run-*` skills must be reviewed/assessed before the main action, never skip; if findings are blockers, fix or report them before running (audit)

### 1. Audit Dependencies

> Goal: Audit Dependencies

1. Run `npm audit` or `bun audit`
2. Check vulnerabilities in dependencies
3. Review the severity levels of the vulnerabilities

### 2. Audit Licenses

> Goal: Audit Licenses

1. Check the licenses of dependencies
2. Identify unsuitable licenses
3. Review compliance requirements

### 3. Audit Code

> Goal: Audit Code

1. Scan the code for security vulnerabilities
2. Check for hardcoded secrets
3. Check for insecure patterns

### 4. Review Findings

> Goal: Review Findings

1. Prioritize the issues
2. Analyze the impact of each issue
3. Define action items

### 5. Fix Issues

> Goal: Fix Issues

1. Update dependencies with vulnerabilities
2. Fix security issues in the code
3. Test after the fixes

### 6. Generate Report

> Goal: Generate Report

1. Create an audit report
2. Share the findings with the team
3. Track remediation progress

## Rules

### 1. Audit Frequency

- Audit dependencies periodically
- Audit after adding new dependencies
- Audit before major releases

### 2. Severity Handling

- Critical/High: fix immediately
- Medium: fix in the next sprint
- Low: fix when time allows

### 3. License Compliance

- Check license compatibility
- Identify copyleft licenses
- Track license obligations

- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /resolve-errors if needed
- Use /run-check if needed
- Use /run-verify if needed

## Expected Outcome

- Dependencies audited
- Vulnerabilities identified and fixed
- License compliance checked
- Security issues fixed
- Audit report created
- Remediation progress tracked
