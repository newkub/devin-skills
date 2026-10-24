---
name: use-decision-model
description: Use local ollaya decision models for fast typed choices, scores, and yes/no gates
argument-hint: "[state|batch|calibrate] [questions|preset] [--model name]"
related:
  - learn-from-references
  - follow-parallel
  - ask-me
  - pick-bestest
  - prioritize
  - validate-idea
  - follow-enter-dot
  - suggest-next-action
  - apply
  - check-reference
  - follow-tool-mise
  - update-devin-global-mcp
  - report
---

## Goal

Get a fast, typed, calibrated answer — one option, one level, or a yes/no probability — from a local ollaya decision model instead of reasoning it out in text, then act on that answer through an explicit threshold

## Scope

- Runtime order: the `ollaya` MCP server (`decide`, `list_models`, `pull_model`, `show_model` + `ollaya://presets/<name>`) first, the `ollaya` CLI second, the local `/v1/systemone` HTTP API third
- Three question types only: `choice` (one of N), `score` (ordered level), `noul` (probability that one statement is true)
- Latest: `ollaya@0.16.0` (verified 2026-10-24); models download separately and are large
- Use for closed-answer judgements an agent would otherwise spend text and tokens on: route, label, classify, gate, rate, triage
- Not for open-ended text, explanations, summaries, or any verdict that must rest on repo evidence — those stay with `/deep-thinking`, `/deep-analyze`, `/deep-review`, `/report-*`
- The model never authorizes destructive or shared-state actions; the human gate still wins (`## Rules`)

## Execute

### 1. Confirm The Decision Shape

> Goal: only run a model when the answer set is closed

1. The answer is one of a known, small set of options → `choice`
2. The answer is a position on an ordered scale you will compare with a threshold → `score`
3. The answer is yes/no about exactly one statement → `noul`
4. The answer needs new text, or the question changes while reading the state → stop and use `/deep-thinking` or `/deep-analyze`
5. The decision is destructive or touches shared state → the model may pre-screen, but `/ask-me` still decides

### 2. Prepare The Runtime

> Goal: know which surface answers and which models exist

1. MCP available → call `decide`; read `ollaya://presets/<name>` to see a preset's exact questions
2. MCP absent → CLI: `ollaya run <model> --questions <file|json> --format json` (or `--preset <name>`)
3. CLI absent → HTTP: `POST http://127.0.0.1:11435/v1/systemone` with `{model, state, questions}`
4. Inspect what is local with `list_models` (or `ollaya list`); a missing model answers `MODEL_NOT_FOUND`
5. Pull only when the disk has room: `pull_model` or `ollaya pull <model>` — never pull on a nearly full disk
6. Read `show_model` for parameters, context limit, languages, and built-in questions before choosing a model
7. No runtime at all → report the install path (`mise use -g ollaya` via `/follow-tool-mise`, or download the install script from `https://ollaya.dev/install.sh`, review it, then run it) and stop
8. Registering or fixing the server entry → `/update-devin-global-mcp`
9. Exact tool inputs, resources, error codes, and fallback commands → [references/mcp.md](references/mcp.md)

### 3. Learn From References

> Goal: question sets, thresholds, and model choice come from evidence, not invention

1. Official surface (tools, presets, response fields, thresholds) → `/learn-from-references` on `ollaya-dev/ollaya`: `README.md`, `docs/api.md`, `skills/ollaya-decisions/SKILL.md`
2. User-provided examples (tickets, emails, logs, labeled rows) → `/learn-from-references` on those files; extract the real categories, the real scale, and the labels already decided
3. A caller that already owns a rubric (`/prioritize` matrix, `/validate-idea` dimensions) → reuse its wording in `instructions`; never invent a parallel rubric
4. Verify anything you are about to encode → `/check-reference`
5. Persist a reusable set as a preset (`ollaya preset create`) or as one bullet in the caller; never paste the ollaya docs into a skill

### 4. Design The Questions

> Goal: questions the model can answer in one forward pass

1. Key every question by an id you choose; the same key returns in `answers`
2. `choice`: 2–24 mutually exclusive options, each with a one-line description, plus an `other` catch-all
3. `score`: 3–5 levels, lowest first, each described concretely
4. `noul`: one statement, no double negative, no two questions in one
5. Name the state field in `instructions` (`` `message` ``, `` `ticket` ``) when the state is an object; keep instructions short and literal
6. Batch related fields into one call — all questions are scored in one pass, so N questions cost less than N calls
7. The seven built-in presets, their state fields, and a full question JSON → [references/presets.md](references/presets.md)

### 5. Run Decisions

> Goal: one call per item, independent items in parallel

1. Pass `state` as a string, or as an object/array whose field names the instructions reference
2. Use a built-in preset when it fits (`triage`, `email`, `guard`, `moderation`, `router`, `agent`); read its resource first
3. One call per item, not one call per question; group independent items per `/follow-parallel`
4. Ceiling 10 concurrent calls; above that, chunk or use a pool (`/follow-parallel`)
5. Key every result by your own id — never rely on completion order
6. One failing item must not cancel the batch; collect per-item errors and continue
7. Never put secrets, tokens, or personal data in `state`; redact to what the question needs

### 6. Act On Answers

> Goal: a threshold decides, not a vibe

1. `choice` → `choice`, `confidence`, `probabilities`; act at `confidence ≥ 0.6`, below that keep the top two as candidates or escalate to `/ask-me`
2. `noul` → `noul` is P(statement true); `≥ 0.8` yes, `≤ 0.2` no, in between escalate or look closer
3. `score` → `score` is the expected level and may sit between levels; compare with your threshold and read `confidence`
4. Tune thresholds on real labeled examples before trusting a gate (`### 7`)
5. State the model and the probability behind each action so a person can audit it
6. Response fields per question type, the acting thresholds, and the audit trail → [references/answer-contract.md](references/answer-contract.md)

### 7. Calibrate

> Goal: prove the model and thresholds agree with reality

1. Take 10–30 items the user already decided and run them as one batch
2. Compare predicted vs known: agreement per question, plus the confidence distribution of the wrong ones
3. Pick the model from measured accuracy and speed, not from the default
4. Move the threshold to the point that separates right from wrong on that sample
5. Agreement still low → change model (`winnow:e4b` for accuracy, `laya` for CPU/multilingual) or rewrite the question
6. Report sample size, model, thresholds, and agreement; a calibration claim without a sample is not evidence

### 8. Report

> Goal: the user sees the decision and its confidence

1. `/report` table: `No. | Item | Question | Answer | Confidence | Action`
2. State the runtime used (MCP/CLI/HTTP), the model, and the threshold per question
3. List items in the escalate band as `needs review`, never as decided
4. Note anything skipped because the runtime or a model was missing

### 9. Wire Into Calling Skills

> Goal: one skill owns the mechanism; callers only ask for a decision

1. A caller names the state, the questions or preset, and the threshold; it never re-implements the runtime order
2. Current callers: `/ask-me`, `/pick-bestest`, `/prioritize`, `/validate-idea`, `/follow-enter-dot`, `/suggest-next-action`, `/apply` — the exact hook per skill is in [references/integrations.md](references/integrations.md)
3. Add a new caller to that file in the same change as the caller's edit
4. The caller keeps its own authority: `/deep-plan`'s score formula and every user confirmation stay untouched

## Model Choice

| Model | Use when | Notes |
|---|---|---|
| `laya` (default) | CPU-only, multilingual, lowest latency | Routes to `laya:en` / `laya:multilingual` |
| `winnow:e4b` | accuracy matters and an NVIDIA GPU exists | Recommended upstream |
| `decider` | a decoder-style model is preferred | `0.8b` / `2b` / `4b` |
| `nli` / `gliclass` | zero-shot yes/no or many options | fast, no fine-tune |
| `qwen3guard` | safety guard with built-in questions | send no `questions` |

- Never assume a model is installed: `list_models` first, `pull_model` second
- Never silently swap models inside a calibrated workflow

## Rules

- Never use a decision model where the answer needs evidence, reasoning, or new text
- Never let an answer replace a user confirmation for a destructive or shared-state action; the `agent` preset may advise `run|ask|block`, the human still decides
- Never put secrets or personal data in `state`; redact first
- Always report the model and the probability behind an action — an action without its confidence is not auditable
- Always escalate inside the uncertainty band instead of guessing
- Always prefer MCP → CLI → HTTP, and report a fallback instead of hiding it
- Never pull a model when the disk is nearly full; report its size and stop
- Never copy the ollaya docs into a skill; point at them and keep only the decisions this repo makes
- Parallel calls must be independent and idempotent; a decision call writes nothing
- Same `state` + `questions` + `model` must give the same answer — no sampling knobs

## Expected Outcome

- A typed answer with confidence for every item, acted on only through an explicit threshold
- Question sets and presets learned from real references instead of invented
- Batches run in bounded parallel with per-item errors reported
- Calibration evidence (sample, model, thresholds, agreement) whenever a gate matters
- Callers wired through `references/integrations.md`, each with one clean hook
