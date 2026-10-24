# Use Case — Observe and Compare a Live Web Page

> Describe what a running page actually loaded and executed, then diff two captures — without taking over the browser. Source: https://rea.tools and `docs/web-observation.md` (accessed 2026-10-24)

## 1. Own the browser, hand over only the socket

```bash
chrome --remote-debugging-port=9222 --user-data-dir=/tmp/rea-profile
```

Use a dedicated profile. REA connects to an already-running browser and never launches, closes, or navigates it — the tab you point at is the tab it reads. Since Chrome 136 the `--remote-debugging-port` flag is ignored for the default profile, so a dedicated `--user-data-dir` is the only reliable way in; Chrome 144+ also serves a browser socket from `chrome://inspect/#remote-debugging`.

## 2. Pass a literal loopback endpoint

Accepted:

```text
http://127.0.0.1:9222
ws://127.0.0.1:9222/devtools/browser/<id>
```

Rejected: `localhost`, LAN addresses, HTTPS, credentials, query strings, fragments, and implicit ports. `[::1]` is accepted. If the endpoint is unreachable or answers with something that is not a DevTools handshake, the error is `endpoint_unreachable` or `invalid_endpoint_response` — check the port and the profile, not the page.

## 3. Enumerate targets before inspecting

```bash
rea list-browser-targets --endpoint http://127.0.0.1:9222 --json
```

Pick the page target by URL. Do not guess an ordinal — reloads and SPA navigations change the order.

## 4. Inspect what the page is made of

```bash
rea inspect-web-page --endpoint http://127.0.0.1:9222 --target <target-id> --json > page.json
```

The record covers DOM, accessibility nodes, script URLs, resource timing metadata, safe headers, network and console metadata, and optional redacted storage fingerprints. It never evaluates JavaScript in the page, and it never reads storage values — only shape and key fingerprints.

## 5. Observe events instead of clicking

```bash
rea observe-web-session --endpoint http://127.0.0.1:9222 --target <target-id> --json
```

Then perform the external action yourself — a reload, an SPA route change, a form post made by your own automation. The capture returns ordered events: `reload`, SPA navigation, redirect, request failure, lifecycle, and target termination. `observe-web-session` is a recorder, not a driver. Active automation stays in `/use-chrome-devtools` and the Playwright family.

## 6. Analyze captured scripts statically

```bash
rea analyze-web-bundle --input page.json --json > bundle-evidence.json
```

This runs the same static JavaScript engine used for Electron and ASAR input. Project the result with `inspect-analysis-view` rather than re-reading it, and seed any trace with a literal string, route, or module name — never a regex.

## 7. Compare two captures

```bash
rea compare-web-captures --before before.json --after after.json --json
rea compare-web-screenshots --before before.png --after after.png --json
```

A comparison is only meaningful when both sides carry the same evidence classes and neither is truncated. Missing or truncated evidence is reported as `unknown`, never as equivalence. Screenshot comparison holds decoded pixels inside a 256 MiB working-memory budget; a larger pair is refused rather than downsampled silently.

## 8. Close the loop

Write the captures to files outside the repository, record the endpoint, target URL, and timestamp alongside them, and cite the specific capture when reporting a finding. Retained evidence references live for one connection only.

## Pitfalls

- Pointing REA at `localhost` or a LAN address → rejected endpoint; the tool will not resolve or trust it for you.
- Using the default Chrome profile → the debugging port is ignored on Chrome 136+, so no target ever appears.
- Asking `observe-web-session` to click or type → it is a passive recorder; use Playwright for the action and REA for the observation.
- Comparing a truncated capture with a complete one → every absent item reads as a difference; label the pair `unknown` instead.
- Treating `inspect-web-page` as a security audit → it reports structure and metadata, not exploitability; route exposed-surface analysis to `/analyze-attack-surface`.
- Assuming storage fingerprints are values → only key shape and redacted fingerprints are returned.

## Related

- `references/apis.md`
- `best-practices/reverse-engineering-with-rea.md`
- `usecases/trace-electron-feature.md`
