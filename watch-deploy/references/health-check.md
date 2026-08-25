# Health Check And Polling

Polling logic and status interpretation for `watch-deploy`.

## HTTP Status Rules

| Status | Meaning | Action |
|---|---|---|
| 200 | Healthy | Stop watching, report success |
| 301/302 | Redirect | Follow if `followRedirects` is `true`, otherwise report redirect |
| 404 | Not found | Continue polling if expected (new DNS/path not ready) |
| 429 | Rate limit | Back off and increase interval |
| 500–599 | Server error | Continue polling, report if repeated |
| timeout | No response | Retry, count toward `maxRetries` |

## Polling Parameters

- `url`: target URL to poll
- `interval`: seconds between polls, default `10`
- `timeout`: total seconds to watch, default `300`
- `expectedStatus`: status codes considered healthy, default `200`
- `followRedirects`: whether to follow 301/302, default `true`
- `headers`: extra headers such as `Authorization` or custom host

## Stop Conditions

- URL returns status in `expectedStatus` within `timeout`
- `timeout` reached without success
- `maxRetries` consecutive network errors reached
- User interrupts (`Ctrl+C`)

## Output Format

Report each poll with:
- timestamp
- status code or error
- response time
- elapsed total time
- retry count
