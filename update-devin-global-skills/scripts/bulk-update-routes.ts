import {
  CONCURRENCY,
  MAX_DESC_LEN,
  MAX_PATH_SEGMENTS,
  MAX_TOTAL_ROUTES,
  Result,
  RouteEntry,
  ROUTE_CONCURRENCY,
  Semaphore,
  SKILLS_ROOT,
  fetchDescription,
  getSegments,
  getSkillName,
  isLocale,
  normalizePath,
  parseDocumentationUrl,
  parseWebsiteUrl,
  runCrwMap,
  runCrwScrape,
  sameHostname,
} from "./lib/utils.ts";

async function discoverRoutes(websiteUrl: string): Promise<{ routes: string[]; method: string; note: string }> {
  const websiteFirstSeg = new URL(websiteUrl).pathname.split("/").filter(Boolean)[0]?.toLowerCase() ?? null;

  let crw = await runCrwMap(websiteUrl, true);
  let method = "map --no-sitemap";
  if (!crw.json) {
    if (crw.error?.toLowerCase().includes("timeout")) {
      crw = await runCrwMap(websiteUrl, false);
      method = "map (sitemap fallback)";
    }
  }
  if (!crw.json) {
    crw = await runCrwScrape(websiteUrl);
    method = "scrape (homepage fallback)";
  }
  if (!crw.json) {
    return { routes: [], method, note: crw.error || "all crw attempts failed" };
  }

  const links: string[] = crw.json.links || [];
  const routes: string[] = [];
  const seen = new Set<string>();
  const origin = new URL(websiteUrl).origin;

  for (const link of links) {
    if (!sameHostname(websiteUrl, link)) continue;
    const p = normalizePath(link);
    const segs = p === "/" ? [] : p.split("/").filter(Boolean);
    if (segs.length === 0) {
      const full = origin + "/";
      if (!seen.has(full)) {
        seen.add(full);
        routes.push(full);
      }
      continue;
    }
    if (websiteFirstSeg && isLocale(segs[0]) && segs[0].toLowerCase() !== websiteFirstSeg) {
      continue;
    }
    const collapsed = getSegments(p, MAX_PATH_SEGMENTS);
    const full = origin + (collapsed === "/" ? "/" : collapsed);
    if (!seen.has(full)) {
      seen.add(full);
      routes.push(full);
    }
  }

  routes.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return { routes, method, note: `${routes.length} routes via ${method}` };
}

async function fetchRouteDescription(url: string, limiter: Semaphore): Promise<string> {
  await limiter.acquire();
  try {
    return await fetchDescription(url, MAX_DESC_LEN);
  } finally {
    limiter.release();
  }
}

export async function processSkill(skill: string, text: string, results: Result[], limiter: Semaphore, routeLimiter: Semaphore) {
  await limiter.acquire();
  try {
    const websiteUrl = parseWebsiteUrl(text);
    if (!websiteUrl) {
      results.push({ skill, status: "skipped", note: "no [Website] link" });
      return;
    }

    const { routes, method, note } = await discoverRoutes(websiteUrl);
    if (routes.length === 0) {
      results.push({ skill, status: note.toLowerCase().includes("timeout") ? "crw-timeout" : "crw-failed", note });
      return;
    }

    const total = routes.length;
    const capped = routes.slice(0, MAX_TOTAL_ROUTES);
    const docUrl = parseDocumentationUrl(text);

    const heading = skill
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const routeEntries: RouteEntry[] = await Promise.all(
      capped.map(async (url) => {
        const description = await fetchRouteDescription(url, routeLimiter);
        return { url, description };
      })
    );

    routeEntries.sort((a, b) => a.url.toLowerCase().localeCompare(b.url.toLowerCase()));

    const lines: string[] = [];
    lines.push(`# ${heading} Route Map`);
    lines.push("");
    lines.push(`- Website: <${websiteUrl}>`);
    if (docUrl) lines.push(`- Documentation: <${docUrl}>`);
    lines.push(`- Total same-origin routes (first-${MAX_PATH_SEGMENTS} segments): ${total}`);
    if (total > MAX_TOTAL_ROUTES) {
      lines.push(`- Showing top ${MAX_TOTAL_ROUTES} routes (file cap)`);
    }
    lines.push(`- Method: ${method}`);
    lines.push("");
    lines.push("## Routes");
    lines.push("");
    lines.push("Descriptions are pulled from each page's HTML metadata (`<title>` / `<meta name=\"description\">` / Open Graph).");
    lines.push("");
    lines.push("| URL | Description |");
    lines.push("|-----|-------------|");

    for (const entry of routeEntries) {
      const safeDesc = (entry.description || "—").replace(/\|/g, "\\|");
      lines.push(`| ${entry.url} | ${safeDesc} |`);
    }

    if (total > MAX_TOTAL_ROUTES) {
      lines.push(`| ... | and ${total - MAX_TOTAL_ROUTES} more routes |`);
    }

    const outPath = `${SKILLS_ROOT}\\${skill}\\references\\routes.md`;
    const existing = await Bun.file(outPath).exists();
    const existingText = existing ? await Bun.file(outPath).text() : "";
    const outText = lines.join("\n").trim() + "\n";

    if (existingText.trim() === outText.trim()) {
      results.push({ skill, status: "no-change", note: `${total} routes` });
      return;
    }

    await Bun.write(outPath, outText);
    results.push({ skill, status: "updated", note: `${total} routes (${method})` });
  } catch (e: any) {
    results.push({ skill, status: "parse-failed", note: e.message || String(e) });
  } finally {
    limiter.release();
  }
}

async function main() {
  const targetSkill = process.argv[2];
  const glob = new Bun.Glob("*/references/website.md");
  const files: string[] = [];
  for await (const f of glob.scan({ cwd: SKILLS_ROOT, absolute: true })) files.push(f);

  const limiter = new Semaphore(CONCURRENCY);
  const routeLimiter = new Semaphore(ROUTE_CONCURRENCY);
  const results: Result[] = [];

  await Promise.all(
    files.map(async (f) => {
      const skill = getSkillName(f);
      if (targetSkill && skill !== targetSkill) return;
      const text = await Bun.file(f).text();
      return processSkill(skill, text, results, limiter, routeLimiter);
    })
  );

  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("Summary:", counts);
  console.log("Details (non-updated):");
  for (const r of results) {
    if (r.status !== "updated" && r.status !== "no-change") {
      console.log(`- ${r.skill}: ${r.status} (${r.note})`);
    }
  }
}

if (import.meta.main) main();
