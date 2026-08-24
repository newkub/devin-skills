---
name: follow-cloudflare-nitro
description: กำหนดใน nuxt.config.ts
---

## Goal

ทำตามแนวทาง Cloudflare Nitro

## Scope

ใช้ `follow-cloudflare-nitro` สำหรับ tasks และ workflows เฉพาะที่กำหนด

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
