# Use Case — Trace One Feature From an Electron Bundle to a Native Add-on

> A bundled desktop app has a feature you cannot find in source — because source is not there. Map it statically, confirm at runtime, and stop at the native boundary with evidence. Source: https://rea.tools, `docs/javascript-application-workflows.md`, `docs/electron-observation.md` (accessed 2026-10-24)

## 1. Analyze the bundle without running it

```bash
rea analyze-javascript-application /abs/path/to/App.app/Contents/Resources/app.asar --json > app-evidence.json
```

The input is an application directory or an ASAR — not a single source file. A single file yields `unsupported_target`; fix the input, do not switch operations to obtain a pass.

Static JS/Electron analysis needs no native engine, Java, browser, Docker, or API key.

## 2. Read a projection, not the whole record

```bash
jq -c '{source:{kind:"evidence-file",path:"app-evidence.json"},view:{kind:"summary"}}' | rea inspect-analysis-view
jq -c '{source:{kind:"evidence-file",path:"app-evidence.json"},view:{kind:"page",collection:"modules",offset:0,"limit":32}}' | rea inspect-analysis-view
```

Page through `modules` until you recognize the feature surface, then project the one collection you need. A 334 MB analysis collapses to roughly 10 KB as a summary — reading the raw JSON defeats the point.

## 3. Seed the trace with a literal

`trace-application-feature` accepts `node`, `route`, `string`, `api`, `ipc-channel`, `module`, or native export. Seeds are exact or literal-substring only — no regex.

```text
trace-application-feature { "kind": "ipc-channel", "seed": "settings:save" }
```

For a desktop feature the `ipc-channel` seed is usually the fastest bridge between the renderer and the main process. A `string` seed works when you only know a user-facing label.

## 4. Follow the data, not just the call shape

```text
trace-javascript-semantics { "mode": "callers", "target": "<module or function>" }
trace-javascript-semantics { "mode": "backward-provenance", "target": "<value>" }
trace-javascript-semantics { "mode": "forward-influence", "target": "<value>" }
trace-javascript-semantics { "mode": "ownership", "target": "<value>" }
```

`ownership` tells you which module actually holds the state, which is what a report needs. Backward provenance answers "where did this value come from"; forward influence answers "what does it change".

## 5. Confirm at runtime — without evaluating code

```bash
rea list-electron-targets
rea inspect-electron-page <endpoint>
```

`inspect-electron-page` is passive: it reads a running `file://` renderer, does not evaluate JS, and does not invoke IPC. For an ordered record of what happens during an external action, use `capture-electron-scenario`, which launches the app through the Playwright Electron API and owns its lifetime.

Runtime captures record IPC channel names and argument-shape metadata only — payload values are never retained. The app must have inspector-capable fuses or the capture returns `unsupported_target`; check with `rea inspect-electron-fuses` first.

If the renderer is ordinary web content in a browser, `observe-web-session` is the cheaper path.

## 6. Stop honestly at the native boundary

When the bundle hands off to a native add-on, the handoff is only asserted when the add-on's exact content digest matches provider evidence. Otherwise the result reports `requires-provider-analysis` — and REA never starts a provider implicitly.

That is the correct stopping point for a static pass. Report "native boundary reached, not analyzed" and open a provider session only with an explicit decision and an authorized engine.

## 7. Bind source when you have both

```bash
rea import-reference-source <reference> --application app-evidence.json
rea compare-source-to-bundle ...
rea compare-javascript-export-shapes ...
```

`compare-source-to-bundle` classes each item `unchanged`/`modified`/`removed`/`split`/`merged`/`duplicated`/`unknown`. A location-only difference is `unchanged` only with complete coverage on both sides; one-sided absence is `added`/`removed` only when the opposite graph has complete coverage. Anything else is `unknown` — report it as such.

## Pitfalls

- Pointing the analysis at a single `.js` file → `unsupported_target`; use the app directory or the ASAR.
- Seeding the trace with a regex → seeds are literal only; the trace silently finds nothing.
- Reading the full `app-evidence.json` into context → write once, project, page.
- Claiming the native add-on was analyzed because the JS references it → that is `requires-provider-analysis`.
- Letting `capture-electron-scenario` run on an untrusted build → it executes with normal host privileges; lifecycle ownership is not a sandbox.
- Treating `unknown` from a version comparison as "unchanged" → unknown is its own answer.

## Related

- `references/apis.md`
- `best-practices/reverse-engineering-with-rea.md`
- `usecases/triage-native-function.md`
