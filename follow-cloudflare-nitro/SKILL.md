---
name: follow-cloudflare-nitro
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

1. กำหนดใน nuxt.config.ts

``` ts
export default defineNuxtConfig({

	nitro: {
		prerender: {
				autoSubfolderIndex: false,
		},
		preset: "cloudflare_module",
		cloudflare: {
		deployConfig: true,
			nodeCompat: true,
		},
    },

});
```
