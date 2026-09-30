| key | value |
|---|---|
| version | 2.31.0 |
| package registry | https://www.npmjs.com/package/@line/liff |
| repository | https://github.com/line/line-liff-v2-starter |
| docs | https://developers.line.biz/en/docs/liff/ |

| api | description | default | options |
|---|---|---|---|
| `liff.init({liffId})` | Initialize SDK | - | `withLoginOnExternalBrowser` |
| `liff.login()` | LINE login redirect | - | `redirectUri` |
| `liff.isLoggedIn()` / `liff.logout()` | Auth state | - | - |
| `liff.getProfile()` / `liff.getIDToken()` | User profile / ID token | - | - |
| `liff.sendMessages([...])` | Send message to chat | - | message objects |
| `liff.shareTargetPicker([...])` | Share picker | - | `isMultiple` |
| `liff.scanCodeV2()` | QR scanner | - | - |
| `liff.getContext()` | LIFF context | - | `type`, `userId`, `chatId` |
