# Oauth Sso And Federation Checklist — review-auth

## OAuth 2.0 / OIDC Flow

- [ ] `state` parameter — random, session-bound, verified on callback (CSRF)
- [ ] `nonce` — for implicit/hybrid flows, replay protection
- [ ] PKCE — `code_challenge`/`code_verifier` for public clients (S256, not plain)
- [ ] redirect URI — exact match allowlist, no wildcards/substring matching
- [ ] `response_type` — `code` only (not `token`/`id_token` implicit)
- [ ] scope minimality — request only needed scopes, not `openid profile email offline_access` blanket

## Token Validation

- [ ] `iss` (issuer) — matches expected IdP, no string containment check
- [ ] `aud` (audience) — client_id or resource indicator, not just present
- [ ] `exp`/`iat`/`nbf` — expiry checked, not just signature
- [ ] signature — RS256/ES256 verified against JWKS, not `alg=none` or HS256 with public key
- [ ] `kid` — key ID from JWKS endpoint, rotated keys handled
- [ ] `azp` (authorized party) — when multiple audiences, correct client

## Provider Configuration

- [ ] discovery document — `.well-known/openid-configuration` fetched, not hardcoded
- [ ] JWKS caching — keys cached with TTL, refreshed on `kid` miss
- [ ] endpoint validation — auth/token/userinfo endpoints from discovery, not guessed
- [ ] client_secret — stored securely, not in frontend/config files
- [ ] clock skew — `exp`/`nbf` tolerance (30s-5min) configured

## Social Login Specifics

- [ ] email verification — trust provider's `email_verified` claim (Google/Apple verify, others may not)
- [ ] provider quirks — Facebook/LinkedIn return unverified emails, Twitter no email by default
- [ ] profile data — `sub` (provider ID) used as identity, not email (changeable)
- [ ] scope requests — minimal (public_profile, email), not friends/posts/etc.
- [ ] app review — provider app in production mode, not development/test

## SAML / Enterprise SSO

- [ ] signature validation — response/assertion signed, algorithm allowlist (RSA-SHA256+)
- [ ] assertion expiry — `NotOnOrAfter`, `NotBefore` checked
- [ ] audience restriction — `AudienceRestriction` matches SP entity ID
- [ ] IdP metadata — from trusted source, not user-provided URL
- [ ] name ID — `NameID` format persistent, not email if changeable
- [ ] session index — `SessionIndex` for single logout
- [ ] encryption — assertions encrypted when required

## Account Linking

- [ ] same-email linking — policy for linking OAuth to existing account
- [ ] verified email required — only link if provider confirms email ownership
- [ ] manual link — user confirms linking, not automatic
- [ ] takeover prevention — can't link to account with different verified email
- [ ] unlink safety — can't remove last auth method (password + OAuth both removed = lockout)

## Enterprise Features

- [ ] SCIM provisioning — user create/update/delete via IdP sync
- [ ] group mapping — IdP groups → app roles, not manual assignment
- [ ] just-in-time provisioning — account created on first SSO login
- [ ] attribute mapping — `email`, `name`, `groups` from assertion to profile
- [ ] multi-tenant — org-specific IdP configs, not global

## Session And Federation

- [ ] SSO session — IdP session duration vs app session, re-auth policy
- [ ] single logout — logout propagates to IdP (SLO) or app-only clear
- [ ] front-channel logout — IdP-initiated logout handled
- [ ] session fixation — new session ID after SSO login
- [ ] token refresh — `offline_access` refresh tokens for long-lived API access

## Security Boundaries

- [ ] token storage — access/refresh tokens server-side, not localStorage
- [ ] token transport — `Authorization: Bearer` header, not URL/cookie
- [ ] CSRF on callback — `state` verified, not just presence
- [ ] open redirect — `redirect_uri` validated, no `javascript:` or `data:` schemes
- [ ] token leakage — access token not in logs, URLs, error messages

## Compliance And UX

- [ ] consent screen — user sees what data shared, can deny
- [ ] terms/privacy — linked from consent flow
- [ ] error handling — `access_denied`, `invalid_request` user-friendly
- [ ] fallback — SSO failure doesn't lock user out (password alternative)
- [ ] branding — provider logos/names per guidelines (Google "Sign in with Google")

## Detection

- grep OAuth endpoints — `callback`, `authorize`, `token`, `userinfo`
- grep JWT validation — `iss`, `aud`, `exp`, `verify`, `decode`
- grep redirect handling — `redirect_uri`, `state`, `nonce`
- test callback — tampered `state`, wrong `redirect_uri`, expired token → reject

Severity: missing `state`/PKCE = Critical, `alg=none` accepted = Critical, unverified `iss`/`aud` = Critical, token in URL = High, missing linking confirmation = High
