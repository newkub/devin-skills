# Use Case — Sync API, Plugins, and Typed Errors

> Pick the crypto plugin that matches the runtime, keep the synchronous path only where it is supported, and turn library exceptions into 400s instead of 500s. Source: https://otplib.yeojz.dev/guide/runtime-compatibility (accessed 2026-10-20)

## 1. Choose the plugin per runtime

| Runtime | Crypto plugin | Why |
|---------|---------------|-----|
| Node.js server | `@otplib/plugin-crypto-node` | Native `node:crypto`, fastest |
| Bun / Deno / universal | `@otplib/plugin-crypto-noble` | Pure JS, audited, same result everywhere |
| Browser / edge | `@otplib/plugin-crypto-web` | Web Crypto, async only |

```ts
import { generateSecret, generate, verify } from "otplib";
import { crypto } from "@otplib/plugin-crypto-node";
import { base32 } from "@otplib/plugin-base32-scure";

const secret = generateSecret({ crypto, base32 });
const token = await generate({ secret, crypto, base32 });
const result = await verify({ secret, token, crypto, base32 });
```

The main package defaults to the noble plugin, so plain `generate({ secret })` already works. Pass plugins explicitly when you need a specific one — a Bun service and a Node worker that pick different defaults can still interoperate because the algorithm is identical, but benchmark and error behavior are not.

## 2. Keep the sync API off the web plugin

```ts
import { generateSync, verifySync } from "otplib";
import { crypto } from "@otplib/plugin-crypto-node";
import { base32 } from "@otplib/plugin-base32-scure";

const token = generateSync({ secret, crypto, base32 });
const result = verifySync({ secret, token, crypto, base32 });
```

`generateSync`/`verifySync` work with `plugin-crypto-node` and `plugin-crypto-noble`. `@otplib/plugin-crypto-web` is async-only and throws on the sync path — Web Crypto has no synchronous digest. Use the sync pair only where a synchronous call is forced (a CLI, a legacy adapter, a synchronous migration script); everywhere else stay on `await`.

## 3. Reach for the Result pattern when callers must not throw

```ts
import { wrapResult, wrapResultAsync, generateSync, verify } from "otplib";

const safeGenerate = wrapResult(generateSync);
const safeVerify = wrapResultAsync(verify);

const generated = safeGenerate({ secret });
if (!generated.ok) return badRequest(generated.error.message);
const token = generated.value;

const checked = await safeVerify({ secret, token });
if (!checked.ok) return badRequest(checked.error.message);
if (!checked.value.valid) return deny("invalid_code");
```

`wrapResult` / `wrapResultAsync` return `{ ok: true, value }` or `{ ok: false, error }`, so a handler reads linearly with no `try/catch` around the library call.

## 4. Catch the specific error, not `Error`

```ts
import { AlgorithmUnsupportedError, HMACError } from "otplib";
import { OTPError, SecretTooShortError, TokenLengthError } from "@otplib/core";

try {
  await verify({ secret, token });
} catch (error) {
  if (error instanceof TokenLengthError) return deny("code_must_be_6_digits");
  if (error instanceof SecretTooShortError) return fail("stored_secret_corrupt");
  if (error instanceof AlgorithmUnsupportedError) return fail("unsupported_algorithm");
  if (error instanceof HMACError) return fail("crypto_plugin_failed");
  if (error instanceof OTPError) return fail("otp_error");
  throw error;                              // not ours: let it reach the 500 handler
}
```

| Error | Meaning | Response |
|-------|---------|----------|
| `TokenLengthError` / `TokenFormatError` | User typed fewer digits or letters | 400, retryable |
| `SecretTooShortError` | Stored secret is below 16 bytes | 500, data corruption |
| `CryptoPluginMissingError` | No plugin supplied where one is required | 500, wiring bug |
| `AlgorithmUnsupportedError` | `sha384` or a typo from an imported URI | 400 at enrollment, 500 at login |
| `CounterToleranceTooLargeError` / `EpochToleranceTooLargeError` | Config above the max (100 counters / 3000 s) | 500, config bug |

`SecretTooShortError` is the one that fires most often in practice: `generateSecret(8)` looks fine until verification. The minimum is 16 bytes, the maximum 64.

## 5. Normalize the input before it reaches the library

```ts
const normalized = token.replace(/\s+/g, "");
if (!/^\d{6,8}$/.test(normalized)) return deny("invalid_code");
```

An authenticator app displays `123 456`; users paste the space. Validating the shape first keeps `TokenFormatError` out of the logs and keeps the error table meaningful.

## 6. Verify

1. `generate({ secret, crypto })` with `plugin-crypto-node` and again with `plugin-crypto-noble` — the same token for the same `epoch`
2. `generateSync` with the web plugin — throws, confirming the async-only boundary
3. `safeVerify` with a 3-digit token — `ok: false` with `TokenLengthError`, not an unhandled rejection
4. `generateSecret(8)` then verify — `SecretTooShortError` is caught and mapped, not a 500 with a stack trace
5. `algorithm: "sha384"` — `AlgorithmUnsupportedError`, no silent fallback to sha1
6. `/run-test` — one test per row of the error table
7. `/run-verify` — no `any` on the error branch; every catch narrows with `instanceof`

## Pitfalls

- Calling `generateSync` in a Cloudflare Worker that uses the web plugin — it throws at runtime, not at build time.
- Catching `Error` and returning 500 for a mistyped token, so monitoring fills with user typos.
- Passing `crypto` but forgetting `base32` when the secret is a Base32 string — a missing plugin error, not an invalid code.
- Mixing a raw-byte secret with the Base32 plugin, or the reverse.
- Assuming the default plugin matches production — pin the import in one shared module.
- Letting `AlgorithmUnsupportedError` fall back to sha1, producing codes no client accepts.
- Logging `error.cause` from the plugin, which can include the secret in the HMAC input.

## Related

- `references/apis.md`
- `best-practices/totp-2fa.md`
- `usecases/enroll-totp-2fa.md`
- `usecases/hotp-counter-and-replay.md`
- `usecases/secret-storage-and-rotation.md`
