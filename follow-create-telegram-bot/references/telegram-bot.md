# Telegram Bot Reference

## Official Sources

- Telegram Bot API: https://core.telegram.org/bots/api
- Getting started: https://core.telegram.org/bots/tutorial
- BotFather: https://t.me/botfather

## Recommended Libraries

- `grammy`: TypeScript-first framework, auto-generated types from Bot API. Recommended for Bun/Node.
- `node-telegram-bot-api`: thin wrapper, v2 runs on Bun and Cloudflare Workers.
- `gramio`: TypeScript-first with type propagation and plugins.
- `@photon-ai/telegram-ts`: typed client + Zod schemas, universal runtime.

## Bot Token

Create a bot and get token via @BotFather:

1. Start chat with @BotFather
2. Send `/newbot`
3. Set name and username
4. Copy token to `.env.local` or host env

## Long Polling vs Webhook

- `bot.start()`: long-polling, easiest for local dev.
- `webhookCallback(bot, 'express'|'hono'|'fastify')`: use for production with a public URL.
- Webhook path should include token as a secret, e.g. `/webhook/${process.env.BOT_TOKEN}`.

## Key Concepts

- Updates: messages, callback queries, inline queries, edited messages.
- Middleware: runs for every update; use `await next()` to continue.
- Commands: register with `bot.api.setMyCommands([{ command, description }])`.
- Sessions: store user state with `session()` middleware.
- Parse modes: `MarkdownV2`, `HTML`, no escaping needed with tagged templates in `gramio`.

## Best Practices

- Never commit `BOT_TOKEN`.
- Use webhooks for scalable production; long-polling only for dev or small bots.
- Validate untrusted input before replying or calling APIs.
- Add error handler with `bot.catch` to log and recover.
