# Step: Write Root README

> Goal: Write the main README of the monorepo

## Execute

1. Run `/deep-analyze` to gather root information
2. Read `manifest files`, `source code`, `config files`
3. Write the README following the template in `template-example.md`
4. Use the data from Step Prepare:
   - status → `>` callout (red/green badge)
   - has `CONTRIBUTING.md` → include the `## Contributing` section
   - has `LICENSE.md` → include the `## License` section
5. If the data is incomplete → stop and report; don't use placeholders
6. If the write fails → retry (max 3 → stop/report)

## Rules

- No `>` description at the top — status badge only
- `#` Title is the first line of the README
- `## Get Started` uses a plain numbered list, no `###` subsection
- `## Features` 5 columns (Icon, Feature, Description, Benefit, Usage)
- No separate `## API References` — references go in the Usage section
- No ANSI codeblock at the very bottom

