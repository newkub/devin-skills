import { existsSync } from "node:fs";
import { join } from "node:path";
import { finding } from "./catalog.ts";
import { lineOfOffset, packageFiles, readText } from "./files.ts";
import { relPath } from "./parse.ts";
import type { Ctx, Finding } from "./types.ts";

const CREDENTIALS: { name: string; re: RegExp }[] = [
  { name: "AWS access key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: "GitHub token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g },
  { name: "Slack token", re: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g },
  { name: "Stripe live key", re: /\bsk_live_[0-9A-Za-z]{16,}\b/g },
  { name: "OpenAI key", re: /\bsk-(?:proj-)?[A-Za-z0-9]{32,}\b/g },
  { name: "Google API key", re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { name: "npm token", re: /\bnpm_[A-Za-z0-9]{36}\b/g },
  { name: "private key block", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

const PLACEHOLDER_VALUE = /example|placeholder|dummy|sample|your|redacted|xxxx|0000|1234|abcd/i;

const CURL_PIPE = /\b(?:curl|wget)\b[^\n|]{0,400}\|\s*(?:sudo(?:\s+-\S+)*\s+)?(?:ba|z|fi|k)?sh\b/;
const DANGEROUS_RM =
  /\brm\s+(?:-(?=[A-Za-z]*[rR])(?=[A-Za-z]*[fF])[A-Za-z]+\s+)*(?:--no-preserve-root\s+)?(?:\/\*?|~|\$HOME|\.\.?)(?=\s|$|[)`"';])/;
const MCP_FILES = ["mcp_config.json", ".mcp.json"];

function files(ctx: Ctx): string[] {
  const out: string[] = [];
  for (const skill of ctx.skills) out.push(...packageFiles(skill.dirPath, "text"));
  return out;
}

function scan(ctx: Ctx, test: (line: string) => string | null, rule: string): Finding[] {
  const out: Finding[] = [];
  for (const file of files(ctx)) {
    const lines = readText(file).split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const message = test(lines[i]);
      if (message) out.push(finding(rule, relPath(ctx.root, file), i + 1, message));
    }
  }
  return out;
}

export function obviousCredential(ctx: Ctx): Finding[] {
  return scan(
    ctx,
    (line) => {
      for (const { name, re } of CREDENTIALS) {
        re.lastIndex = 0;
        for (const match of line.matchAll(re)) {
          if (PLACEHOLDER_VALUE.test(match[0])) continue;
          return `${name} shape: "…${match[0].slice(-6)}"`;
        }
      }
      return null;
    },
    "sec/obvious-credential",
  );
}

export function curlPipeBash(ctx: Ctx): Finding[] {
  return scan(ctx, (line) => (CURL_PIPE.test(line) ? "download piped straight into a shell" : null), "sec/curl-pipe-bash");
}

export function dangerousRm(ctx: Ctx): Finding[] {
  return scan(
    ctx,
    (line) => (DANGEROUS_RM.test(line) ? "rm -rf targets a root, home, or cwd path" : null),
    "sec/dangerous-rm",
  );
}

export function mcpConfigValid(ctx: Ctx): Finding[] {
  const out: Finding[] = [];
  for (const name of MCP_FILES) {
    const file = join(ctx.root, name);
    if (!existsSync(file)) continue;
    const text = readText(file);
    try {
      JSON.parse(text);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const pos = message.match(/position\s+(\d+)/i);
      const line = pos ? lineOfOffset(text, Number(pos[1])) : 1;
      out.push(finding("sec/mcp-config-valid", name, line, `does not parse: ${message}`));
    }
  }
  return out;
}

export function runSec(ctx: Ctx): Finding[] {
  return [...obviousCredential(ctx), ...curlPipeBash(ctx), ...dangerousRm(ctx), ...mcpConfigValid(ctx)];
}
