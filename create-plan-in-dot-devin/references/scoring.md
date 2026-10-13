# Feature Scoring

## Goal

Compute a priority score for each feature using the same formula so they can be ranked

## Scale

| Dimension | High | Medium | Low |
|---|---:|---:|---:|
| Impact | 10 | 6 | 3 |
| Effect | 10 | 6 | 3 |
| Risk | 3 | 2 | 1 |

| Phase | Multiplier |
|---|---:|
| MVP | 1.0 |
| v2 | 1.5 |
| v3 | 2.0 |
| Done | 0.5 |

## Formula

```text
Score = (Impact + Effect) / (Risk × Phase)
```

- Round to 1 decimal place
- Use the score to rank priority from high to low
- If scores are equal, rank by lower Risk first

## Report Format

- Show the scale before the table
- Show the formula in the plan body
- Every row in the features table must have a real score
