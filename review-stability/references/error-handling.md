# Error Handling Checks

## Error Capture And Coverage

- error boundaries: coverage on critical paths, fallback UI, recovery, logging, nested boundaries
- try-catch coverage: async operations, external calls, critical functions, missing detection, catch block quality (not empty, not swallowing)
- unhandled rejections: handler, global rejection handler, floating promises, promise chain error propagation, async function error propagation
- error classification: types (network, validation, auth, server, client), hierarchy, custom classes, discrimination, error vs exception vs fault

## Error Messages

- user-friendly messages
- actionable messages (what user should do)
- localized messages
- error message clarity and specificity
- no technical jargon in user messages
- error code for support reference

## Error Codes

- error code system
- error code uniqueness
- error code documentation
- error code in API response
- error code mapping to user messages

## Graceful Degradation

- fallback UI on error
- partial functionality on error
- cached data fallback
- default value fallback
- offline mode
- retry option for user

## Error Recovery

- error recovery patterns
- automatic retry
- user-initiated retry
- state recovery after error
- error boundary reset
- form data preservation on error

## Error Logging

- error logging completeness
- error context (stack, user, request)
- error severity logging
- PII scrubbing in logs
- log level appropriateness
- structured logging

## Error Monitoring

- error monitoring integration
- error alerting
- error rate thresholds
- error grouping
- error dashboard
- error trend tracking

## Skip Conditions

- ถ้า project ไม่มี error boundaries → ข้าม error boundary checks
- ถ้า project ไม่มี error monitoring → ข้าม error monitoring checks
- ถ้า project ไม่มี async operations → ข้าม unhandled rejections checks
