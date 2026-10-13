# Step: Validate

> Goal: Check quality and update references

## Execute

1. `/deep-review`, `/update-references` to check quality and update references at the same time
2. Verify that the README has all sections per Rule `Section Order And Format`
3. Verify that:
   - no `>` description at the top (status badge only)
   - `## Get Started` has no `###` subsection
   - `## Features` has 3 columns (no Benefit, Usage)
   - no separate `## API References`
   - no ANSI codeblock at the very bottom
   - `## Contributing` only if `CONTRIBUTING.md` exists
   - `## License` only if `LICENSE.md` exists
4. If validation fails → revise and recheck (max 3 times → stop/report)

## Checklist

- [ ] Status callout (red/green badge)
- [ ] Hero section (title + badges) — no ANSI below the badges
- [ ] UI Sketch (text codeblock above Get Started)
- [ ] Get Started (numbered, no `###`)
- [ ] Features (3 columns)
- [ ] Usage (with ANSI drawing + inline references)
- [ ] Contributing (if CONTRIBUTING.md exists)
- [ ] License (if LICENSE.md exists)
- [ ] No bottom ANSI
- [ ] No `## API References`
- [ ] All ANSI lines are the same length (aligned border)

