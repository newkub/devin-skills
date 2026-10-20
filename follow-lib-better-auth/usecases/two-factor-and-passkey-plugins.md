# Use Case — Two-Factor and Passkey Sign-In

> Add TOTP second factors and passkey sign-in through official plugins, keeping the base email/password flow untouched. Source: https://www.better-auth.com/docs/plugins/2fa (accessed 2026-10-20)

## 1. Register the plugins on the server

```ts
import { betterAuth } from "better-auth";
import { passkey, twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  database: /* adapter from the database use case */,
  emailAndPassword: { enabled: true },
  plugins: [
    twoFactor({ issuer: "Acme" }),
    passkey({ rpID: "acme.com", rpName: "Acme" }),
  ],
});
```

`issuer` is what the authenticator app shows next to the code — set it to the product name, not the package name. `rpID` is the registrable domain: `acme.com`, never `https://acme.com` and never `app.acme.com` if the login page lives on the apex.

## 2. Match the client plugin list

```ts
import { createAuthClient } from "better-auth/solid";
import { passkeyClient, twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [twoFactorClient(), passkeyClient()],
});
```

A plugin enabled on only one side produces a 404 on the client call, not a type error. Keep the server and client arrays in the same module-adjacent file so they move together.

## 3. Enrol and verify a TOTP factor

```ts
async function enableTwoFactor(password: string) {
  const { data, error } = await authClient.twoFactor.enable({ password });
  if (error) throw new Error(error.message);

  showQrCode(data.totpURI);
  return data.backupCodes;
}

async function confirm(code: string) {
  await authClient.twoFactor.verifyTotp({ code });
}
```

Show `backupCodes` exactly once and let the user download them. They are not retrievable later, and losing them means a support ticket per locked-out user.

`enable()` re-checks the password on purpose: a stolen session must not be able to attach a new factor silently.

## 4. Handle the redirect challenge at sign-in

```ts
const { data, error } = await authClient.signIn.email({ email, password });
if (!error && data?.twoFactorRedirect) {
  return navigate("/two-factor");
}
```

With 2FA enabled the password step does not return a session — it returns `twoFactorRedirect: true`. Any guard that assumes "no error means signed in" will let the user into a half-authenticated state.

## 5. Passkeys

```ts
await authClient.passkey.addPasskey({ name: "MacBook" });
await authClient.signIn.passkey();
```

Registration needs a user session; sign-in does not. Both require a secure context (HTTPS or `localhost`) — the WebAuthn API is absent over plain HTTP on a LAN address.

## 6. Verify

1. `/run-test` — a user without 2FA still signs in with one call
2. Enrol, sign out, sign in — the challenge appears, and an expired code is rejected
3. Use a backup code once, then again — the second attempt must fail
4. `/run-dev` over HTTPS, register a passkey in a browser profile, sign in from the same profile
5. Confirm `twoFactorEnabled` and the passkey rows land in the database, not only in the session

## Pitfalls

- Adding a server plugin without its client counterpart, then debugging a 404 as if the route were missing.
- Treating `twoFactorRedirect` as success and issuing your own session cookie.
- `rpID` set to a subdomain while the callback runs on the apex — passkey registration fails with a security error.
- Letting the enrolment page be reachable while signed out; `enable()` needs a password and a session.
- Logging `totpURI` or backup codes to the console or an error tracker.

## Related

- `references/apis.md`
- `best-practices/better-auth.md`
- `usecases/email-password-and-session.md`
- `usecases/database-adapter-and-migrations.md`
