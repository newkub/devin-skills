# Lib Fast Check Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs home | https://fast-check.dev |
| Getting started | https://fast-check.dev/docs/introduction/getting-started/ |
| Arbitraries | https://fast-check.dev/docs/core-blocks/arbitraries/ |
| Properties | https://fast-check.dev/docs/core-blocks/properties/ |
| Runners / assert | https://fast-check.dev/docs/core-blocks/runners/ |
| Model-based testing | https://fast-check.dev/docs/tutorials/model-based-testing/ |
| Vitest integration | https://fast-check.dev/docs/integrations/vitest/ |
| Detecting issues | https://fast-check.dev/docs/tutorials/detect-race-conditions/ |

## Key Concepts

- Property-based testing: generate inputs, ตรวจ invariants, shrink counter-examples
- `seed` + `path` ใน failure output → reproduce bug deterministically
- Model-based: `fc.commands` เปรียบเทียบ model vs real implementation
- Race conditions: `fc.scheduledModel` / scheduled helpers
