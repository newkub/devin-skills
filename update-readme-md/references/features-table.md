# Features Table

> Goal: Write the `## Features` table with all 5 columns, covering business value and usage

## Columns

| Icon | Feature | Description | Benefit | Usage |
|:---:|:--------|:------------|:--------|:------|

- `Icon` — centered with `:---:`, using the iconify CDN with `?color=%23<hex>&width=16`
- `Feature` — a short feature name
- `Description` — explain what it does
- `Benefit` — business value, e.g. Saves time, Reduces errors
- `Usage` — a short usage example, e.g. `generate()` or `bunx my-app generate`

## Rules

- Coverage: cover every feature from the source code, with no omissions
- Concise Rows: keep each row concise, no long Descriptions
- Business-Focused: write business value, not just technical details
- Never use emoji in the table — use icon sets: `mdi`, `lucide`, `material-symbols`, `tabler`, `ph`, `iconoir`
- Each icon must use a distinct color parameter

## Example Row

| Icon | Feature | Description | Benefit | Usage |
|:---:|:--------|:------------|:--------|:------|
| ![icon](https://api.iconify.design/mdi:rocket.svg?color=%23303f9f&width=16) | Password Generation | Generate strong random passwords | Saves time and removes weak passwords | `generate()` or `bunx gen-password generate` |

