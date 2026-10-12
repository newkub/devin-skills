import { readdirSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import solid from "vite-plugin-solid";

function latestIdeasFile(): string | null {
  if (process.env.IDEA_DATA) return process.env.IDEA_DATA;
  try {
    return (
      readdirSync(tmpdir())
        .filter((d) => d.startsWith("idea-features-"))
        .map((d) => join(tmpdir(), d, "ideas.json"))
        .filter((p) => {
          try {
            return statSync(p).isFile();
          } catch {
            return false;
          }
        })
        .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0] ?? null
    );
  } catch {
    return null;
  }
}

function ideasPlugin(): Plugin {
  return {
    name: "idea-features-data",
    configureServer(server) {
      server.middlewares.use("/ideas.json", (_req, res) => {
        const file = latestIdeasFile();
        if (!file) {
          res.statusCode = 404;
          res.end(JSON.stringify({ ideas: [] }));
          return;
        }
        res.setHeader("content-type", "application/json");
        res.end(readFileSync(file, "utf-8"));
      });
    },
  };
}

export default defineConfig({
  plugins: [solid(), ideasPlugin()],
});
