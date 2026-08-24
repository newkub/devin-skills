---
name: follow-cloudflare-nitro
description: กำหนดใน nuxt.config.ts
---

## Goal

Follow Cloudflare Nitro

## Scope

Use `follow-cloudflare-nitro` for the specific tasks and workflows it covers

## Execute

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

## Rules

- Follow the project conventions and global rules
- Use the allowed tools only when needed

## Expected Outcome

Completed `follow-cloudflare-nitro` workflow with correct output
