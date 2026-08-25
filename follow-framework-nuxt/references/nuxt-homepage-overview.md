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
