# Use Case — Organizations and Multi-Tenant Sessions

> Give each user a set of organizations, switch the active one without re-authenticating, and scope every query to it. Source: https://www.better-auth.com/docs/plugins/organization (accessed 2026-10-20)

## 1. Enable the plugin and its roles

```ts
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      creatorRole: "owner",
    }),
  ],
});
```

Default roles are `owner`, `admin`, and `member`. `creatorRole` decides what the first user of a new organization can do — leaving it as `member` produces an organization nobody can administer.

## 2. Create, invite, and switch on the client

```ts
import { authClient } from "@/lib/auth-client";

const { data: org } = await authClient.organization.create({
  name: "Acme",
  slug: "acme",
});

await authClient.organization.inviteMember({
  organizationId: org.id,
  email: "teammate@acme.com",
  role: "admin",
});

await authClient.organization.setActive({ organizationId: org.id });
```

`setActive()` stores the active organization on the session. Every later request carries it, so the server does not need the client to pass an id per call — which also means a stale tab can act inside an organization the user just left.

## 3. Read the active organization on the server

```ts
import { auth } from "@/lib/auth";

export async function requireOrg(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session?.session.activeOrganizationId) {
    throw new Response("no active organization", { status: 403 });
  }
  return session.session.activeOrganizationId;
}
```

Resolve the organization from the session, never from a request body or query parameter. Any query that takes an `organizationId` from the client must still compare it to this value.

## 4. Enforce membership on every scoped query

```ts
const orgId = await requireOrg(request.headers);

const projects = await db
  .select()
  .from(project)
  .where(eq(project.organizationId, orgId));
```

The session proves the user is authenticated; the plugin proves they belong to the organization they activated. Both checks live server-side — a hidden button is not an authorization boundary.

## 5. Verify

1. `/run-test` — a member of org A cannot read org B's rows with a forged `organizationId`
2. Switching organizations invalidates cached lists that were not keyed by organization
3. Remove a member, then reload their tab — the next request is rejected
4. `/deep-test api` — an invite to an existing member returns a conflict, not a duplicate row

## Pitfalls

- Trusting a client-supplied `organizationId` because the UI hides other organizations.
- Caching data without the organization in the cache key, so switching tenants shows the previous tenant's rows.
- Leaving `creatorRole` at the default and ending up with an unadministerable organization.
- Treating an invitation as membership before it is accepted; roles apply after acceptance.
- Using the organization slug as the tenant key — it is renameable; use the id.

## Related

- `references/apis.md`
- `best-practices/better-auth.md`
- `usecases/social-login-and-route-protection.md`
- `usecases/database-adapter-and-migrations.md`
