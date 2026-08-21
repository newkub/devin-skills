---
title: Product Documentation Reference
description: Reference for product docs nav, sidebar, and content
---

# Product Documentation Reference

Use this for projects with authentication, user roles, admin panels, or paid plans.

## Detection

A project is `product` when any of these are found:

- `package.json` has auth dependencies: `next-auth`, `clerk`, `supabase-auth`, `lucia`, `passport`, `firebase-auth`
- `package.json` has `private: true` or a commercial license
- `.env` has `AUTH_`, `JWT_`, `CLERK_`, `NEXTAUTH_`, `SUPABASE_`, `FIREBASE_`, `OAUTH_` variables
- Files exist: `auth.config.*`, `src/auth/`, `middleware.ts`, `routes/login.*`, `app/login.*`
- Code contains `login`, `signin`, `auth` in API routes

## Nav

`Project`, `Features`, `Auth`, `Admin`, `Review`, `Release`, `Development`

## Sidebar

- `project/` - overview, features, workspaces (monorepo)
- `getting-started/` - installation, usage
- `references/` - auth, admin, pricing
- `development/` - setup, architecture, workflows, testing, CI/CD, scripts, troubleshooting

## Content Focus

- `project/overview.md`: value proposition, target users, architecture
- `references/auth.md`: login flows, roles, sessions, endpoints
- `references/admin.md`: admin features, permissions
- `references/pricing.md`: plans, limits, billing (optional)
