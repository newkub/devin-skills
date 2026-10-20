---
name: deep-trace
description: Deeply trace execution flow, logs, metrics, or distributed traces
argument-hint: "[scope]"
related:
  - deep-debug
  - analyze-root-cause-analysis
  - run-profiler
  - watch-browser
  - use-astgrep
  - report
  - follow-tool-git

---

## Goal

Trace deeply along the path of execution, data flow, request lifecycle, logs, metrics, or distributed traces to find anomalies

## Scope

Use when you need to know how the code runs, where data flows, what a request passes through, or where an error occurs
Best for async timing, race conditions, distributed systems, data pipelines, or request paths
Not for general root-cause hunting — use `/deep-debug`
Not for pure performance analysis — use `/run-profiler`

## Execute

### 1. Define Trace Target

> Goal: Identify what to trace

1. Pin down the target: function, request, event, variable, error, latency spike
2. Identify the entry point and the expected exit point
3. Identify the boundaries to cross: process, network, database, queue, service
4. Run `/deep-thinking` if the trace target is complex

### 2. Choose Trace Source

> Goal: Pick the right data source

1. If logs exist → use structured logs to find a correlation id or request id
2. If metrics exist → look at dashboards for spikes or patterns
3. If distributed traces exist → use the trace id to follow the path
4. If there is no telemetry → use code reading: `/search-files-patterns`, `/use-astgrep`
5. If runtime behavior is needed → add temporary instrumentation

### 3. Instrument If Needed

> Goal: Add visibility when the trace is unclear

1. Add temporary structured logs: function name, input, output, state
2. Add temporary metrics for duration or count
3. Add trace spans if using OpenTelemetry or an observability tool
4. Mark the instrumentation as temporary — it must be removed once tracing is done
5. Never leave permanent `console.log`

### 4. Reproduce And Capture

> Goal: Produce repeatable trace data

1. Build a reproduction case for the target
2. Run it and capture logs, metrics, traces
3. Use the same correlation id or request id
4. Record timestamp, environment, input
5. If the trace is unstable → repeat 3-5 times

### 5. Follow The Path

> Goal: Follow the path of execution or data

1. Start at the entry point and go to the exit point
2. Record every step: function, service, database, queue, external API
3. Check the state/variables that change at each step
4. Identify async points, awaits, callbacks, event loop cycles
5. Use `/use-astgrep` or `/search-files-patterns` to find the call graph

### 6. Identify Boundary Crossings

> Goal: Find where data or control crosses a boundary

1. Identify network calls: HTTP, gRPC, message queue
2. Identify database operations: query, transaction, migration
3. Identify process boundaries: microservices, workers, edge functions
4. Check serialization/deserialization, encoding, timeout, retry
5. Identify clock, ordering, concurrency boundaries

### 7. Pinpoint Anomaly

> Goal: Find the anomaly in the trace

1. Compare the expected flow with the actual flow
2. Look for delays, missing events, duplicated events, unexpected errors
3. Look for state that doesn't match expectations
4. Diff or compare side-by-side a once-working flow with the broken one
5. Run `/analyze-root-cause-analysis` if a causal chain is needed

### 8. Fix And Verify

> Goal: Fix the problem and confirm the trace is correct again

1. Run `/resolve-errors` for a targeted fix
2. If changing the flow structure → run `/deep-analyze` first
3. Remove the temporary instrumentation
4. Re-run the reproduction case and capture a new trace
5. Verify the flow matches the expected one again
6. Run the full test suite to confirm

## Rules

### 1. One Trace At A Time

- Follow a single target per trace session
- Don't trace multiple things at once
- Record every step for reproducibility

### 2. Structured Telemetry

- Use structured logs, not ad-hoc prints
- Use correlation id / request id / trace id
- Don't add permanent telemetry without a reason

### 3. Tool First

- Use existing observability before adding logs
- Use `/search-files-patterns` and `/use-astgrep` to trace in code
- Use `/run-profiler` if a latency breakdown is needed

### 4. Boundary Aware

- Give priority to boundary crossings
- Check network, database, serialization, concurrency
- Don't overlook async or event-driven flows

- Use /watch-browser fix if needed
- Use /report if needed
- Use /follow-tool-git if needed

## Expected Outcome

1. A step-by-step list of the execution or data flow
2. The anomaly point with evidence
3. The causal chain of the problem
4. A clearly targeted fix
5. Reproducible trace data
6. Regression tests to prevent the broken flow from recurring
