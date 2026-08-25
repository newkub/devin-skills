// วิเคราะห์ 478 context-only skills ที่เหลือ จัดกลุ่มเพื่อกำหนด hint
import { Glob, file } from "bun";

const skillsRoot = "C:/Users/Veerapong/AppData/Roaming/devin/skills";
const glob = new Glob("*/SKILL.md");

const categories: Record<string, string[]> = {
  "follow-* (framework/library context)": [],
  "review-* (review context)": [],
  "report-* (report context)": [],
  "run-* (run command context)": [],
  "check-* (check context)": [],
  "deep-* (deep analysis context)": [],
  "roleplay-* (roleplay context)": [],
  "list-* (list context)": [],
  "update-* (update context)": [],
  "implement-* (implement context)": [],
  "git-* (git context)": [],
  "watch-* (watch context)": [],
  "use-* (use tool context)": [],
  "cleanup-* (cleanup context)": [],
  "convert-* (convert context)": [],
  "edit-* (edit context)": [],
  "refactor-* (refactor context)": [],
  "write-* (write context)": [],
  "other (miscellaneous)": [],
};

for await (const relPath of glob.scan({ cwd: skillsRoot, absolute: false })) {
  const normalized = relPath.replace(/\\/g, "/");
  const dirName = normalized.split("/")[0];
  const content = await file(`${skillsRoot}/${normalized}`).text();
  const lines = content.split(/\r?\n/);
  const fmEnd = lines.indexOf("---", 1);
  if (fmEnd === -1) continue;
  const fm = lines.slice(1, fmEnd);
  if (fm.some((l) => l.startsWith("argument-hint:"))) continue;

  if (dirName.startsWith("follow-")) categories["follow-* (framework/library context)"].push(dirName);
  else if (dirName.startsWith("review-")) categories["review-* (review context)"].push(dirName);
  else if (dirName.startsWith("report-")) categories["report-* (report context)"].push(dirName);
  else if (dirName.startsWith("run-")) categories["run-* (run command context)"].push(dirName);
  else if (dirName.startsWith("check-")) categories["check-* (check context)"].push(dirName);
  else if (dirName.startsWith("deep-")) categories["deep-* (deep analysis context)"].push(dirName);
  else if (dirName.startsWith("roleplay-")) categories["roleplay-* (roleplay context)"].push(dirName);
  else if (dirName.startsWith("list-")) categories["list-* (list context)"].push(dirName);
  else if (dirName.startsWith("update-")) categories["update-* (update context)"].push(dirName);
  else if (dirName.startsWith("implement-")) categories["implement-* (implement context)"].push(dirName);
  else if (dirName.startsWith("git-")) categories["git-* (git context)"].push(dirName);
  else if (dirName.startsWith("watch-")) categories["watch-* (watch context)"].push(dirName);
  else if (dirName.startsWith("use-")) categories["use-* (use tool context)"].push(dirName);
  else if (dirName.startsWith("cleanup-")) categories["cleanup-* (cleanup context)"].push(dirName);
  else if (dirName.startsWith("convert-")) categories["convert-* (convert context)"].push(dirName);
  else if (dirName.startsWith("edit-")) categories["edit-* (edit context)"].push(dirName);
  else if (dirName.startsWith("refactor-")) categories["refactor-* (refactor context)"].push(dirName);
  else if (dirName.startsWith("write-")) categories["write-* (write context)"].push(dirName);
  else categories["other (miscellaneous)"].push(dirName);
}

let total = 0;
for (const [cat, items] of Object.entries(categories)) {
  if (items.length === 0) continue;
  total += items.length;
  console.log(`\n=== ${cat} (${items.length}) ===`);
  for (const i of items.sort()) console.log(`  ${i}`);
}
console.log(`\nTotal remaining: ${total}`);
