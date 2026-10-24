#!/usr/bin/env node
// MCP stdio smoke test: initialize -> notifications/initialized -> tools/list -> optional tools/call
// Usage:
//   node mcp-smoke.mjs --config ~/.agents/mcp/mcp_config.json --server <name>
//   node mcp-smoke.mjs --command <exe> [--args <a>]... [--env K=V]...
//   add --call <tool_name> --input '{"key":"value"}' to prove a real tool call
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";

const argv = process.argv.slice(2);
const take = (flag) => {
  const i = argv.indexOf(flag);
  if (i === -1) return undefined;
  const value = argv[i + 1];
  argv.splice(i, 2);
  return value;
};
const takeAll = (flag) => {
  const out = [];
  let i;
  while ((i = argv.indexOf(flag)) !== -1) {
    out.push(argv[i + 1]);
    argv.splice(i, 2);
  }
  return out;
};

const configPath = take("--config");
const serverName = take("--server");
let command = take("--command");
let args = takeAll("--args");
const envPairs = takeAll("--env");
const callTool = take("--call");
const callInputRaw = take("--input");
const timeoutMs = Number(take("--timeout") ?? 20000);

const fail = (reason, extra = {}) => {
  console.log(JSON.stringify({ ok: false, reason, ...extra }, null, 2));
  process.exit(1);
};

if (configPath) {
  if (!serverName) fail("--config requires --server <name>");
  let config;
  try {
    config = JSON.parse(readFileSync(configPath.replace(/^~/, process.env.HOME ?? process.env.USERPROFILE ?? ""), "utf8"));
  } catch (error) {
    fail("config unreadable", { configPath, error: String(error.message) });
  }
  const entry = config?.mcpServers?.[serverName];
  if (!entry) fail("server not found in config", { serverName, available: Object.keys(config?.mcpServers ?? {}) });
  if (!entry.command) fail("remote server (no command) — test it from the client, not this script", { serverName, entry: Object.keys(entry) });
  command = entry.command;
  args = entry.args ?? [];
  Object.assign(process.env, entry.env ?? {});
}
if (!command) fail("usage: --config <file> --server <name> | --command <exe> [--args <a>] [--env K=V]");

const env = { ...process.env };
for (const pair of envPairs) {
  const at = pair.indexOf("=");
  if (at > 0) env[pair.slice(0, at)] = pair.slice(at + 1);
}
const quote = (value) => (process.platform === "win32" && /\s/.test(value) ? `"${value}"` : value);
const useShell = process.platform === "win32" && !/[\\/]/.test(command) && !/\.exe$/i.test(command);

const child = spawn(command, args.map(quote), {
  stdio: ["pipe", "pipe", "pipe"],
  env,
  shell: useShell,
  windowsHide: true,
});
child.on("error", (error) => fail("spawn failed", { command, error: String(error.message) }));

let stderr = "";
child.stderr.on("data", (chunk) => {
  stderr = (stderr + chunk.toString()).slice(-2000);
});

const pending = new Map();
let nextId = 1;
const send = (message) => child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`);
const request = (method, params) =>
  new Promise((resolve) => {
    const id = nextId++;
    const timer = setTimeout(() => {
      pending.delete(id);
      resolve({ error: { code: "timeout", message: `${method} timed out after ${timeoutMs} ms` } });
    }, timeoutMs);
    pending.set(id, (response) => {
      clearTimeout(timer);
      resolve(response);
    });
    send({ id, method, params });
  });

const done = (result) => {
  console.log(JSON.stringify(result, null, 2));
  child.kill();
  process.exit(result.ok ? 0 : 1);
};

createInterface({ input: child.stdout }).on("line", (line) => {
  if (!line.trim()) return;
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return;
  }
  if (message.id !== undefined && pending.has(message.id)) {
    const resolve = pending.get(message.id);
    pending.delete(message.id);
    resolve(message);
  }
});

const protocolVersion = "2025-06-18";
const init = await request("initialize", {
  protocolVersion,
  capabilities: {},
  clientInfo: { name: "mcp-smoke", version: "1.0.0" },
});
if (init.error) done({ ok: false, stage: "initialize", error: init.error, stderr });

send({ method: "notifications/initialized" });
const listed = await request("tools/list", {});
if (listed.error) done({ ok: false, stage: "tools/list", error: listed.error, initialize: init.result, stderr });

const tools = (listed.result?.tools ?? []).map((tool) => tool.name);
const result = {
  ok: true,
  server: serverName ?? command,
  transport: "stdio",
  protocolVersion: init.result?.protocolVersion,
  serverInfo: init.result?.serverInfo,
  toolCount: tools.length,
  tools: tools.slice(0, 20),
};

if (callTool) {
  let input = {};
  if (callInputRaw) {
    try {
      input = JSON.parse(callInputRaw);
    } catch (error) {
      done({ ...result, ok: false, stage: "tools/call input", error: String(error.message) });
    }
  }
  const called = await request("tools/call", { name: callTool, arguments: input });
  result.call = called.error
    ? { ok: false, error: called.error }
    : { ok: !called.result?.isError, contentTypes: (called.result?.content ?? []).map((part) => part.type) };
  if (!result.call.ok) done({ ...result, ok: false, stage: "tools/call", stderr });
} else if (tools.length === 0) {
  done({ ...result, ok: false, stage: "tools/list", error: "server exposed zero tools" });
}

child.kill();
done(result);
