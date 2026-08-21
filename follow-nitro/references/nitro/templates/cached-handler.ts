import { defineCachedHandler } from "nitro/cache";

export default defineCachedHandler((event) => {
  return {
    data: "Cached content",
    cachedAt: new Date().toISOString()
  };
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true
});
