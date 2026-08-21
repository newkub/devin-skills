# Nuxt: The Full-Stack Vue Framework

# The Full-Stack
Vue Framework

Build fast, production-ready web apps with Vue. File-based routing, auto-imports, and server-side rendering — all configured out of the box.

[Get started](/docs/getting-started/installation) Nuxt in 100 seconds

MinimalRoutingData FetchingAuto-ImportsAPI Routes

*   app
```
*   app.vue
```
*   package.json

app/app.vue

```vue
<script setup lang="ts">
const version = 4
</script>

<template>
  <h1>
    Hello Nuxt {{ version }}!
  </h1>
</template>

<style scoped>
h1 {
  font-size: 3rem;
}
</style>
```

*   app
```
*   pages
    *   blog
    *   index.vue
*   app.vue
```
*   package.json

app/pages/index.vue

```vue
<template>
  <h1>Index page</h1>
  <NuxtLink to="/blog/hello-world">
    Go to blog post
  </NuxtLink>
</template>
```

*   app
```
*   pages
    *   blog
    *   index.vue
*   app.vue
```
*   package.json

app/pages/index.vue

```vue
<script setup lang="ts">
const { data: page } = await useFetch('/api/cms/home')
</script>

<template>
  <h1>{{ page.title }}</h1>
  <NuxtLink to="/blog/hello-world">
    Go to blog post
  </NuxtLink>
</template>
```

*   app
```
*   components
*   composables
*   app.vue
```
*   package.json

app/app.vue

```vue
<script setup>
const message = ref('Nuxt')
const hello = () => sayHello(message.value)
</script>

<template>
  <main>
    <h1>Demo with auto imports</h1>
    <form @submit.prevent="hello">
      <MyInput v-model="message" />
      <button type="submit">Say Hello</button>
    </form>
  </main>
</template>
```

*   app
*   server
```
*   api
    *   hello.ts
```
*   package.json

server/api/hello.ts

```ts
export default defineEventHandler((event) => {
  return {
    message: 'Hello World'
  }
})
```

## Chosen by leading companies worldwide

![Louis Vuitton logo](https://ipx.nuxt.com/s_152x16/assets/brands/light/louis-vuitton.svg)![Louis Vuitton logo](https://ipx.nuxt.com/s_152x16/assets/brands/dark/louis-vuitton.svg)

![Dassault Systemes logo](https://ipx.nuxt.com/s_93x28/assets/brands/light/dassault-systemes.svg)![Dassault Systemes logo](https://ipx.nuxt.com/s_93x28/assets/brands/dark/dassault-systemes.svg)

![Back Market logo](https://ipx.nuxt.com/s_161x18/assets/brands/light/backmarket.svg)![Back Market logo](https://ipx.nuxt.com/s_161x18/assets/brands/dark/backmarket.svg)

![Paul Smith logo](https://ipx.nuxt.com/s_144x26/assets/brands/light/paul-smith.svg)![Paul Smith logo](https://ipx.nuxt.com/s_144x26/assets/brands/dark/paul-smith.svg)

![Caudalie logo](https://ipx.nuxt.com/s_136x28/assets/brands/light/caudalie.svg)![Caudalie logo](https://ipx.nuxt.com/s_136x28/assets/brands/dark/caudalie.svg)

![Blizzard logo](https://ipx.nuxt.com/s_55x28/assets/brands/light/blizzard.svg)![Blizzard logo](https://ipx.nuxt.com/s_55x28/assets/brands/dark/blizzard.svg)

![Vans logo](https://ipx.nuxt.com/s_67x23/assets/brands/light/vans.svg)![Vans logo](https://ipx.nuxt.com/s_67x23/assets/brands/dark/vans.svg)

![Deutsche Bahn logo](https://ipx.nuxt.com/s_51x40/assets/brands/light/deutsche-bahn.svg)![Deutsche Bahn logo](https://ipx.nuxt.com/s_51x40/assets/brands/dark/deutsche-bahn.svg)

## Everything you need, nothing you don't

Nuxt handles the architecture so you can focus on building.

*   Zero Configuration

```
Start coding with Vue or Typescript immediately — Nuxt handles all the setup for you.
```
*   Rendering Modes

```
Server-side rendering, client-side rendering, static-site generation, you decide, up to the page level.
```
*   Routing & Layouts

```
Use our file-based routing system to build complex url-based views while reusing components for performance.
```
*   Data Fetching

```
Make your Vue component async and await your data. Nuxt provides powerful composables for universal data fetching.
```
*   Error Handling

```
Catch errors in your application with our built-in handlers and custom error pages.
```
*   Transitions

```
Implement smooth transitions between layouts, pages, and components.
```
*   Assets & Style

```
Benefit from automatic image, font, and script optimizations with built-in support.
```
*   SEO & Meta Tags

```
Create production-ready applications that are fully indexable by search engines.
```
*   Modular

```
Extend Nuxt features with 200+ modules to ship your application faster.
```
*   Middleware

```
Protect or add custom logic (localization, A/B testing) before rendering pages.
```
*   Type-safe with TypeScript

```
Write type-safe code with automatically generated types and tsconfig.json.
```
*   Deep dive into Nuxt now

```
[Start reading docs](/docs)
```
Nuxt offers a compelling solution and a great ecosystem to help you ship fullstack Vue apps that are performant and SEO friendly. The flexibility to choose between SSR and SSG is icing on the cake.

![Evan You](https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/yyx990803)

[](https://x.com/youyuxi)

Evan You

Creator of Vue.js and Vite

## Built on proven tools

Vue for the frontend. Nitro for the server. Your choice of bundler.

Frontend with Vue.js

Nuxt is built on top of Vue.js, leveraging its reactive, component-based architecture to create powerful, scalable, and seamless web applications.

[vuejs.org](https://vuejs.org)

Bundler with Vite

Nuxt leverages Vite's frontend build capabilities, powering rapid development of web applications with instant HMR for the best developer experience.

[vite.dev](https://vite.dev)

Server with Nitro

Nuxt uses Nitro as server engine to build versatile full-stack web applications, ready for deployment on any platform.

[nitro.build](https://nitro.build)

## Trusted by developers worldwide

Powering startups to enterprises. 100% open source.

6.2M

Monthly downloads

[](https://bun.chart.dev/nuxt)

60.4K

GitHub Stars

[](https://go.nuxt.com/github)

Open source

Every line of Nuxt is written by developers like you.

[Start contributing](https://github.com/nuxt/nuxt)

[](https://go.nuxt.com/github)

102k

Followers

[](https://go.nuxt.com/x)

32k

Members

[](https://go.nuxt.com/discord)

## Extend Nuxt with plug & play modules

Nuxt has a rich module ecosystem, with both official and community-driven modules. This accelerates development by providing ready-to-use solutions for common needs.

[Explore all modules](/modules)

![ui](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/ui

The Intuitive UI Library powered by Reka UI and Tailwind CSS.

[1.5M](https://bun.chart.dev/@nuxt/ui)[6.7K](https://github.com/nuxt/ui#dev)

Copy command to install ui

OfficialSponsor

[](/modules/ui)

![content](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/content

The file-based CMS with support for Markdown, YAML, JSON.

[523.8K](https://bun.chart.dev/@nuxt/content)[3.6K](https://github.com/nuxt/content#main)

Copy command to install content

OfficialSponsor

[](/modules/content)

![devtools](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/devtools

Visual tools that help you to know your Nuxt application better.

[5.8M](https://bun.chart.dev/@nuxt/devtools)[3.3K](https://github.com/nuxt/devtools#main/packages/devtools)

Copy command to install devtools

OfficialSponsor

[](/modules/devtools)

![image](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/image

Add images with progressive processing, lazy-loading, resizing and providers support.

[1.5M](https://bun.chart.dev/@nuxt/image)[1.5K](https://github.com/nuxt/image)

Copy command to install image

OfficialSponsor

[](/modules/image)

![icon](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/icon

Icon module for Nuxt with 200,000+ ready to use icons from Iconify.

[2M](https://bun.chart.dev/@nuxt/icon)[1.2K](https://github.com/nuxt/icon)

Copy command to install icon

OfficialSponsor

[](/modules/icon)

![eslint](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/eslint

Project-aware, easy-to-use, extensible and future-proof ESLint integration.

[2.2M](https://bun.chart.dev/@nuxt/eslint)[637](https://github.com/nuxt/eslint)

Copy command to install eslint

OfficialSponsor

[](/modules/eslint)

![fonts](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/fonts

Add custom web fonts with performance in mind.

[1.9M](https://bun.chart.dev/@nuxt/fonts)[592](https://github.com/nuxt/fonts)

Copy command to install fonts

OfficialSponsor

[](/modules/fonts)

![scripts](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/scripts

Add 3rd-party scripts without sacrificing performance.

[647.9K](https://bun.chart.dev/@nuxt/scripts)[572](https://github.com/nuxt/scripts#main/packages/script)

Copy command to install scripts

OfficialSponsor

[](/modules/scripts)

![test-utils](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/test-utils

Test utilities for Nuxt.

[2M](https://bun.chart.dev/@nuxt/test-utils)[439](https://github.com/nuxt/test-utils#main)

Copy command to install test-utils

OfficialSponsor

[](/modules/test-utils)

![hints](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/hints

Nuxt module that shows hints for aspects of your application such as Performance, Security, and more!

[115.3K](https://bun.chart.dev/@nuxt/hints)[337](https://github.com/nuxt/hints)

Copy command to install hints

OfficialSponsor

[](/modules/hints)

![a11y](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/a11y

Real-time accessibility feedback and automated testing in your browser during development.

[75.2K](https://bun.chart.dev/@nuxt/a11y)[224](https://github.com/nuxt/a11y)

Copy command to install a11y

OfficialSponsor

[](/modules/a11y)

## Deploy anywhere

Deploy with one command. SSR, static, or edge — Nuxt adapts to your platform.

[Learn how to deploy now](/deploy)

![Deploy anywhere](https://ipx.nuxt.com/s_512x439/assets/landing/deploy.svg)

## Built by developers around the world

Hundreds of contributors making Nuxt better every day. Join us.

[Nuxters](https://nuxters.nuxt.com "See your own profile on Nuxters")[](https://go.nuxt.com/discord "Join Nuxt on Discord")[](https://go.nuxt.com/x "Nuxt on X")[](https://go.nuxt.com/bluesky "Nuxt on Bluesky")

Showcase

## Real-world Web Applications built with Nuxt

[View all websites](/showcase)

Louis Vuitton

![Louis Vuitton](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/louis-vuitton.webp)

[](https://eu.louisvuitton.com/)

Trade Republic

![Trade Republic](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/trade-republic.webp)

[](https://traderepublic.com/)

Armani

![Armani](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/armani.webp)

[](https://www.armani.com/)

NASA Jet Propulsion Laboratory

![NASA Jet Propulsion Laboratory](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/nasa-jet-propulsion-laboratory.webp)

[](https://jpl.nasa.gov/)

Google Ventures

![Google Ventures](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/google-ventures.webp)

[](https://www.gv.com/)

Microsoft Edge Developer

![Microsoft Edge Developer](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/microsoft-edge-developer.webp)

[](https://developer.microsoft.com/en-us/microsoft-edge)

Tiktok Ads

![Tiktok Ads](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/tiktok-ads.webp)

[](https://tiktok.com/business/en)

Stack Overflow

![Stack Overflow](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/stack-overflow.webp)

[](https://stackoverflow.co/)

Upwork

![Upwork](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/upwork.webp)

[](https://upwork.com/)

Mc Donalds France

![Mc Donalds France](https://ipx.nuxt.com/f_webp&s_1292x726/assets/websites/mc-donalds-france.webp)

[](https://www.mcdonalds.fr/)

## Sponsors

Nuxt is and will always remain free and open source under the MIT License, thanks to our contributors and sponsors.

[Become a sponsor](https://opencollective.com/nuxtjs)[View all sponsors](/enterprise/sponsors)

diamond sponsors

platinum sponsors

gold sponsors

# Introduction · Get Started with Nuxt v4

# Introduction

Copy page

Nuxt's goal is to make web development intuitive and performant with a great Developer Experience in mind.

Nuxt is a free and [open-source framework](https://github.com/nuxt/nuxt) with an intuitive and extendable way to create type-safe, performant and production-grade full-stack web applications and websites with [Vue.js](https://vuejs.org).

We made everything so you can start writing `.vue` files from the beginning while enjoying hot module replacement in development and a performant application in production with server-side rendering by default.

Nuxt has no vendor lock-in, allowing you to deploy your application [**everywhere, even on the edge**](/blog/nuxt-on-the-edge).

If you want to play around with Nuxt in your browser, you can [try it out in one of our online sandboxes](/docs/4.x/getting-started/installation#play-online).

## [Automation and Conventions](#automation-and-conventions)

Nuxt uses conventions and an opinionated directory structure to automate repetitive tasks and allow developers to focus on pushing features. The configuration file can still customize and override its default behaviors.

*   **File-based routing:** define routes based on the structure of your [`app/pages/` directory](/docs/4.x/directory-structure/app/pages). This can make it easier to organize your application and avoid the need for manual route configuration.
*   **Code splitting:** Nuxt automatically splits your code into smaller chunks, which can help reduce the initial load time of your application.
*   **Server-side rendering out of the box:** Nuxt comes with built-in SSR capabilities, so you don't have to set up a separate server yourself.
*   **Auto-imports:** write Vue composables and components in their respective directories and use them without having to import them with the benefits of tree-shaking and optimized JS bundles.
*   **Data-fetching utilities:** Nuxt provides composables to handle SSR-compatible data fetching as well as different strategies.
*   **Zero-config TypeScript support:** write type-safe code without having to learn TypeScript with our auto-generated types and `tsconfig.json`.
*   **Configured build tools:** we use [Vite](https://vite.dev) by default to support hot module replacement (HMR) in development and bundling your code for production with best-practices baked-in.

Nuxt takes care of these and provides both frontend and backend functionality so you can focus on what matters: **creating your web application**.

## [Server-Side Rendering](#server-side-rendering)

Nuxt comes with built-in server-side rendering (SSR) capabilities by default, without having to configure a server yourself, which has many benefits for web applications:

*   **Faster initial page load time:** Nuxt sends a fully rendered HTML page to the browser, which can be displayed immediately. This can provide a faster perceived page load time and a better user experience (UX), especially on slower networks or devices.
*   **Improved SEO:** search engines can better index SSR pages because the HTML content is available immediately, rather than requiring JavaScript to render the content on the client-side.
*   **Better performance on low-powered devices:** it reduces the amount of JavaScript that needs to be downloaded and executed on the client-side, which can be beneficial for low-powered devices that may struggle with processing heavy JavaScript applications.
*   **Better accessibility:** the content is immediately available on the initial page load, improving accessibility for users who rely on screen readers or other assistive technologies.
*   **Easier caching:** pages can be cached on the server-side, which can further improve performance by reducing the amount of time it takes to generate and send the content to the client.

Overall, server-side rendering can provide a faster and more efficient user experience, as well as improve search engine optimization and accessibility.

As Nuxt is a versatile framework, it gives you the possibility to statically render your whole application to a static hosting with `nuxt generate`, disable SSR globally with the `ssr: false` option or leverage hybrid rendering by setting up the `routeRules` option.

[](/docs/4.x/guide/concepts/rendering) Read more in Nuxt rendering modes.

### [Server engine](#server-engine)

The Nuxt server engine [Nitro](https://nitro.build/) unlocks new full-stack capabilities.

In development, it uses Rollup and Node.js workers for your server code and context isolation. It also generates your server API by reading files in `server/api/` and server middleware from `server/middleware/`.

In production, Nitro builds your app and server into one universal `.output` directory. This output is light: minified and removed from any Node.js modules (except polyfills). You can deploy this output on any system supporting JavaScript, from Node.js, Serverless, Workers, Edge-side rendering or purely static.

[](/docs/4.x/guide/concepts/server-engine) Read more in Nuxt server engine.

### [Production-ready](#production-ready)

A Nuxt application can be deployed on a Node or Deno server, pre-rendered to be hosted in static environments, or deployed to serverless and edge providers.

[](/docs/4.x/getting-started/deployment) Read more in Deployment section.

### [Modular](#modular)

A module system allows you to extend Nuxt with custom features and integrations with third-party services.

[](/docs/4.x/guide/concepts/modules) Read more in Nuxt Modules Concept.

### [Architecture](#architecture)

Nuxt is composed of different [core packages](https://github.com/nuxt/nuxt/tree/main/packages):

*   Core engine: [nuxt](https://github.com/nuxt/nuxt/tree/main/packages/nuxt)
*   Bundlers: [@nuxt/vite-builder](https://github.com/nuxt/nuxt/tree/main/packages/vite), [@nuxt/rspack-builder](https://github.com/nuxt/nuxt/tree/main/packages/rspack) and [@nuxt/webpack-builder](https://github.com/nuxt/nuxt/tree/main/packages/webpack)
*   Command line interface: [@nuxt/cli](https://github.com/nuxt/cli)
*   Server engine: [nitro](https://github.com/nitrojs/nitro)
*   Development kit: [@nuxt/kit](https://github.com/nuxt/nuxt/tree/main/packages/kit)

We recommend reading each concept to have a full vision of Nuxt capabilities and the scope of each package.

Was this helpful?

🤩🙂☹️😰

[Report an issue](https://github.com/nuxt/nuxt/issues/new/choose) or [Edit this page on GitHub](https://github.com/nuxt/nuxt/edit/4.x/docs/1.getting-started/01.introduction.md)

 [Installation

Get started with Nuxt quickly with our online starters or start locally with your terminal.](/docs/4.x/getting-started/installation)

MenuOn this page

# Build faster with 313+ Nuxt Modules

Discover our list of modules to supercharge your Nuxt project. Created and maintained by more than 2009 people from the Nuxt team and community.

/

DownloadsSort by Desc

Select categoryDownloads

[Official](/modules?category=Official)[AI](/modules?category=AI)[Analytics](/modules?category=Analytics)[CMS](/modules?category=CMS)[CSS](/modules?category=CSS)[Database](/modules?category=Database)[Devtools](/modules?category=Devtools)[Ecommerce](/modules?category=Ecommerce)[Extensions](/modules?category=Extensions)[Fonts](/modules?category=Fonts)[Images](/modules?category=Images)[Libraries](/modules?category=Libraries)[Monitoring](/modules?category=Monitoring)[Payment](/modules?category=Payment)[Performance](/modules?category=Performance)[Request](/modules?category=Request)[Security](/modules?category=Security)[SEO](/modules?category=SEO)[UI](/modules?category=UI)

Shift+click to select modules for bulk installation

[Create your own module](/docs/guide/modules/getting-started)

![logto](https://raw.githubusercontent.com/nuxt/modules/main/icons/logto.svg)

@logto/nuxt

The better Nuxt auth module for developers.

[2.6K](https://bun.chart.dev/@logto/nuxt)[93](https://github.com/logto-io/js#master/packages/nuxt)

Add moduleCopy command to install logto

OfficialSponsor

[](/modules/logto)

![kinde](https://raw.githubusercontent.com/nuxt/modules/main/icons/kinde.svg)

@nuxtjs/kinde

Kinde authentication integration for Nuxt

[1.6K](https://bun.chart.dev/@nuxtjs/kinde)[90](https://github.com/nuxt-modules/kinde)

Add moduleCopy command to install kinde

OfficialSponsor

[](/modules/kinde)

![devtools](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/devtools

Visual tools that help you to know your Nuxt application better.

[6.1M](https://bun.chart.dev/@nuxt/devtools)[3.3K](https://github.com/nuxt/devtools#main/packages/devtools)

Add moduleCopy command to install devtools

OfficialSponsor

[](/modules/devtools)

![test-utils](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/test-utils

Test utilities for Nuxt.

[2.2M](https://bun.chart.dev/@nuxt/test-utils)[439](https://github.com/nuxt/test-utils#main)

Add moduleCopy command to install test-utils

OfficialSponsor

[](/modules/test-utils)

![eslint](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/eslint

Project-aware, easy-to-use, extensible and future-proof ESLint integration.

[2.2M](https://bun.chart.dev/@nuxt/eslint)[637](https://github.com/nuxt/eslint)

Add moduleCopy command to install eslint

OfficialSponsor

[](/modules/eslint)

![icon](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/icon

Icon module for Nuxt with 200,000+ ready to use icons from Iconify.

[2.1M](https://bun.chart.dev/@nuxt/icon)[1.2K](https://github.com/nuxt/icon)

Add moduleCopy command to install icon

OfficialSponsor

[](/modules/icon)

![fonts](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/fonts

Add custom web fonts with performance in mind.

[1.9M](https://bun.chart.dev/@nuxt/fonts)[592](https://github.com/nuxt/fonts)

Add moduleCopy command to install fonts

OfficialSponsor

[](/modules/fonts)

![image](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/image

Add images with progressive processing, lazy-loading, resizing and providers support.

[1.6M](https://bun.chart.dev/@nuxt/image)[1.5K](https://github.com/nuxt/image)

Add moduleCopy command to install image

OfficialSponsor

[](/modules/image)

![ui](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/ui

The Intuitive UI Library powered by Reka UI and Tailwind CSS.

[1.5M](https://bun.chart.dev/@nuxt/ui)[6.7K](https://github.com/nuxt/ui#dev)

Add moduleCopy command to install ui

OfficialSponsor

[](/modules/ui)

![scripts](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/scripts

Add 3rd-party scripts without sacrificing performance.

[675.8K](https://bun.chart.dev/@nuxt/scripts)[572](https://github.com/nuxt/scripts#main/packages/script)

Add moduleCopy command to install scripts

OfficialSponsor

[](/modules/scripts)

![content](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/content

The file-based CMS with support for Markdown, YAML, JSON.

[554.3K](https://bun.chart.dev/@nuxt/content)[3.6K](https://github.com/nuxt/content#main)

Add moduleCopy command to install content

OfficialSponsor

[](/modules/content)

![hints](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/hints

Nuxt module that shows hints for aspects of your application such as Performance, Security, and more!

[120.7K](https://bun.chart.dev/@nuxt/hints)[337](https://github.com/nuxt/hints)

Add moduleCopy command to install hints

OfficialSponsor

[](/modules/hints)

![a11y](https://raw.githubusercontent.com/nuxt/modules/main/icons/nuxt.svg)

@nuxt/a11y

Real-time accessibility feedback and automated testing in your browser during development.

[80.7K](https://bun.chart.dev/@nuxt/a11y)[224](https://github.com/nuxt/a11y)

Add moduleCopy command to install a11y

OfficialSponsor

[](/modules/a11y)

![vercel-analytics](https://raw.githubusercontent.com/nuxt/modules/main/icons/vercel.svg)

@vercel/analytics

Privacy-friendly, real-time traffic insights for your Nuxt app

[15.8M](https://bun.chart.dev/@vercel/analytics)[508](https://github.com/vercel/analytics#main/packages/web)

Add moduleCopy command to install vercel-analytics

OfficialSponsor

[](/modules/vercel-analytics)

![vercel-speed-insights](https://raw.githubusercontent.com/nuxt/modules/main/icons/vercel.svg)

@vercel/speed-insights

Real user performance metrics and suggestions for your Nuxt app

[10.3M](https://bun.chart.dev/@vercel/speed-insights)[105](https://github.com/vercel/speed-insights#main/packages/web)

Add moduleCopy command to install vercel-speed-insights

OfficialSponsor

[](/modules/vercel-speed-insights)

![magic-regexp](https://raw.githubusercontent.com/nuxt/modules/main/icons/magic-regexp.svg)

magic-regexp

A compiled-away, type-safe, readable RegExp alternative

[7.5M](https://bun.chart.dev/magic-regexp)[4.3K](https://github.com/unjs/magic-regexp)

Add moduleCopy command to install magic-regexp

OfficialSponsor

[](/modules/magic-regexp)

![reka-ui](https://raw.githubusercontent.com/nuxt/modules/main/icons/reka-ui.svg)

reka-ui

Vue port of Radix UI Primitives. An open-source UI component library for building high-quality, accessible design systems and web apps.

[5M](https://bun.chart.dev/reka-ui)[6.6K](https://github.com/unovue/reka-ui)

Add moduleCopy command to install reka-ui

OfficialSponsor

[](/modules/reka-ui)

![auto-animate](https://raw.githubusercontent.com/nuxt/modules/main/icons/auto-animate.svg)

@formkit/auto-animate

Automatic animations for your Nuxt app with a single line of code.

[3.7M](https://bun.chart.dev/@formkit/auto-animate)[13.8K](https://github.com/formkit/auto-animate)

Add moduleCopy command to install auto-animate

OfficialSponsor

[](/modules/auto-animate)

# Nuxt Templates

Explore community templates to get up and running in a few seconds.

[Nuxt Starters](https://nuxt.new)[Full-stack Templates](https://hub.nuxt.com/templates)

## Featured

![Charts Planner Dashboard](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-charts-dashboard-planner.webp)

Charts Planner Dashboard

Premium

Planner dashboard template built with Nuxt UI and Nuxt Charts.

[Demo](https://nuxt-planner-demo.nuxtcharts.com?via=nuxt)[Purchase](https://nuxtcharts.com/templates/nuxt-planner?via=nuxt)

![Docus](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/docus.webp)

Docus

Write beautiful docs with Markdown and Vue Components.

[Demo](https://docus.dev)[GitHub](https://github.com/nuxt-content/docus)

![HackerNews](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/hackernews.webp)

HackerNews

HackerNews clone built with Nuxt.

[Demo](https://hn.nuxt.space/news/1)[GitHub](https://github.com/nuxt/hackernews)

![Movies](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/movies.webp)

Movies

A TMDB client built with Nuxt and View Transitions.

[Demo](https://movies.nuxt.space)[GitHub](https://github.com/nuxt/movies)

![Nuxt Starter Kit](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-starter-kit.webp)

Nuxt Starter Kit

Premium

A full-stack Nuxt starter with built with Nuxt UI Pro and NuxtHub.

[Demo](https://demo.nuxtstarterkit.com)[Purchase](https://nuxtstarterkit.com)

![AI Chatbot](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-ui-chat.webp)

AI Chatbot

Full-featured AI Chatbot with authentication & chat history.

[Demo](https://chat-template.nuxt.dev)[GitHub](https://github.com/nuxt-ui-templates/chat)

![Dashboard](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-ui-dashboard.webp)

Dashboard

A dashboard template made with Nuxt UI.

[Demo](https://dashboard-template.nuxt.dev)[GitHub](https://github.com/nuxt-ui-templates/dashboard)

![Editor](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-ui-editor.webp)

Editor

Notion-like TipTap editor with AI completion and real-time collaboration.

[Demo](https://editor-template.nuxt.dev)[GitHub](https://github.com/nuxt-ui-templates/editor)

## Other

![Agency OS](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/agency-os.webp)

Agency OS

The open source operating system for digital agencies.

[Demo](https://www.agencyos.dev/)[GitHub](https://github.com/directus-community/agency-os)

![Atidone](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/atidone.webp)

Atidone

Full-stack app with authentication and SQL database.

[Demo](https://todos.nuxt.dev/)[GitHub](https://github.com/atinux/atidone)

![Atidraw](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/atidraw.webp)

Atidraw

Web application that lets you to create, enhance, and share your drawings with the world.

[Demo](https://draw.nuxt.dev/)[GitHub](https://github.com/atinux/atidraw)

![Canvas](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/canvas.webp)

Canvas

Canvas a portfolio template, with a minimal and clean design, using Nuxt Content and TailwindCSS

[Demo](https://canvas.hrcd.fr/)[GitHub](https://github.com/HugoRCD/canvas)

![Charts Dashboard](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-charts-dashboard.webp)

Charts Dashboard

Premium

A Nuxt Charts dashboard template built with Nuxt UI.

[Demo](https://nuxt-dashboard-demo.nuxtcharts.com?via=nuxt)[Purchase](https://nuxtcharts.com/dashboard?via=nuxt)

![Charts Dashboard shadcn-vue](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-charts-dashboard-shadcn-vue.webp)

Charts Dashboard shadcn-vue

Premium

A beautiful dashboard template built with shadcn-vue and Nuxt Charts.

[Demo](https://nuxt-shadcn-dashboard-demo.nuxtcharts.com/monitor?via=nuxt)[Purchase](https://nuxtcharts.com/templates/nuxt-shadcn-dashboard?via=nuxt)

![Content Wind](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/content-wind.webp)

Content Wind

A lightweight Nuxt template for a Markdown driven website.

[Demo](https://content-wind.nuxt.space)[GitHub](https://github.com/atinux/content-wind)

![DailyHub - Directory Template](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/dailyhub-directory-template.webp)

DailyHub - Directory Template

Premium

If you need listing websites, directories, and blogs then you should utilize DailyHub

[Demo](https://dailyhub-nuxt.stylokit.com/?aff=J0Emk)[Purchase](https://stylokit.lemonsqueezy.com/buy/5eed5001-9087-405b-a414-d654b9597e5d?aff=J0Emk)

![Glide.ai](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/glideai.webp)

Glide.ai

A dark, modern, website template powered by Nuxt and Prismic.

[Demo](https://prismic-demo-glideai.nuxt.dev)[GitHub](https://github.com/prismicio-community/nuxt-starter-prismic-glideai)

![The Green Chronicle](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/green-chronicle.webp)

The Green Chronicle

Freemium

A company blog theme powered by Nuxt Content and UI Pro.

[Demo](https://the-green-chronicle.esteban-soubiran.site/)[GitHub](https://github.com/Barbapapazes/the-green-chronicle)

![Habit](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/habit.webp)

Habit

Full-stack habit app with authentication and SQL database.

[Demo](https://habit.nuxt.dev/)[GitHub](https://github.com/zackha/habit)

![Happy Paws](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/happy-paws.webp)

Happy Paws

Full-stack pet adoption app with Nuxt SEO and Tailwind CSS.

[Demo](https://happy-paws-with-nuxt-tailwindcss.netlify.app/)[GitHub](https://github.com/pinegrow/happy-paws-with-nuxt-tailwindcss)

![Hato](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/hato.webp)

Hato

Discover Hato, the sleek portfolio website perfect for freelancers, photographers, and artists made with Nuxt UI

[Demo](https://hato-template.vercel.app/)[GitHub](https://github.com/cesswhite/hato-minimal-template)

![NuxtHub Image Gallery](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/image-gallery.webp)

NuxtHub Image Gallery

A template that gets you started with NuxtHub Blob in seconds

[Demo](https://image-gallery.nuxt.dev/)[GitHub](https://github.com/Flosciante/nuxt-image-gallery)

![Materio Admin Template](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/materio.webp)

Materio Admin Template

Premium

A powerful admin dashboard template built for developers

[Demo](https://demos.themeselection.com/materio-vuetify-nuxtjs-admin-template/demo-1/)[Purchase](https://themeselection.com/item/materio-vuetify-nuxtjs-admin-template)

![eCommerce Store (Nuxt UI)](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nucommerce-store.webp)

eCommerce Store (Nuxt UI)

A e-commerce store with Nuxt UI components and dynamic pages.

[Demo](https://pg-nuxtui.netlify.app/)[GitHub](https://github.com/pinegrow/pg-nuxtui)

![Nuxt Deno KV](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-deno-kv.webp)

Nuxt Deno KV

Freemium

A collaborative todo-list app built with Deno KV and Nuxt.

[Demo](https://nuxt-todos-kv.deno.dev)[GitHub](https://github.com/atinux/nuxt-deno-kv)

![Nuxt Shadcn Dashboard](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-shadcn-dashboard.webp)

Nuxt Shadcn Dashboard

Shadcn Dashboard built with Nuxt

[Demo](https://nuxt-shadcn-dashboard.vercel.app/)[GitHub](https://github.com/dianprata/nuxt-shadcn-dashboard)

![Nuxt Shopify Template](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-shopify.webp)

Nuxt Shopify Template

Shopify template using Nuxt 4 and Nuxt UI.

[Demo](https://nuxt-shopify.vercel.app/)[GitHub](https://github.com/nuxt-modules/shopify)

![Changelog](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-ui-changelog.webp)

Changelog

A changelog template powered by GitHub Releases made with Nuxt UI.

[Demo](https://changelog-template.nuxt.dev)[GitHub](https://github.com/nuxt-ui-templates/changelog)

![Docs](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-ui-docs.webp)

Docs

A documentation template made with Nuxt UI.

[Demo](https://docs-template.nuxt.dev)[GitHub](https://github.com/nuxt-ui-templates/docs)

![Landing](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-ui-landing.webp)

Landing

A landing page template made with Nuxt UI.

[Demo](https://landing-template.nuxt.dev)[GitHub](https://github.com/nuxt-ui-templates/landing)

![Portfolio](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-ui-portfolio.webp)

Portfolio

A portfolio template with a clean and modern design.

[Demo](https://portfolio-template.nuxt.dev)[GitHub](https://github.com/nuxt-ui-templates/portfolio)

![SaaS](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxt-ui-saas.webp)

SaaS

A SaaS template made with Nuxt UI.

[Demo](https://saas-template.nuxt.dev)[GitHub](https://github.com/nuxt-ui-templates/saas)

![Nuxtship](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/nuxtship.webp)

Nuxtship

A landing page template for startups made with TailwindCSS.

[Demo](https://nuxtship.pages.dev)[GitHub](https://github.com/Gr33nW33n/nuxtship-template)

![Shadcn Docs Template](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/shadcn-docs.webp)

Shadcn Docs Template

Effortless and beautiful docs template built with shadcn-vue.

[Demo](https://shadcn-docs-nuxt.vercel.app/)[GitHub](https://github.com/ZTL-UwU/shadcn-docs-nuxt)

![Shadcn Landing Pro](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/shadcn-landing-pro.webp)

Shadcn Landing Pro

Premium

A ready-to-launch landing page template with Shadcn UI components.

[Demo](https://nuxt-shadcn-landing-pro.vercel.app/)[Purchase](https://waterwaystudios.lemonsqueezy.com/buy/c9e51f83-cdec-48ed-bf57-fded4e2d7d5f?aff=J0Emk)

![Sokol eCommerce Minimal Template](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/sokol.webp)

Sokol eCommerce Minimal Template

Premium

Where simplicity meets power in eCommerce templates, all thanks to Nuxt and Nuxt UI.

[Demo](https://sokol.vercel.app/)[Purchase](https://ecostudios.lemonsqueezy.com/buy/a36140d8-69e8-47a1-a921-4e7f7be89a5d?aff=J0Emk)

![Spike Admin](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/spike.webp)

Spike Admin

Premium

Unleash actionable insights effortlessly with a feature-rich dashboard template.

[Demo](https://spike-nuxtjs-pro-main.netlify.app/dashboards/dashboard1)[Purchase](https://www.wrappixel.com/templates/spike-nuxtjs-admin-template/)

![Supastarter](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/supastarter.webp)

Supastarter

Premium

A production-ready SaaS starter kit with auth, i18n, billing & payments.

[Demo](https://nuxt-demo.supastarter.dev)[Purchase](https://supastarter.dev/products/starter-kits/nuxt?aff=J0Emk)

![SuperSaaS](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/supersaas.webp)

SuperSaaS

Premium

Nuxt 3 Fullstack Starter Kit with Auth, DB, Payment, Files & Emails

[Demo](https://supersaas.dev/?aff=J0Emk)[Purchase](https://supersaas.dev/?aff=J0Emk)

![eCommerce Store (Vuetify)](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/vucommerce-store.webp)

eCommerce Store (Vuetify)

A responsive e-commerce store with Vuetify components.

[Demo](https://pg-nuxt-vuetify-tailwindcss.netlify.app/)[GitHub](https://github.com/pinegrow/pg-nuxt-vuetify-tailwindcss)

![WooNuxt](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/woonuxt.webp)

WooNuxt

Headless eCommerce powered by WooCommerce and Nuxt.

[Demo](https://v3.woonuxt.com)[GitHub](https://github.com/scottyzen/woonuxt)

![Zooper](https://ipx.nuxt.com/pos_top&f_webp&s_1348x758/assets/templates/zooper.webp)

Zooper

A minimal and personal portfolio template, made with Nuxt Content and TailwindCSS.

[Demo](https://zooper.pages.dev)[GitHub](https://github.com/fayazara/zooper)

# Nuxt Showcase

# Real-world Web Applications built with Nuxt

Explore inspiring websites, apps, and digital experiences made by developers and companies around the world.

### #1

Vue Framework

### 60.4K

GitHub Stars

### 6.2M

Monthly Downloads

## Chosen by leading companies worldwide

![Louis Vuitton logo](https://ipx.nuxt.com/s_152x16/assets/brands/light/louis-vuitton.svg)![Louis Vuitton logo](https://ipx.nuxt.com/s_152x16/assets/brands/dark/louis-vuitton.svg)

![Dassault Systemes logo](https://ipx.nuxt.com/s_93x28/assets/brands/light/dassault-systemes.svg)![Dassault Systemes logo](https://ipx.nuxt.com/s_93x28/assets/brands/dark/dassault-systemes.svg)

![Back Market logo](https://ipx.nuxt.com/s_161x18/assets/brands/light/backmarket.svg)![Back Market logo](https://ipx.nuxt.com/s_161x18/assets/brands/dark/backmarket.svg)

![Paul Smith logo](https://ipx.nuxt.com/s_144x26/assets/brands/light/paul-smith.svg)![Paul Smith logo](https://ipx.nuxt.com/s_144x26/assets/brands/dark/paul-smith.svg)

![Caudalie logo](https://ipx.nuxt.com/s_136x28/assets/brands/light/caudalie.svg)![Caudalie logo](https://ipx.nuxt.com/s_136x28/assets/brands/dark/caudalie.svg)

![Blizzard logo](https://ipx.nuxt.com/s_55x28/assets/brands/light/blizzard.svg)![Blizzard logo](https://ipx.nuxt.com/s_55x28/assets/brands/dark/blizzard.svg)

![Vans logo](https://ipx.nuxt.com/s_67x23/assets/brands/light/vans.svg)![Vans logo](https://ipx.nuxt.com/s_67x23/assets/brands/dark/vans.svg)

![Deutsche Bahn logo](https://ipx.nuxt.com/s_51x40/assets/brands/light/deutsche-bahn.svg)![Deutsche Bahn logo](https://ipx.nuxt.com/s_51x40/assets/brands/dark/deutsche-bahn.svg)

![Louis Vuitton](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/louis-vuitton.webp)

Louis Vuitton

[](https://eu.louisvuitton.com/)

![Trade Republic](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/trade-republic.webp)

Trade Republic

[](https://traderepublic.com/)

![Armani](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/armani.webp)

Armani

[](https://www.armani.com/)

![NASA Jet Propulsion Laboratory](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/nasa-jet-propulsion-laboratory.webp)

NASA Jet Propulsion Laboratory

[](https://jpl.nasa.gov/)

![Google Ventures](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/google-ventures.webp)

Google Ventures

[](https://www.gv.com/)

![Microsoft Edge Developer](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/microsoft-edge-developer.webp)

Microsoft Edge Developer

[](https://developer.microsoft.com/en-us/microsoft-edge)

![Tiktok Ads](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/tiktok-ads.webp)

Tiktok Ads

[](https://tiktok.com/business/en)

![Stack Overflow](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/stack-overflow.webp)

Stack Overflow

[](https://stackoverflow.co/)

![Upwork](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/upwork.webp)

Upwork

[](https://upwork.com/)

![Mc Donalds France](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/mc-donalds-france.webp)

Mc Donalds France

[](https://www.mcdonalds.fr/)

![Directus](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/directus.webp)

Directus

[](https://directus.io/)

![n8n](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/n8n.webp)

n8n

[](https://n8n.io/)

![Hostinger](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/hostinger.webp)

Hostinger

[](https://hostinger.com/)

![GitLab](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/git-lab.webp)

GitLab

[](https://about.gitlab.com/)

![Caudalie](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/caudalie.webp)

Caudalie

[](https://us.caudalie.com/)

![Virgin Galactic](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/virgin-galactic.webp)

Virgin Galactic

[](https://www.virgingalactic.com/)

![Delvaux](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/delvaux.webp)

Delvaux

[](https://eu.delvaux.com/)

![Immersive Garden](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/immersive-garden.webp)

Immersive Garden

[](https://immersive-g.com/)

![Icons8](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/icons8.webp)

Icons8

[](https://icons8.com/)

![Harrods](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/harrods.webp)

Harrods

[](https://www.harrods.com/)

![Le Collectionist](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/le-collectionist.webp)

Le Collectionist

[](https://www.lecollectionist.com/)

![Buy Me a Coffee](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/buy-mea-coffee.webp)

Buy Me a Coffee

[](https://buymeacoffee.com/)

![Croix Rouge](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/croix-rouge.webp)

Croix Rouge

[](https://www.croix-rouge.fr/)

![Hostel World](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/hostel-world.webp)

Hostel World

[](https://www.hostelworld.com/)

![Too Good To Go](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/too-good-to-go.webp)

Too Good To Go

[](https://toogoodtogo.com/)

![Explore France](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/explore-france.webp)

Explore France

[](https://www.france.fr/)

![CleanShot X](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/clean-shot-x.webp)

CleanShot X

[](https://cleanshot.com/)

![12GO](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/12go.webp)

12GO

[](https://12go.com/)

![Paul Smith](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/paul-smith.webp)

Paul Smith

[](https://www.paulsmith.com/fr)

![Roland Garros](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/roland-garros.webp)

Roland Garros

[](https://www.rolandgarros.com/)

![Push Security](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/push-security.webp)

Push Security

[](https://pushsecurity.com/)

![Toolstation](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/toolstation.webp)

Toolstation

[](https://www.toolstation.nl/)

![Vans](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/vans.webp)

Vans

[](https://www.vans.com/)

![The North Face](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/the-north-face.webp)

The North Face

[](https://www.thenorthface.com/)

![Timberland](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/timberland.webp)

Timberland

[](https://www.timberland.com/)

![On Running](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/on-running.webp)

On Running

[](https://www.on.com/)

![Promod](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/promod.webp)

Promod

[](https://www.promod.com/en/)

![Departamento](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/departamento.webp)

Departamento

[](https://www.dpto.la/)

![Hai](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/hai.webp)

Hai

[](https://www.homeofhai.com/)

![Shaina Mote](https://ipx.nuxt.com/f_webp&s_1150x646/assets/websites/shaina-mote.webp)

Shaina Mote

[](https://www.shainamote.com/)

# Nuxt Agencies · Enterprise

# Nuxt Agencies

Are you looking for a trusted partner with a strong expertise in Nuxt development? Consult our agency partner catalog and find an agency near you with the right set of skills.

[Become a partner](https://opencollective.com/nuxtjs/contribute/agency-partner-93555)

![London, United Kingdom](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/undefined.png)![London, United Kingdom](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/undefined.png)

Undefined

From idea to solution, we craft digital experiences.

London, United Kingdom

[](/enterprise/agencies/undefined)

![Lithuania](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/epicmax.svg)![Lithuania](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/epicmax.svg)

EpicMax

Vue and Nuxt development agency with 8+ years of experience in commercial and open-source projects, long-term support, and complex migrations to Vue 3 and Nuxt 3

Lithuania

[](/enterprise/agencies/epic-max)

![Dallas, TX](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/fidelitysolutions.svg)![Dallas, TX](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/fidelitysolutions.svg)

Fidelity Solutions

Fidelity Solutions is a Texas-based web, app, and full-stack software development agency that builds custom, scalable digital solutions for businesses nationwide.

Dallas, TX

[](/enterprise/agencies/fidelity-solutions)

![Yerevan, Armenia - California, USA](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/digineat.svg)![Yerevan, Armenia - California, USA](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/digineat.svg)

DigiNeat

Our development allows us to achieve more with our clients' fewer resources and optimize their expenses

Yerevan, Armenia - California, USA

[](/enterprise/agencies/digi-neat)

![Germany](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/full/light/magicasaservice.png)![Germany](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/full/dark/magicasaservice.png)

Magic as a Service

We build high-performing Nuxt and Vue applications, designed for beauty, engineered for performance, and made for humans.

Germany

[](/enterprise/agencies/maas)

![Berlin](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/wimadev.svg)![Berlin](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/wimadev.svg)

Wimadev

Enterprise grade Nuxt development and Node.js backends.

Berlin

[](/enterprise/agencies/wimadev)

![Ahmedabad, India - Halifax, Canada](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/7span.svg)![Ahmedabad, India - Halifax, Canada](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/7span.svg)

7Span

A Global Software & Design Company. We Make Pixel Perfect Things.

Ahmedabad, India - Halifax, Canada

[](/enterprise/agencies/7span)

![Wrocław, Poland](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/monterail.svg)![Wrocław, Poland](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/monterail.svg)

Monterail

Designing innovative software for industry leaders

Wrocław, Poland

[](/enterprise/agencies/monterail)

![Paris, France](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/the-coding-machine.svg)![Paris, France](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/the-coding-machine.svg)

The Coding Machine

Specialized in tailor-made development around Open Source technologies for more than 15 years.

Paris, France

[](/enterprise/agencies/the-coding-machine)

![Knurów, Poland](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/coditive.svg)![Knurów, Poland](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/coditive.svg)

Coditive

Bringing your vision to life with our top-notch coding skill both on frontend and backend areas.

Knurów, Poland

[](/enterprise/agencies/coditive)

![Philadelphia, PA](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/curotec.jpeg)![Philadelphia, PA](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/curotec.jpeg)

Curotec

Partner with an expert Vue.js & Nuxt team.

Philadelphia, PA

[](/enterprise/agencies/curotec)

![Switzerland](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/liip.svg)![Switzerland](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/liip.svg)

Liip AG

Your partner in crime for digital challenges – from websites, mobile apps and online shops through to change management.

Switzerland

[](/enterprise/agencies/liip)

![New Dehli, IND - Louisville, KY](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/webreinvent.svg)![New Dehli, IND - Louisville, KY](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/webreinvent.svg)

WebReinvent

WebReinvent is a software development company and we have delivered MVP to enterprise-level web applications from startup to MSME.

New Dehli, IND - Louisville, KY

[](/enterprise/agencies/webreinvent)

![Baltimore, MD](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/64robots.svg)![Baltimore, MD](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/64robots.svg)

64 Robots

A complete digital product agency with a Nuxt expertise.

Baltimore, MD

[](/enterprise/agencies/64robots)

![Tokyo, JP](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/zen-architects.svg)![Tokyo, JP](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/zen-architects.svg)

Zen Architects

ZEN Architects provides Nuxt support by specialists with strengths in DevOps and OSS.

Tokyo, JP

[](/enterprise/agencies/zen-architects)

![Köln, Germany](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/sidestream.svg)![Köln, Germany](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/sidestream.svg)

SIDESTREAM

We develop the best Nuxt 3 software for you.

Köln, Germany

[](/enterprise/agencies/sidestream)

![Amsterdam, NL](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/passionate-people.jpeg)![Amsterdam, NL](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/passionate-people.jpeg)

Passionate People

We provide you with additional technical capacity to power-up your digital transformation.

Amsterdam, NL

[](/enterprise/agencies/passionate-people)

![Frankfurt](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/geist.svg)![Frankfurt](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/geist.svg)

Geist

Shopify Composable Commerce Expert

Frankfurt

[](/enterprise/agencies/geist)

![Austria](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/light/drunomics.svg)![Austria](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/square/dark/drunomics.svg)

drunomics

Trusted open source experts delivering innovative enterprise-grade solutions. We combine Drupal's robustness with Nuxt's flexibility for exceptional results.

Austria

[](/enterprise/agencies/drunomics)

![United Kingdom](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/full/light/keith-mifsud.png)![United Kingdom](https://ipx.nuxt.com/s_36x36/assets/enterprise/agencies/full/dark/keith-mifsud.png)

Keith Mifsud

I help you and your team cost-effectively develop, deploy, and scale systems with Nuxt.

United Kingdom

[](/enterprise/agencies/keith-mifsud)

# The Nuxt Blog

Read the latest news about all Nuxt solutions, from framework announcements to integration tutorials. [RSS](/blog/rss.xml)

Subscribe to our newsletter

Stay updated on new releases and features, guides, and community updates.

Subscribe

![Meet Nuxi image](https://ipx.nuxt.com/s_672x378/assets/blog/meet-nuxi.png)

[](/blog/meet-nuxi)

ArticleJun 9, 2026

## Meet Nuxi

Today, we're announcing the new Nuxt Agent: Nuxi. We want to make your Nuxt experience less generic and more personalized, with the care that characterizes the Nuxt community.

[![Sébastien Chopin avatar](https://github.com/Atinux.png)](https://x.com/Atinux)[![Hugo Richard avatar](https://github.com/hugorcd.png)](https://x.com/hugorcd)

![Introducing the Nuxt Agent image](https://ipx.nuxt.com/s_437x246/nuxt-agent.jpg)

[](/blog/introducing-nuxt-agent)

ArticleApr 29, 2026

## Introducing the Nuxt Agent

Our own AI agent on nuxt.com, grounded in the official docs and the Nuxt ecosystem. We built it internally using the AI SDK, our MCP server, and Nuxt UI components.

[![Sébastien Chopin avatar](https://github.com/Atinux.png)](https://x.com/Atinux)[![Hugo Richard avatar](https://github.com/hugorcd.png)](https://x.com/hugorcd)

![Nuxt 4.4 image](https://ipx.nuxt.com/s_437x246/assets/blog/v4.4.png)

[](/blog/v4-4)

ReleaseMar 12, 2026

## Nuxt 4.4

Nuxt 4.4 brings custom useFetch/useAsyncData factories, vue-router v5, a new accessibility announcer, typed layout props, build profiling, smarter payload handling, and much more.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt 4.3 image](https://ipx.nuxt.com/s_437x246/assets/blog/v4.3.png)

[](/blog/v4-3)

ReleaseJan 22, 2026

## Nuxt 4.3

Nuxt 4.3 is out – route rule layouts, ISR payload extraction, draggable error overlay, and more!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Building an MCP Server for Nuxt image](https://ipx.nuxt.com/s_437x246/assets/blog/building-nuxt-mcp.png)

[](/blog/building-nuxt-mcp)

ArticleNov 13, 2025

## Building an MCP Server for Nuxt

How we built the Nuxt MCP server to enable AI assistants to access our documentation through structured data and composable tools.

[![Sébastien Chopin avatar](https://github.com/Atinux.png)](https://x.com/Atinux)[![Hugo Richard avatar](https://github.com/hugorcd.png)](https://x.com/hugorcd)

![Nuxt Image v2 image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-image-v2.png)

[](/blog/nuxt-image-v2)

ReleaseNov 5, 2025

## Nuxt Image v2

Nuxt Image v2 is out - with full TypeScript support, IPX v3, and new providers!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt 4.2 image](https://ipx.nuxt.com/s_437x246/assets/blog/v4.2.png)

[](/blog/v4-2)

ReleaseOct 25, 2025

## Nuxt 4.2

Nuxt 4.2 is out - with experimental TypeScript plugin support, better error handling in development, abort control for data fetching, and more!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt UI v4 image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-ui-v4.png)

[](/blog/nuxt-ui-v4)

ReleaseSep 22, 2025

## Nuxt UI v4

Nuxt UI v4 unifies Nuxt UI and Nuxt UI Pro into one powerful, completely free library. With over 110 components, 12 templates, and a comprehensive Figma kit, all of this is available for free.

[![Hugo Richard avatar](https://github.com/hugorcd.png)](https://x.com/hugorcd)[![Sébastien Chopin avatar](https://github.com/atinux.png)](https://x.com/atinux)[![Benjamin Canac avatar](https://github.com/benjamincanac.png)](https://x.com/benjamincanac)

![Nuxt 4.1 image](https://ipx.nuxt.com/s_437x246/assets/blog/v4.1.png)

[](/blog/v4-1)

ReleaseSep 2, 2025

## Nuxt 4.1

Nuxt 4.1 is out - bringing enhanced build stability, better development experience, and powerful new features for module authors!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt 3.18 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.18.png)

[](/blog/v3-18)

ReleaseJul 28, 2025

## Nuxt 3.18

Nuxt 3.18 is out - bringing v4 features to v3, improved accessibility, better browser dev tooling integration, and performance enhancements!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Announcing Nuxt 4.0 image](https://ipx.nuxt.com/s_437x246/assets/blog/v4.png)

[](/blog/v4)

ReleaseJul 15, 2025

## Announcing Nuxt 4.0

Nuxt 4.0 is here! A thoughtful evolution focused on developer experience, with better project organization, smarter data fetching, and improved type safety.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Building a Privacy-First Feedback Widget image](https://ipx.nuxt.com/s_437x246/assets/blog/gathering-feedback.png)

[](/blog/building-a-feedback-widget)

ArticleJun 13, 2025

## Building a Privacy-First Feedback Widget

A lightweight, privacy-focused widget to gather your feedback on Nuxt documentation, built with Drizzle, NuxtHub database and Motion Vue.

[![Sébastien Chopin avatar](https://github.com/Atinux.png)](https://x.com/Atinux)[![Hugo Richard avatar](https://github.com/hugorcd.png)](https://x.com/hugorcd)

![Roadmap to v4 image](https://ipx.nuxt.com/s_437x246/assets/blog/roadmap-v4.png)

[](/blog/roadmap-v4)

ReleaseJun 2, 2025

## Roadmap to v4

We have some exciting news about the roadmap to Nuxt 4, including a new timeline and what to expect in the next few weeks.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt 3.17 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.17.png)

[](/blog/v3-17)

ReleaseApr 27, 2025

## Nuxt 3.17

Nuxt 3.17 is out - bringing a major reworking of the async data layer, a new built-in component, better warnings, and performance improvements!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt UI v3 image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-ui-v3.png)

[](/blog/nuxt-ui-v3)

ReleaseMar 12, 2025

## Nuxt UI v3

Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS v4 support, and full Vue compatibility

[![Hugo Richard avatar](https://github.com/hugorcd.png)](https://x.com/hugorcd)[![Sébastien Chopin avatar](https://github.com/atinux.png)](https://x.com/atinux)[![Benjamin Canac avatar](https://github.com/benjamincanac.png)](https://x.com/benjamincanac)

![Nuxt 3.16 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.16.png)

[](/blog/v3-16)

ReleaseMar 7, 2025

## Nuxt 3.16

Nuxt 3.16 is out - packed with features and performance improvements

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt 3.15 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.15.png)

[](/blog/v3-15)

ReleaseDec 24, 2024

## Nuxt 3.15

Nuxt 3.15 is out - with Vite 6, better HMR and faster performance

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Introducing Nuxt Icon v1 image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-icon/cover.png)

[](/blog/nuxt-icon-v1-0)

ReleaseNov 25, 2024

## Introducing Nuxt Icon v1

Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects.

![Anthony Fu avatar](https://github.com/antfu.png)

[](https://github.com/antfu)

Anthony Fu

![Nuxt 3.14 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.14.png)

[](/blog/v3-14)

ReleaseNov 4, 2024

## Nuxt 3.14

Nuxt 3.14 is out - with a new rspack builder, shared folder, and performance enhancements!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt 3.13 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.13.png)

[](/blog/v3-13)

ReleaseAug 22, 2024

## Nuxt 3.13

Nuxt 3.13 is out - porting back some of the new features we're building for Nuxt 4!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Introducing Nuxt Scripts image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-scripts/banner.png)

[](/blog/nuxt-scripts)

ReleaseAug 20, 2024

## Introducing Nuxt Scripts

Nuxt Scripts provides better performance, privacy, security, and developer experience for third-party scripts.

![Harlan Wilton avatar](https://github.com/harlan-zw.png)

[](https://github.com/harlan-zw)

Harlan Wilton

![Nuxt 2 End-of-Life (EOL) image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt2-eol.png)

[](/blog/nuxt2-eol)

AnnouncementJun 14, 2024

## Nuxt 2 End-of-Life (EOL)

Nuxt 2 will reach End of Life (EOL) on June 30th, 2024. We've partnered with HeroDevs on offering Never-Ending Support (NES).

[![Daniel Roe avatar](https://github.com/danielroe.png)](https://bsky.app/profile/danielroe.dev)[![Sébastien Chopin avatar](https://github.com/Atinux.png)](https://x.com/atinux)

![Nuxt 3.12 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.12.png)

[](/blog/v3-12)

ReleaseJun 10, 2024

## Nuxt 3.12

Nuxt 3.12 is out - full of improvements and preparing the way for Nuxt 4!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Refreshed Nuxt ESLint Integrations image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-eslint-refreshed.png)

[](/blog/eslint-module)

ArticleApr 10, 2024

## Refreshed Nuxt ESLint Integrations

We revamped our ESLint integrations to support ESLint v9 with the flat config, as well as a new module with many more capabilities.

![Anthony Fu avatar](https://github.com/antfu.png)

[](https://github.com/antfu)

Anthony Fu

![Nuxt: Looking forward image](https://ipx.nuxt.com/s_437x246/assets/blog/vision-for-2024.png)

[](/blog/looking-forward-2024)

ReleaseMar 28, 2024

## Nuxt: Looking forward

A lot of things have happened for Nuxt over the last year. Sébastien and Daniel share their thoughts on what we've achieved, and where we're going next.

[![Sébastien Chopin avatar](https://github.com/atinux.png)](https://x.com/atinux)[![Daniel Roe avatar](https://github.com/danielroe.png)](https://bsky.app/profile/danielroe.dev)

![Nuxt 3.11 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.11.png)

[](/blog/v3-11)

ReleaseMar 16, 2024

## Nuxt 3.11

Nuxt 3.11 is out - with better logging, preview mode, server pages and much more!

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![The Evolution of Shiki v1.0 image](https://ipx.nuxt.com/s_437x246/assets/blog/shiki-cover.png)

[](/blog/shiki-v1)

ArticleMar 11, 2024

## The Evolution of Shiki v1.0

Shiki v1.0 came with many improvements and features - see how Nuxt drives the evolution of Shiki!

![Anthony Fu avatar](https://github.com/antfu.png)

[](https://github.com/antfu)

Anthony Fu

![Nuxt 3.10 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.10.png)

[](/blog/v3-10)

ReleaseJan 30, 2024

## Nuxt 3.10

Nuxt 3.10 is out - packed with features and fixes. Here are a few highlights.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt 3.9 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.9.png)

[](/blog/v3-9)

ReleaseDec 25, 2023

## Nuxt 3.9

Nuxt 3.9 is out - a Christmas gift from the Nuxt team bringing Vite 5, interactive server components, new composables, a new loading API and more.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt DevTools v1.0 image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-devtools-1-0.png)

[](/blog/nuxt-devtools-v1-0)

ReleaseNov 13, 2023

## Nuxt DevTools v1.0

Nuxt DevTools v1.0 is out, generally available to all Nuxt projects!

![Anthony Fu avatar](https://github.com/antfu.png)

[](https://github.com/antfu)

Anthony Fu

![Nuxt 3.8 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.8.png)

[](/blog/v3-8)

ReleaseOct 19, 2023

## Nuxt 3.8

Nuxt 3.8 is out, bringing built-in DevTools, automatic Nuxt Image install, a new app manifest and much more.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![A New Website image](https://ipx.nuxt.com/s_437x246/assets/blog/new-website.png)

[](/blog/new-website)

AnnouncementOct 18, 2023

## A New Website

We are thrilled to release the new nuxt.com, powered by Nuxt UI and now open source.

[![Benjamin Canac avatar](https://github.com/benjamincanac.png)](https://x.com/benjamincanac)[![Sébastien Chopin avatar](https://github.com/atinux.png)](https://x.com/atinux)

![Nuxt 3.7 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.7.png)

[](/blog/v3-7)

ReleaseAug 25, 2023

## Nuxt 3.7

Nuxt 3.7 is out, bringing a new CLI, native web streams and response, rendering optimisations, async context support - and much more.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt on the Edge image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-on-the-edge.png)

[](/blog/nuxt-on-the-edge)

ArticleJul 13, 2023

## Nuxt on the Edge

Learn how we made Nuxt 3 capable of running on edge runtimes to run with server-side rendering close to your users.

![Sébastien Chopin avatar](https://github.com/atinux.png)

[](https://x.com/atinux)

Sébastien Chopin

![Nuxt 3.6 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3-6.png)

[](/blog/v3-6)

ReleaseJun 23, 2023

## Nuxt 3.6

Nuxt 3.6 is out, bringing performance improvements, fully static server components, better style inlining, static presets, increased type safety - and much more.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt 3.5 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3-5.png)

[](/blog/v3-5)

ReleaseMay 16, 2023

## Nuxt 3.5

Nuxt 3.5.0 is out, bringing Vue 3.3, new defaults, interactive server components, typed pages, environment config - and much more.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt 3.4 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3-4.png)

[](/blog/v3-4)

ReleaseApr 11, 2023

## Nuxt 3.4

Nuxt 3.4.0 is the latest release of Nuxt 3, bringing exciting new features, including support for the View Transitions API, transferring rich JavaScript payloads from server to client - and much more.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Introducing Nuxt DevTools image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-devtools.png)

[](/blog/introducing-nuxt-devtools)

ReleaseMar 27, 2023

## Introducing Nuxt DevTools

Unleash the Developer Experience with Nuxt and understand your app better than ever.

![Anthony Fu avatar](https://github.com/antfu.png)

[](https://github.com/antfu)

Anthony Fu

![Nuxt 3.3 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3-3.png)

[](/blog/v3-3)

ReleaseMar 14, 2023

## Nuxt 3.3

The 3.3.0 is a minor (feature) release with lots of performance and DX improvements, bug fixes and new features to play with.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Nuxt: A vision for 2023 image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-a-vision-for-2023.png)

[](/blog/vision-2023)

ReleaseJan 17, 2023

## Nuxt: A vision for 2023

This past year has been an exciting one. Looking into the new year, there is a lot we have planned as a team and we'd love to share it with you.

![Daniel Roe avatar](https://github.com/danielroe.png)

[](https://bsky.app/profile/danielroe.dev)

Daniel Roe

![Announcing 3.0 image](https://ipx.nuxt.com/s_437x246/assets/blog/v3.png)

[](/blog/v3)

ReleaseNov 16, 2022

## Announcing 3.0

We are thrilled to announce the first stable version of Nuxt 3.0.0

![Pooya Parsa avatar](https://github.com/pi0.png)

[](https://x.com/_pi0_)

Pooya Parsa

![Announcing Nuxt 3 Release Candidate image](https://ipx.nuxt.com/s_437x246/assets/blog/announcing-nuxt-3-release-candidate.png)

[](/blog/nuxt3-rc)

ReleaseApr 12, 2022

## Announcing Nuxt 3 Release Candidate

Nuxt 3 beta was announced on October 12, 2021 after 16 months of work, introducing a new foundation based on Vue 3, Vite and Nitro. Six months later, we are happy to announce the first release candidate of Nuxt 3, code named “Mount Hope“ 🚀

[![Clement Ollivier avatar](https://github.com/clemcode.png)](https://x.com/clemcodes)[![Alexandre Chopin avatar](https://github.com/alexchopin.png)](https://x.com/thewikeo)[![Anthony Fu avatar](https://github.com/antfu.png)](https://github.com/antfu)[![Daniel Roe avatar](https://github.com/danielroe.png)](https://bsky.app/profile/danielroe.dev)[![Sébastien Chopin avatar](https://github.com/Atinux.png)](https://x.com/atinux)

![Introducing Nuxt 3 Beta image](https://ipx.nuxt.com/s_437x246/assets/blog/introducing-nuxt-3-beta.png)

[](/blog/nuxt3-beta)

ReleaseOct 11, 2021

## Introducing Nuxt 3 Beta

468 days after the first commit, the Nuxt 3 beta has finally arrived. Discover what's inside and what to expect from it. Yes, it includes Vue 3 and Vite ⚡️

[![Alexandre Chopin avatar](https://github.com/alexchopin.png)](https://x.com/thewikeo)[![Daniel Roe avatar](https://github.com/danielroe.png)](https://bsky.app/profile/danielroe.dev)[![Pooya Parsa avatar](https://github.com/pi0.png)](https://x.com/_pi0_)[![Sébastien Chopin avatar](https://github.com/Atinux.png)](https://x.com/atinux)

![Nuxt 2 Static Improvements image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-static-improvements.png)

[](/blog/nuxt-static-improvements)

ReleaseJul 27, 2020

## Nuxt 2 Static Improvements

With Nuxt version 2.13, the full-static mode has been introduced. In addition, a new command nuxt export was added to pre-render your pages without triggering a webpack build with the goal to separate the rendering and build process. The only issue was that most Nuxt users weren't able to unleash the full potential of the separation... until now.

[![Pooya Parsa avatar](https://github.com/pi0.png)](https://x.com/_pi0_)[![Sébastien Chopin avatar](https://github.com/Atinux.png)](https://x.com/atinux)[![Alexander Lichter avatar](https://github.com/manniL.png)](https://x.com/TheAlexLichter)

![Going Full Static image](https://ipx.nuxt.com/s_437x246/assets/blog/going-full-static.png)

[](/blog/going-full-static)

ReleaseJun 18, 2020

## Going Full Static

Long awaited features for JAMstack fans has been shipped in v2.13: full static export, improved smart prefetching, integrated crawler, faster re-deploy, built-in web server and new target option for config ⚡️

![Sebastien Chopin avatar](https://github.com/Atinux.png)

[](https://x.com/atinux)

Sebastien Chopin

![Understanding how fetch works in Nuxt 2.12 image](https://ipx.nuxt.com/s_437x246/assets/blog/understanding-how-fetch-works-in-nuxt-2.12.png)

[](/blog/understanding-how-fetch-works-in-nuxt-2-12)

ReleaseApr 6, 2020

## Understanding how fetch works in Nuxt 2.12

Explore different features of the fetch hook and learn a brand new way to bring data into Nuxt applications.

![Krutie Patel avatar](https://github.com/Krutie.png)

[](https://x.com/KrutiePatel)

Krutie Patel

![Nuxt 2: From Terminal to Browser image](https://ipx.nuxt.com/s_437x246/assets/blog/nuxt-from-terminal-to-browser.png)

[](/blog/nuxtjs-from-terminal-to-browser)

ReleaseJun 3, 2019

## Nuxt 2: From Terminal to Browser

How we changed the developer experience to stop switching between the terminal and browser.

![Sébastien Chopin avatar](https://github.com/atinux.png)

[](https://x.com/atinux)

Sébastien Chopin

![Introducing Smart Prefetching image](https://ipx.nuxt.com/s_437x246/assets/blog/introducing-smart-prefetching.png)

[](/blog/introducing-smart-prefetching)

ReleaseJan 28, 2019

## Introducing Smart Prefetching

Starting from Nuxt v2.4.0, Nuxt will automagically prefetch the code-splitted pages linked with a nuxt-link when visible in the viewport by default.

![Sébastien Chopin avatar](https://github.com/Atinux.png)

[](https://x.com/atinux)

Sébastien Chopin

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
bun install @nuxt/ui tailwindcss
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

