import { defineHandler } from "nitro";

export default defineHandler((event) => {
  return {
    message: "Hello World",
    timestamp: new Date().toISOString()
  };
});
