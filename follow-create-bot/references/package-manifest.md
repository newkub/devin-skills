# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `discord.js` |
| Registry | `npm` |
| Latest Version | `14.27.0` |
| Release Date | `2026-07-15` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `discord.js organization` |
| License | `Apache-2.0` |
| Repository | `https://github.com/discordjs/discord.js` |
| Website | `https://discord.js.org` |
| Documentation | `https://discord.js.org/docs` |
| Releases / Changelog | `https://github.com/discordjs/discord.js/releases` |

## Install

```bash
bun add discord.js
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `grammy` | `npm` | `1.46.0` (2026-08-26) | Telegram Bot API framework |
| `@slack/bolt` | `npm` | `5.1.0` (2026-09-02) | Slack app framework (requires Node.js >=20) |
| `@line/bot-sdk` | `npm` | `11.2.0` (2026-07-07) | LINE Messaging API SDK |
| `probot` | `npm` | `14.3.2` (2026-04-03) | GitHub App/bot framework |

## Notes

- Breaking changes in latest major: `@line/bot-sdk` v11 removed legacy `Client`/`OAuth` (use `LineBotClient.fromChannelAccessToken()` or `messagingApi.MessagingApiClient`); `@slack/bolt` v5 dropped `agent`/`clientTls` options and `WorkflowStep`/`app.step()` (use `app.function()`); `discord.js` v14 deprecated `ready` event (use `Events.ClientReady`, removed in v15).
- Version pinned in SKILL.md: `discord.js@14.27.0`, `grammy@1.46.0`, `@slack/bolt@5.1.0`, `@line/bot-sdk@11.2.0`, `probot@14.3.2`
- Primary varies by platform argument — each platform SDK is primary for its subskill.
