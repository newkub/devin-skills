---
title: Docs Navigation Reference
description: The nav contract for plain-markdown docs/ — group order, what belongs in each group, and the placement rules
---

# Docs Navigation Reference

Plain markdown has no nav config: `docs/index.md` is the nav, and one `##` group is the sidebar a
reader sees beside its pages. The contract below keeps a reader seeing every product area exactly
once — no concept with two doors, no page reachable only by guessing a path.

`templates/docs-index.md` is the skeleton; this file decides which line goes where.

## Group Order

A group is a real directory under `docs/` — never a container invented to sort links.

| # | Group | Pages | Answers |
|---|-------|-------|---------|
| 1 | Project | `project/overview.md`, `project/decisions/NNNN-*.md` | what the project is, and why the non-obvious choices were made |
| 2 | Workspaces | `project/workspaces.md`, `workspaces/<name>.md` | the repo map, then one page per standalone workspace (monorepo only) |
| 3 | Getting Started | `getting-started/installation.md`, `quickstart.md`, `usage.md` | how to run it, the shortest path to a first result, then the route map |
| 4 | Features | `features/index.md`, `features/<area>.md` | the feature index, then one page per product area |
| 5 | Development | `development/setup.md`, `architecture.md`, `data-model.md`, `workflows.md`, `testing.md`, `deployment.md`, `troubleshooting.md` | how to change the code safely |
| 6 | Operations | `operations/*.md` | what runs on a schedule, how to see it, how to recover it (SaaS only) |
| 7 | References | `references/*.md` | tables: api, errors, webhooks, auth, billing, configuration, security, i18n, glossary |
| 8 | Roadmap | `roadmap/index.md` | now / next / later |

`development/data-model.md` exists only when the project owns a schema — a library or a CLI has no
data model page. A type file adds the groups its product shape needs (`Commands` for `cli`, `Guides`
for `opensource-product`, `Review`/`Release` for `product`); it never reorders the groups above.

## Placement Rules

1. **One door per concept.** The group index is that concept's only nav line — `features/index.md`
   is the Features door, and the exhaustive table (`project/features.md`) is linked from inside it,
   never repeated in the nav. Two lines for one concept make the reader choose for no reason.
2. **A family stays in the group that names it.** The repo map (`project/workspaces.md`) and every
   `workspaces/<name>.md` sit together under Workspaces; the map is not a Project line.
3. **Every real directory appears exactly once, in base order.** A group with no pages is not linked,
   and never created as an empty placeholder.
4. **A group index is the first entry, not the whole group.** List `features/index.md` and each area
   page; a directory (`references/`) is not a page and never becomes a nav line.
5. **Every entry carries an em-dash line** saying what the page answers — not a restatement of its title.
6. **Nav changes with the page.** A page added without a nav line is unreachable; `/update-references`
   proves links resolve, not that every page was listed.
7. **Groups stay flat.** Sub-pages are their own lines in the same group; ADRs share one `Decisions`
   line instead of one line each.
8. **`.md` paths only.** `references/api.md` — yes; `references/` — no; `/references/api` — no.

## Per Type

| Type | Groups It Adds | Notes |
|------|----------------|-------|
| `cli` | `Commands` after Getting Started | one line per command group |
| `library` | — | References carries api, comparison, performance, glossary, migration, changelog, contributing |
| `sdk` | — | References carries endpoints, events/webhooks, errors, migration |
| `tool` | — | References carries commands or api, configuration, changelog |
| `website` | — | References carries configuration, deployment, troubleshooting |
| `open-source` | `Review`, `Release` | Getting Started may be absent; no Operations |
| `opensource-product` | `Guides` | Guides sits after Getting Started |
| `product` | `Auth`, `Admin`, `Review`, `Release` | no Operations; Features may stay at `features/index.md` only |
| `saas-product` | `Operations` | Features is always `features/index.md` + one page per surface; References adds errors, webhooks, billing |
| `monorepo` | `Workspaces` | the map first, then one page per workspace |

## Verify

1. List the pages that exist (`git ls-files 'docs/**/*.md'` or a directory walk) and the nav lines in
   `docs/index.md` — every page appears once, and no line points at a file that is gone.
2. Resolve every relative link in `docs/` — zero broken.
3. Grep the nav targets for duplicates — one page, one group, one line.
4. Grep for `](/` and `](…/)` shapes — a directory or a site route is never a nav target.
