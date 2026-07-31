import { defineRenderer } from "nitro/renderer";

export default defineRenderer(async (url) => {
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <h1>Hello from Nitro Renderer</h1>
      </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html" }
  });
});
