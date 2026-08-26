# LINE Bot Reference

## Official Sources

- LINE Messaging API: https://developers.line.biz/en/docs/messaging-api/
- Bot SDK for Node.js: https://line.github.io/line-bot-sdk-nodejs/
- GitHub: https://github.com/line/line-bot-sdk-nodejs
- LINE Developers Console: https://developers.line.biz/console/

## Bot Credentials

- `LINE_CHANNEL_ACCESS_TOKEN`: Channel access token สำหรับเรียก Messaging API
- `LINE_CHANNEL_SECRET`: Channel secret สำหรับ verify webhook signature
- สร้างได้ที LINE Developers Console → Messaging API → Channel settings

## Webhook Signature Validation

- LINE ส่ง `x-line-signature` header มากับทุก request
- ใช้ HMAC-SHA256 ของ raw request body ด้วย channel secret
- ใน `@line/bot-sdk` ใช้ `validateSignature(body, channelSecret, signature)`

```typescript
import { validateSignature } from '@line/bot-sdk'

const valid = validateSignature(rawBody, channelSecret, signature)
```

## Basic Webhook Server With Hono

```typescript
import { Hono } from 'hono'
import { Client, WebhookEvent, validateSignature } from '@line/bot-sdk'

const app = new Hono()
const client = new Client({ channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN! })

app.post('/webhook', async (c) => {
  const raw = await c.req.text()
  const signature = c.req.header('x-line-signature')
  if (!validateSignature(raw, process.env.LINE_CHANNEL_SECRET!, signature!)) {
    return c.text('Forbidden', 403)
  }
  const body = JSON.parse(raw)
  await Promise.all((body.events as WebhookEvent[]).map(handleEvent))
  return c.json({})
})

async function handleEvent(event: WebhookEvent) {
  if (event.type === 'message' && event.message.type === 'text') {
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: `Echo: ${event.message.text}` }],
    })
  }
}

export default app
```

## Common Event Types

- `message`: user ส่งข้อความ รูป สติกเกอร์ หรือ location
- `follow`: user เพิ่ม bot เป็นเพื่อน
- `unfollow`: user บล็อก bot
- `join`/`leave`: bot เข้า/ออก group หรือ room
- `postback`: user กด postback action
- `beacon`: user เข้าใกล้ beacon

## Sending Messages

- `client.replyMessage({ replyToken, messages })`: ตอบกลับภายใน 1 นาที
- `client.pushMessage({ to, messages })`: ส่งข้อความไปหา user/group โดยไม่ต้อง reply token
- `client.multicast({ to, messages })`: ส่งหลาย user พร้อมกัน

## Rich Menu And Flex

- Rich menu: เมนูทีแสดงตลอดใต้ chat ทำผ่าน LINE API
- Flex Message: ข้อความรูปแบบ card สามารถ custom layout ได้
- LIFF: เปิด in-app browser ผ่าน LINE

## Recommended Libraries

- `@line/bot-sdk`: official SDK, รองรับ TypeScript
- `bottender`: framework สำหรับ LINE/Messenger/Slack
- `hono`: web framework ทีเหมาะกับ Bun/Cloudflare Workers

## Best Practices

- Never commit channel credentials
- ตรวจสอบ `x-line-signature` ทุกครั้ง
- Reply token มีอายุ 1 นาที
- ใช้ `Promise.all` ประมวลผลหลาย events พร้อมกัน
- ตรวจสอบ rate limits: https://developers.line.biz/en/docs/messaging-api/rate-limits/
