import { definePlugin } from "nitro";

export default definePlugin((nitroApp) => {
  // Hook into request lifecycle
  nitroApp.hooks.hook("request", (event) => {
    console.log("Request received:", event.node.req.url);
  });
  
  nitroApp.hooks.hook("response", (event, response) => {
    console.log("Response sent");
  });
  
  // Handle errors
  nitroApp.hooks.hook("error", (error, event) => {
    console.error("Error occurred:", error);
  });
});
