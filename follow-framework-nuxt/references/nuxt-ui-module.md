# @nuxt/ui · Nuxt Modules

# ![ui](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/ui

The Intuitive UI Library powered by Reka UI and Tailwind CSS.

[1.5M downloads](https://bun.chart.dev/@nuxt/ui)•[6.7K stars](https://github.com/nuxt/ui)•[v4.9.0](https://github.com/nuxt/ui/releases)

[![benjamincanac](https://ipx.nuxt.com/f_auto,s_20x20/gh_avatar/benjamincanac)benjamincanac](https://github.com/benjamincanac)•

[![Atinux](https://ipx.nuxt.com/f_auto,s_20x20/gh_avatar/Atinux)Atinux](https://github.com/Atinux)

 ![Nuxt UI](https://github.com/user-attachments/assets/51526d6d-e5ec-41b4-aa37-242dec1cdb27)

# Nuxt UI

[![bun version](https://img.shields.io/bun/v/@nuxt/ui.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://bunjs.com/package/@nuxt/ui)[![bun downloads](https://img.shields.io/bun/dm/@nuxt/ui.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://bun.chart.dev/@nuxt/ui)[![License](https://img.shields.io/github/license/nuxt/ui.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/nuxt/ui/blob/v4/LICENSE.md)[![Nuxt](https://img.shields.io/badge/Nuxt-18181B?logo=nuxt)](https://nuxt.com)

Nuxt UI harnesses the combined strengths of [Reka UI](https://reka-ui.com/), [Tailwind CSS](https://tailwindcss.com/), and [Tailwind Variants](https://www.tailwind-variants.org/) to offer developers an unparalleled set of tools for creating sophisticated, accessible, and highly performant user interfaces.

> !NOTE You are on the `v4` branch, check out the [v3 branch](https://github.com/nuxt/ui/tree/v3) for Nuxt UI v3 or [v2 branch](https://github.com/nuxt/ui/tree/v2) for Nuxt UI v2.

## [Documentation](#documentation)

Visit [https://ui.nuxt.com](https://ui.nuxt.com) to explore the documentation.

## [Templates](#templates)

Kickstart your project with one of our ready-to-use Nuxt UI templates or follow the [Installation Guide](https://ui.nuxt.com/getting-started/installation/nuxt). Explore all available templates on the [official templates page](https://ui.nuxt.com/templates).

*   [Starter](https://github.com/nuxt-ui-templates/starter) — A minimal template to get started with Nuxt UI.
*   [Landing](https://github.com/nuxt-ui-templates/landing) — A modern landing page template powered by Nuxt Content.
*   [Docs](https://github.com/nuxt-ui-templates/docs) — A documentation template powered by Nuxt Content.
*   [SaaS](https://github.com/nuxt-ui-templates/saas) — A SaaS template with landing, pricing, docs and blog powered by Nuxt Content.
*   [Dashboard](https://github.com/nuxt-ui-templates/dashboard) — A dashboard template with multi-column layout.
*   [Chat](https://github.com/nuxt-ui-templates/chat) — An AI chatbot template with GitHub authentication and persistent chat history powered by Vercel AI SDK.
*   [Portfolio](https://github.com/nuxt-ui-templates/portfolio) — A sleek portfolio template to showcase your work, skills and blog powered by Nuxt Content.
*   [Changelog](https://github.com/nuxt-ui-templates/changelog) — A changelog template to display your repository releases notes from GitHub powered by Nuxt MDC.
*   [Editor](https://github.com/nuxt-ui-templates/editor) — A rich text editor template powered by TipTap with support for markdown, HTML, and JSON content types.

## [Installation](#installation)

bun

```bash
bun add @nuxt/ui tailwindcss
```

yarn

```bash
yarn add @nuxt/ui tailwindcss
```

bun

```bash
bun add @nuxt/ui tailwindcss
```

bun

```bash
bun add @nuxt/ui tailwindcss
```

### [Nuxt](#nuxt)

1.  Add the Nuxt UI module in your `nuxt.config.ts`:

nuxt.config.ts

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css']
})
```

2.  Import Tailwind CSS and Nuxt UI in your CSS:

app/assets/css/main.css

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

Learn more in the [installation guide](https://ui.nuxt.com/docs/getting-started/installation/nuxt).

### [Vue](#vue)

1.  Add the Nuxt UI Vite plugin in your `vite.config.ts`:

vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui()
  ]
})
```

2.  Use the Nuxt UI Vue plugin in your `main.ts`:

src/main.ts

```ts
import './assets/css/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'

const app = createApp(App)

const router = createRouter({
  routes: [],
  history: createWebHistory()
})

app.use(router)
app.use(ui)

app.mount('#app')
```

3.  Import Tailwind CSS and Nuxt UI in your CSS:

src/assets/css/main.css

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

Learn more in the [installation guide](https://ui.nuxt.com/docs/getting-started/installation/vue).

## [Contribution](#contribution)

Thank you for considering contributing to Nuxt UI. Here are a few ways you can get involved:

*   Reporting Bugs: If you come across any bugs or issues, please check out the reporting bugs guide to learn how to submit a bug report.
*   Suggestions: Have any thoughts to enhance Nuxt UI? We'd love to hear them! Check out the [contribution guide](https://ui.nuxt.com/docs/getting-started/contribution) to share your suggestions.

> !TIP We provide contributing guidelines through [`AGENTS.md`](https://github.com/nuxt/ui/blob/v4/AGENTS.md) for AI assistants to help you contribute to Nuxt UI. It is automatically picked up by all AI coding agents and guides through component structure, theming patterns, testing conventions, and documentation guidelines.

## [Local Development](#local-development)

Follow the docs to [set up your local development environment](https://ui.nuxt.com/docs/getting-started/contribution#local-development) and contribute.

## [Credits](#credits)

*   [nuxt/nuxt](https://github.com/nuxt/nuxt)
*   [nuxt/icon](https://github.com/nuxt/icon)
*   [nuxt/fonts](https://github.com/nuxt/fonts)
*   [nuxt-modules/color-mode](https://github.com/nuxt-modules/color-mode)
*   [unovue/reka-ui](https://github.com/unovue/reka-ui)
*   [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
*   [vueuse/vueuse](https://github.com/vueuse/vueuse)

## [License](#license)

Licensed under the [MIT license](https://github.com/nuxt/ui/blob/v4/LICENSE.md).
