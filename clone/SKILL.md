---
name: clone
description: Rebuild a product from its repo or from a live site with my techstack
argument-hint: "<repo|product> <owner/repo-or-url|url-or-name>"
related: [follow-my-techstack, follow-create-web, deep-test, ship, report-before-after]
---

# Clone

## Goal

Rebuild an existing product either from its GitHub repository or from a live
site, using the canonical tech stack, then verify parity and report the gaps.

## Scope

Two modes:

| Mode | Input | Behavior |
| --- | --- | --- |
| `repo` | `owner/repo` | Copy structure and behavior from the source repository onto the canonical stack. |
| `product` | `url` or `name` | Rebuild the product from a live site by observing its behavior. |

Applies to web products (landing, SaaS, dashboards). Out of scope for native
mobile apps, desktop apps, or anything that requires the original source to
function. See also: `/follow-my-techstack`; scaffold a greenfield rebuild with
`/follow-create-web` when there is no source to mirror.

## Execute

### 1. Pick Mode And Target

> Goal: one mode and one unambiguous target before any rebuild starts

1. Read the first argument as the mode. If it is missing or not one of
   `repo` / `product`, ask and stop.
2. Read the remaining arguments as the target.
3. Confirm the target with the user when it is ambiguous (bare name without
   owner, or a URL that could be several products).

### 2. Run The Workflow

> Goal: the rebuild follows the selected workflow end to end

1. Open the matching workflow:

| Mode | Workflow |
| --- | --- |
| `repo` | `workflows/repo/SKILL.md` |
| `product` | `workflows/product/SKILL.md` |

2. Follow the workflow end to end from the target.
3. Run `/ship` once the rebuild works locally and evidence is collected.
4. Report parity results using `/report-before-after` (source vs rebuild).

### 3. Verify

> Goal: parity is proven, not assumed

1. Run `/deep-test` on the rebuilt product: golden path plus the edge cases
   observed in the source.
2. Produce a parity matrix — feature, source state, rebuild state, gap.
3. Report every gap honestly; a hidden gap is a failed clone.

## Rules

### 1. Scope Of Copying

- Never copy proprietary assets, logos, brand names, private data, or paid
  content. Rebuild behavior, not identity.
- Rebuild the product's capabilities only where the user owns the rights or
  the source license permits it.
- Stop and ask when the license is unclear or the request implies republishing
  someone else's paid product.

### 2. Stack Fidelity

- Use the canonical tech stack from `/follow-my-techstack`; the clone must run
  on it even when the source used something else.
- Do not import the source's framework just to match it. Map concepts instead.

### 3. Evidence

- Every parity claim needs evidence: URL, screenshot, response body, or test
  name. No unverified "done".
- If a source behavior cannot be reproduced, record it as a gap with the reason.

## Expected Outcome

- The product exists on the canonical stack and runs locally.
- A parity matrix lists what matches and what does not, with reasons.
- No proprietary assets copied; licensing or ownership concerns surfaced
  before any work started.
