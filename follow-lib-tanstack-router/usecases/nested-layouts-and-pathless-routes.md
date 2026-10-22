# Use Case — Nested Layouts With Pathless Routes

> Compose a shell, a section layout, and a leaf page so each level owns its own data and chrome, without polluting the URL with route names. Source: https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing (accessed 2026-10-20)

## 1. Shape the tree

```
src/routes/
├── __root.tsx                 # html shell + global providers
├── _app.tsx                   # pathless layout: sidebar + auth guard
├── _app/index.tsx             # "/"
├── _app/projects.tsx          # layout for the projects section
├── _app/projects/index.tsx    # "/projects"
├── _app/projects/$projectId.tsx   # "/projects/:projectId"
└── login.tsx                  # "/login" (outside the shell)
```

A leading `_` makes the route pathless: `_app.projects.tsx` wraps its children without adding `/app` to the URL. Keep the shell pathless and reserve URL segments for things a user can link to.

## 2. Each level renders its own `<Outlet/>`

```tsx
// src/routes/_app.tsx
export const Route = createFileRoute("/_app")({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw redirect({ to: "/login", search: { redirect: location.href } });
  },
  component: () => (
    <div className="app-shell">
      <Sidebar />
      <main><Outlet /></main>
    </div>
  ),
});
```

```tsx
// src/routes/_app/projects.tsx
export const Route = createFileRoute("/_app/projects")({
  component: () => (
    <section>
      <ProjectTabs />
      <Outlet />          {/* index or $projectId renders here */}
    </section>
  ),
});
```

The leaf renders only its own content; unmounting the section (navigating to `/`) tears down the tabs but keeps the shell mounted.

## 3. Load data at the level that renders it

```tsx
// section layout: data shared by every child
export const Route = createFileRoute("/_app/projects")({
  loader: () => api.projects(),
  component: () => {
    const projects = Route.useLoaderData();
    return <><ProjectTabs projects={projects} /><Outlet /></>;
  },
});
```

A loader on the layout runs once for the section; a loader on `$projectId` runs per leaf. Duplicating the section fetch in every child is the usual cause of a request per tab click.

## 4. Get the pathless route's context right

```tsx
// Route.useRouteContext is typed per level
const { auth } = Route.useRouteContext({ from: "/_app" });
```

Read context `from` the route that provides it. Reading `useRouteContext()` without `from` in a deeply nested component picks the nearest match and loses the tightening the types give you.

## 5. Verify

1. `/run-dev` — `/projects/42` renders shell → section tabs → detail; the URL has no `_app`
2. `/run-typecheck` — `<Link to="/_app/projects/$projectId" params={{ projectId }} />` compiles; a wrong param name does not
3. Navigate between sibling tabs — the shell does not remount (sidebar scroll position survives)
4. Log out from a child — the guard redirects and the shell is never rendered
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Naming a layout route without `_` → `/app/projects` appears in every URL and in every shared link.
- Forgetting `<Outlet/>` in a layout → children render nowhere and the page looks blank with no error.
- Loading section data inside each child → N requests for one navigation; lift it to the layout loader.
- A guard on the pathless route that also guards `/login` → an infinite redirect; keep login outside the guarded subtree.
- Deep-importing a route component by file path → bypasses code splitting and the type registration; use `<Link>` or `useNavigate`.

## Related

- `references/apis.md`
- `best-practices/tanstack-router.md`
- `usecases/auth-guards-with-beforeload.md`
- `usecases/route-error-and-not-found-boundaries.md`
