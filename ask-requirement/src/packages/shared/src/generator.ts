import type { RequirementForm, RequirementSummary } from "./types";
import { getPlatformOption, getIntegrationOption, getProjectLevelOption } from "./data";

export function generateMarkdown(form: RequirementForm): string {
  const levelOpt = getProjectLevelOption(form.projectLevel);
  let md = "## Requirement Summary\n\n";

  md += "### Platform\n";
  if (form.platforms.length > 0) {
    for (const p of form.platforms) {
      const opt = getPlatformOption(p);
      md += `- ${opt ? opt.label : p}\n`;
    }
  } else {
    md += "- (ยังไม่ได้เลือก)\n";
  }

  md += "\n### Integrations\n";
  if (form.integrations.length > 0) {
    for (const i of form.integrations) {
      const opt = getIntegrationOption(i);
      md += `- ${opt ? opt.label : i}\n`;
    }
  } else {
    md += "- (ยังไม่ได้เลือก)\n";
  }

  md += "\n### Features\n";
  const features = form.features.filter((f) => f.trim());
  if (features.length > 0) {
    for (const f of features) md += `- ${f}\n`;
  } else {
    md += "- (ยังไม่ได้กรอก)\n";
  }

  md += "\n### Target Users\n";
  md += `- Target: ${form.targetUser || "(ยังไม่ได้กรอก)"}\n`;
  md += `- Expected Users: ${form.expectedUsers || "(ยังไม่ได้กรอก)"}\n`;

  md += "\n### Competitors\n";
  const competitors = form.competitors.filter((c) => c.trim());
  if (competitors.length > 0) {
    for (const c of competitors) md += `- ${c}\n`;
  } else {
    md += "- (ยังไม่ได้กรอก)\n";
  }

  md += "\n### Project Level\n";
  md += `- Level: ${levelOpt ? levelOpt.label : "(ยังไม่ได้เลือก)"}\n`;
  if (levelOpt) {
    md += `- Description: ${levelOpt.description}\n`;
    md += `- Included Features: ${levelOpt.features.join(", ")}\n`;
  }

  md += "\n### Custom Data\n";
  const customData = form.customData.filter((d) => d.key.trim() && d.value.trim());
  if (customData.length > 0) {
    for (const d of customData) {
      md += `- ${d.key}: ${d.value}${d.icon ? ` (icon: ${d.icon})` : ""}\n`;
    }
  } else {
    md += "- (ไม่มี custom data)\n";
  }

  return md;
}

export function generateSummary(form: RequirementForm): RequirementSummary {
  const markdown = generateMarkdown(form);
  const { projectLevel, ...rest } = form;
  const json = JSON.stringify(
    {
      ...rest,
      projectLevel: projectLevel || "landing",
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  );

  return {
    ...form,
    projectLevel: (projectLevel || "landing") as RequirementSummary["projectLevel"],
    customData: form.customData.filter((d) => d.key.trim() && d.value.trim()),
    generatedAt: new Date().toISOString(),
    markdown,
    json,
  };
}
