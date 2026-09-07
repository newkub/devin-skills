import {
  CONCURRENCY,
  Result,
  Semaphore,
  SKILLS_ROOT,
  fetchDescription,
  getHostname,
  getSkillName,
  parseAbout,
  parseExistingValue,
  parseWebsiteUrl,
  runCrwMap,
  truncate,
} from "./lib/utils.ts";

const DOC_PATHS = ["doc", "guide", "getting-started", "learn", "intro", "manual", "reference", "tutorial"];

function isSameOrigin(a: string, b: string): boolean {
  return getHostname(a) === getHostname(b);
}

function pickDocumentation(websiteUrl: string, links: string[]): string | null {
  const candidates = links.filter((l) => {
    if (!isSameOrigin(websiteUrl, l)) return false;
    if (l.toLowerCase().includes("docs.github.com")) return false;
    const lower = l.toLowerCase();
    return DOC_PATHS.some((p) => lower.includes(`/${p}`));
  });
  for (const c of candidates) {
    if (/\/docs\/?$/i.test(c)) return c;
  }
  for (const c of candidates) {
    if (/\/guide(?:s)?\/?$/i.test(c)) return c;
  }
  for (const c of candidates) {
    if (/getting-started/i.test(c)) return c;
  }
  return candidates[0] ?? null;
}

function pickRepository(links: string[]): string | null {
  for (const l of links) {
    if (l.toLowerCase().includes("github.com") || l.toLowerCase().includes("gitlab.com")) return l;
  }
  return null;
}

function titleCaseSkill(skill: string): string {
  return skill
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function processFile(filePath: string, skill: string, results: Result[], limiter: Semaphore) {
  await limiter.acquire();
  try {
    const text = await Bun.file(filePath).text();
    const websiteUrl = parseWebsiteUrl(text);
    if (!websiteUrl) {
      results.push({ skill, status: "skipped", note: "no [Website] link" });
      return;
    }

    const crw = await runCrwMap(websiteUrl, true);
    const links: string[] = crw.json?.links || [];

    const existingDoc = parseExistingValue(text, "Documentation");
    const newDoc = pickDocumentation(websiteUrl, links);
    const docUrl =
      (existingDoc && isSameOrigin(websiteUrl, existingDoc) ? existingDoc : null) ||
      newDoc ||
      null;
    const repoUrl = parseExistingValue(text, "Repository") || pickRepository(links);
    const pkgUrl = parseExistingValue(text, "Package Registry");
    const existingAbout = parseAbout(text);

    const fetchedAbout = await fetchDescription(websiteUrl, 140);
    const aboutText = (fetchedAbout ? truncate(fetchedAbout, 140) : "") || existingAbout || "";

    const lines = text.split(/\r?\n/);
    const heading = lines[0].startsWith("#") ? lines[0].trim() : `# ${titleCaseSkill(skill)} Official Resources`;

    const parts: string[] = [];
    parts.push(heading);
    parts.push("");
    parts.push(`- [Website](${websiteUrl})`);
    if (docUrl) parts.push(`- [Documentation](${docUrl})`);
    if (repoUrl) parts.push(`- [Repository](${repoUrl})`);
    if (pkgUrl) parts.push(`- [Package Registry](${pkgUrl})`);
    if (aboutText) parts.push(`- About: ${aboutText}`);

    const changed = text.trim() !== parts.join("\n").trim();

    if (!changed) {
      results.push({ skill, status: "no-change", note: "up to date" });
      return;
    }

    await Bun.write(filePath, parts.join("\n") + "\n");
    results.push({ skill, status: "updated", note: fetchedAbout ? "fetched metadata" : "restructured" });
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
  for await (const f of glob.scan({ cwd: SKILLS_ROOT, absolute: true })) {
    files.push(f);
  }

  const limiter = new Semaphore(CONCURRENCY);
  const results: Result[] = [];

  await Promise.all(
    files.map(async (f) => {
      const skill = getSkillName(f);
      if (targetSkill && skill !== targetSkill) return;
      return processFile(f, skill, results, limiter);
    })
  );

  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("Summary:", counts);
  console.log("Details:");
  for (const r of results) {
    if (r.status !== "updated" && r.status !== "no-change") {
      console.log(`- ${r.skill}: ${r.status} (${r.note})`);
    }
  }
}

if (import.meta.main) main();
