# Answer contract, thresholds, and calibration

## Fields per question type

| `type` | Fields | Meaning |
|---|---|---|
| `choice` | `choice`, `confidence`, `probabilities` | the picked option, its calibrated confidence, and every option's probability |
| `score` | `score`, `confidence`, `legend`, `probabilities` | the expected level (may sit between levels), its confidence, the level labels, per-level probability |
| `noul` | `noul` | P(the statement is true), 0–1 |

Answers arrive under `answers`, keyed by the question id you chose. Probabilities and confidences are rounded to 4 decimal places, so a distribution may sum to 1 ± 0.0005. Key order follows the order in your `questions` object.

## Acting on an answer

| Type | Act when | Otherwise |
|---|---|---|
| `choice` | `confidence ≥ 0.6` | keep the top two as candidates, escalate to `/ask-me`, or look closer |
| `noul` | `noul ≥ 0.8` → yes, `noul ≤ 0.2` → no | in between is the escalate band: never guess |
| `score` | `score` past your threshold | check `confidence` first; a low-confidence score is advisory only |

Thresholds are defaults, not truths. They are tuned on labeled data per question (`## Calibration`). Never publish a decision as final when it sits in the escalate band.

## Calibration on 10–30 labeled items

1. Assemble items the user already decided, with the known label per question.
2. Run them as one batch, one call per item, with the exact questions and model you intend to ship.
3. Compute agreement per question (`predicted == known`), and list the confidence of every wrong answer.
4. Choose the threshold where the right answers sit above and the wrong ones below. If the ranges overlap, the question is ambiguous — rewrite it before moving the threshold.
5. Compare models on the same sample: `laya` (fast, CPU, multilingual) vs `winnow:e4b` (accurate, NVIDIA GPU). Pick by measured agreement at an acceptable latency.
6. Record `sample size | model | threshold per question | agreement`. A calibration claim without these four numbers is not evidence and must not be reported as one.
7. Re-run calibration whenever the model, the question, or the state schema changes.

## Audit trail

Every acted-on decision must carry: model name, question id, answer, confidence, threshold, and the action taken. This is what makes a model-driven action reviewable after the fact, and it is what `/report` prints.

## Determinism

A decision model is a single forward pass with no sampling. The same `state`, `questions`, and `model` produce the same answer. Differences mean the state, the question text, the model tag, or the precision changed.

## Privacy

`state` leaves the process only if you point the client at a remote server. Ollaya is local by default. Still: redact secrets, tokens, and unnecessary personal data before sending a state — the model does not need them to classify.
