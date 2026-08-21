import { defineConfig } from "nitro";

export default defineConfig({
  // General
  debug: true,
  logLevel: 3,
  
  // Features
  experimental: {
    database: true
  },
  
  // Storage
  storage: {
    redis: {
      driver: "redis",
      options: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379")
      }
    }
  },
  
  // Route rules
  routeRules: {
    "/api/**": {
      cors: true,
      headers: { "x-api": "true" }
    },
    "/static/**": {
      cache: { maxAge: 60 * 60 * 24 * 365 }
    }
  },
  
  // Dev server
  devServer: {
    port: 3000,
    host: "localhost"
  }
});
