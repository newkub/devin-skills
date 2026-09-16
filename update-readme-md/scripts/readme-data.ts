/**
 * readme-data.ts
 * Project introspection helpers for baseline README generation.
 */

import { statSync } from "node:fs";
import { join } from "node:path";

export async function readJson(path: string): Promise<any> {
  try {
    return await Bun.file(path).json();
  } catch {
    return null;
  }
}

export function isDir(path: string): boolean {
  try { return statSync(path).isDirectory(); } catch { return false; }
}

export async function hasFile(path: string, name: string): Promise<boolean> {
  return Bun.file(join(path, name)).exists();
}

export function detectTechStack(pkg: any): { name: string; color: string }[] {
  const badges: { name: string; color: string }[] = [];
  const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };
  if (deps.typescript) badges.push({ name: "TypeScript", color: "1976d2" });
  if (deps.bun || deps["@types/bun"]) badges.push({ name: "Bun", color: "f57c00" });
  if (deps.react) badges.push({ name: "React", color: "0097a7" });
  if (deps["solid-js"]) badges.push({ name: "SolidJS", color: "388e3c" });
  if (deps.nuxt) badges.push({ name: "Nuxt", color: "388e3c" });
  if (deps.next) badges.push({ name: "Next.js", color: "303f9f" });
  if (deps.tailwindcss) badges.push({ name: "Tailwind", color: "0097a7" });
  if (deps.elysia) badges.push({ name: "Elysia", color: "00796b" });
  if (deps.hono) badges.push({ name: "Hono", color: "ffa000" });
  if (deps["@tauri-apps/cli"]) badges.push({ name: "Tauri", color: "c2185b" });
  if (deps.electron) badges.push({ name: "Electron", color: "1976d2" });
  if (deps.vite) badges.push({ name: "Vite", color: "7b1fa2" });
  if (deps.turbo) badges.push({ name: "Turborepo", color: "00796b" });
  if (deps.moon) badges.push({ name: "moonrepo", color: "d32f2f" });
  if (deps.rust) badges.push({ name: "Rust", color: "f57c00" });
  return badges.slice(0, 5);
}

export function badgeUrl(label: string, color: string) {
  const msg = label.replace(/ /g, "_");
  return `https://img.shields.io/badge/${msg}-${color}`;
}

export async function getStatus(path: string): Promise<string> {
  return (await hasFile(path, "CHANGELOG.md")) ? "active" : "in development";
}

export function getProjectName(path: string, pkg: any): string {
  if (pkg?.name) return pkg.name.split("/").pop() || pkg.name;
  const parts = path.split("\\");
  return parts[parts.length - 1];
}

export function getDescription(path: string, pkg: any): string {
  if (pkg?.description) return pkg.description;
  return `${getProjectName(path, pkg)} project.`;
}

export function getScriptCommands(pkg: any): Record<string, string> {
  return pkg?.scripts || {};
}

export function getFeaturesFromScripts(pkg: any, projectName: string): string[] {
  const scripts = getScriptCommands(pkg);
  const map: Record<string, string> = {
    dev: "Run in development",
    build: "Build for production",
    test: "Run tests",
    lint: "Lint source",
    format: "Format source",
    typecheck: "Type-check source",
    preview: "Preview production build",
    deploy: "Deploy the project",
    start: "Start the server",
    prepare: "Prepare the workspace",
    verify: "Verify the project",
    check: "Run project checks",
    "build:web": "Build the web app",
    "dev:web": "Develop the web app",
    "dev:mobile": "Develop the mobile app",
    "build:mobile": "Build the mobile app",
  };
  const features: string[] = [];
  for (const [k, v] of Object.entries(scripts)) {
    const desc = map[k] || v || k;
    features.push(`${k}|${desc}`);
  }
  if (features.length === 0) features.push(`main|Main ${projectName} entry`);
  return features.slice(0, 10);
}

export function iconForScript(name: string): { set: string; icon: string; color: string } {
  if (name.includes("dev")) return { set: "lucide", icon: "play", color: "388e3c" };
  if (name.includes("build")) return { set: "lucide", icon: "hammer", color: "f57c00" };
  if (name.includes("test")) return { set: "lucide", icon: "check-circle", color: "1976d2" };
  if (name.includes("lint")) return { set: "lucide", icon: "shield", color: "d32f2f" };
  if (name.includes("format")) return { set: "lucide", icon: "align-left", color: "7b1fa2" };
  if (name.includes("deploy")) return { set: "lucide", icon: "rocket", color: "0097a7" };
  if (name.includes("preview")) return { set: "lucide", icon: "eye", color: "303f9f" };
  if (name.includes("mobile")) return { set: "mdi", icon: "cellphone", color: "c2185b" };
  if (name.includes("web")) return { set: "mdi", icon: "web", color: "00796b" };
  return { set: "lucide", icon: "zap", color: "ffa000" };
}

export function iconUrl(set: string, icon: string, color: string): string {
  return `https://api.iconify.design/${set}:${icon}.svg?color=%23${color}&width=16`;
}

export function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
