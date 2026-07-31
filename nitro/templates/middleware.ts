import { defineMiddleware } from "nitro";

export default defineMiddleware((event) => {
  // Add custom header
  setHeader(event, "x-request-id", crypto.randomUUID());
  
  // Log request
  console.log("Request:", event.node.req.url);
});
