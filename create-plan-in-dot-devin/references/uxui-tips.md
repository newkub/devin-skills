# UX/UI Tips For Plan Files

## Goal

Make the generated plan files easy to read, well-formatted, and genuinely usable in any markdown renderer

## Visual Hierarchy

- Use `##` for main sections
- Use `###` for subsections
- Never skip heading levels
- Use `>` only for short highlights

## Icons And Color

- Use Iconify CDN icons in the `Icon` column and in headings
- Use a color query `?color=%23hex` to signal levels, e.g. green for Low risk, red for High risk
- Avoid emoji unless necessary

## Tables

- Use English Title Case for header rows
- Keep cell data short, no more than 1-2 lines
- Use plain alignment (no need to specify it)

## Diagrams

- Place ANSI diagrams inside `<div align="center">`
- Use a code block within plain text
- Do not use images without real evidence

## Checkboxes

- Use `- [ ]` for acceptance criteria
- One checkbox per criterion
- State the required action clearly

## Accessibility

- Don't rely on color alone
- Pair icons with text labels
- Avoid overly wide tables
