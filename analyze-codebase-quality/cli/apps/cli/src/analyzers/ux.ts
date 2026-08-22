import type { AnalysisConfig, AnalysisIssue, AnalysisResult } from "@analyze-codebase-quality/shared";
import { createIssue, createResult } from "@analyze-codebase-quality/shared";
import { join } from "node:path";
import { readFileContent, findFilesByExtension } from "../file-utils.js";

export function analyzeUx(config: AnalysisConfig): AnalysisResult {
  const issues: AnalysisIssue[] = [];

  if (!config.hasFrontend) {
    return createResult("ux", [], "Skipped - no frontend detected");
  }

  const files = [
    ...findFilesByExtension(config.projectPath, ".tsx"),
    ...findFilesByExtension(config.projectPath, ".jsx"),
    ...findFilesByExtension(config.projectPath, ".vue"),
    ...findFilesByExtension(config.projectPath, ".html"),
  ];

  for (const file of files) {
    const fullPath = join(config.projectPath, file);
    const content = readFileContent(fullPath);

    checkWcagCompliance(file, content, issues);
    checkAriaUsage(file, content, issues);
    checkKeyboardNavigation(file, content, issues);
    checkInteractionPatterns(file, content, issues);
    checkResponsiveBehavior(file, content, issues);
  }

  return createResult("ux", issues, `Analyzed ${files.length} frontend files`);
}

function checkWcagCompliance(file: string, content: string, issues: AnalysisIssue[]): void {
  const imgWithoutAltRegex = /<img(?![^>]*\salt=)/gi;
  if (imgWithoutAltRegex.test(content)) {
    issues.push(
      createIssue("ux", "high", "Missing alt attribute",
        `${file} has <img> tags without alt attribute`,
        "Add descriptive alt text to all images", file),
    );
  }

  const buttonWithoutAriaRegex = /<button(?![^>]*\saria-label=)(?![^>]*>)[^>]*>\s*<(?:svg|img|icon)/gi;
  if (buttonWithoutAriaRegex.test(content)) {
    issues.push(
      createIssue("ux", "medium", "Icon-only button missing aria-label",
        `${file} has icon-only buttons without aria-label`,
        "Add aria-label for icon-only buttons", file),
    );
  }

  const headingRegex = /<h([1-6])/gi;
  const headings = content.match(headingRegex) || [];
  if (headings.length > 0) {
    const levels = headings.map((h) => Number.parseInt(h.match(/[1-6]/)?.[0] || "0", 10));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        issues.push(
          createIssue("ux", "medium", "Heading hierarchy violation",
            `${file} skips heading levels (${levels[i - 1]} → ${levels[i]})`,
            "Don't skip heading levels - go in order", file),
        );
        break;
      }
    }
  }
}

function checkAriaUsage(file: string, content: string, issues: AnalysisIssue[]): void {
  const ariaHiddenRegex = /aria-hidden\s*=\s*["']true["']/gi;
  const ariaHiddenCount = (content.match(ariaHiddenRegex) || []).length;
  if (ariaHiddenCount > 5) {
    issues.push(
      createIssue("ux", "low", "Excessive aria-hidden",
        `${file} has ${ariaHiddenCount} aria-hidden="true" attributes`,
        "Ensure important content isn't hidden from screen readers", file),
    );
  }

  const roleRegex = /\brole\s*=\s*["']([^"']+)["']/gi;
  const roles = content.match(roleRegex) || [];
  const validRoles = new Set([
    "button", "link", "img", "navigation", "main", "header", "footer",
    "contentinfo", "banner", "complementary", "search", "form", "region",
    "alert", "alertdialog", "dialog", "status", "log", "marquee", "timer",
    "tooltip", "tab", "tablist", "tabpanel", "grid", "row", "cell", "menu",
    "menubar", "menuitem", "checkbox", "radio", "textbox", "slider", "spinbutton",
  ]);
  for (const roleMatch of roles) {
    const role = roleMatch.match(/["']([^"']+)["']/)?.[1];
    if (role && !validRoles.has(role)) {
      issues.push(
        createIssue("ux", "medium", "Invalid ARIA role",
          `${file} uses invalid role "${role}"`,
          "Use valid ARIA roles from the WAI-ARIA specification", file),
      );
    }
  }
}

function checkKeyboardNavigation(file: string, content: string, issues: AnalysisIssue[]): void {
  const onClickRegex = /onClick\s*=/g;
  const onKeyDownRegex = /onKeyDown\s*=/g;
  const onClickCount = (content.match(onClickRegex) || []).length;
  const onKeyDownCount = (content.match(onKeyDownRegex) || []).length;
  if (onClickCount > 3 && onKeyDownCount === 0) {
    issues.push(
      createIssue("ux", "medium", "Missing keyboard handler",
        `${file} has ${onClickCount} onClick but no onKeyDown`,
        "Add keyboard event handlers for accessibility", file),
    );
  }
}

function checkInteractionPatterns(file: string, content: string, issues: AnalysisIssue[]): void {
  const loadingRegex = /(?:loading|isLoading|skeleton|spinner)/gi;
  const fetchRegex = /(?:useQuery|useResource|fetch|axios|createResource)/gi;
  if (fetchRegex.test(content) && !loadingRegex.test(content)) {
    issues.push(
      createIssue("ux", "medium", "Missing loading state",
        `${file} fetches data but has no loading state`,
        "Add loading/skeleton states for async data", file),
    );
  }

  const errorStateRegex = /(?:error|isError|catch)/gi;
  if (fetchRegex.test(content) && !errorStateRegex.test(content)) {
    issues.push(
      createIssue("ux", "medium", "Missing error state",
        `${file} fetches data but has no error state`,
        "Add error states for failed async operations", file),
    );
  }
}

function checkResponsiveBehavior(file: string, content: string, issues: AnalysisIssue[]): void {
  const pxWidthRegex = /(?:width|min-width|max-width)\s*:\s*(\d+)px/gi;
  const matches = content.matchAll(pxWidthRegex);
  for (const match of matches) {
    const px = Number.parseInt(match[1], 10);
    if (px > 0 && px < 44) {
      issues.push(
        createIssue("ux", "medium", "Touch target too small",
          `${file} has touch target ${px}px (min 44px)`,
          "Increase touch target to at least 44x44px", file),
      );
      break;
    }
  }
}
