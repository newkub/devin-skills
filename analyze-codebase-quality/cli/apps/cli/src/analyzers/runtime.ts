import type { AnalysisConfig, AnalysisIssue, AnalysisResult } from "@analyze-codebase-quality/shared";
import { createIssue, createResult } from "@analyze-codebase-quality/shared";
import { join } from "node:path";
import { walkFiles, readFileContent } from "../file-utils.js";

export function analyzeRuntime(config: AnalysisConfig): AnalysisResult {
  const issues: AnalysisIssue[] = [];
  const files = walkFiles(config.projectPath);

  for (const file of files) {
    const fullPath = join(config.projectPath, file);
    const content = readFileContent(fullPath);

    checkErrorHandling(file, content, issues);
    checkAsyncPatterns(file, content, issues);
    checkBoundaryValidation(file, content, issues);
    checkConcurrency(file, content, issues);
    checkResourceManagement(file, content, issues);
    checkLogging(file, content, issues);
    checkPerformance(file, content, issues);
    checkSecurity(file, content, issues);
  }

  return createResult("runtime", issues, `Analyzed ${files.length} files for runtime patterns`);
}

function checkErrorHandling(file: string, content: string, issues: AnalysisIssue[]): void {
  const tryCatchRegex = /try\s*\{/g;
  const catchRegex = /catch\s*\(/g;
  const tryCount = (content.match(tryCatchRegex) || []).length;
  const catchCount = (content.match(catchRegex) || []).length;
  if (tryCount > 0 && catchCount < tryCount) {
    issues.push(
      createIssue("runtime", "high", "Missing catch block",
        `${file} has ${tryCount} try blocks but only ${catchCount} catch blocks`,
        "Ensure all try blocks have corresponding catch/finally", file),
    );
  }

  const throwRegex = /\bthrow\s+/g;
  const throwCount = (content.match(throwRegex) || []).length;
  const errorTypeRegex = /\bthrow\s+new\s+\w*Error/g;
  const typedThrows = (content.match(errorTypeRegex) || []).length;
  if (throwCount > 0 && typedThrows < throwCount) {
    issues.push(
      createIssue("runtime", "medium", "Untyped error throwing",
        `${file} throws ${throwCount} times but only ${typedThrows} are typed errors`,
        "Always throw typed Error instances", file),
    );
  }
}

function checkAsyncPatterns(file: string, content: string, issues: AnalysisIssue[]): void {
  const awaitRegex = /\bawait\s+/g;
  const promiseAllRegex = /\bPromise\.all\s*\(/g;
  const awaitCount = (content.match(awaitRegex) || []).length;
  const promiseAllCount = (content.match(promiseAllRegex) || []).length;
  if (awaitCount > 5 && promiseAllCount === 0) {
    issues.push(
      createIssue("runtime", "medium", "Sequential awaits detected",
        `${file} has ${awaitCount} awaits but no Promise.all`,
        "Use Promise.all for independent async operations", file),
    );
  }

  const unhandledRegex = /\.then\s*\(/g;
  const unhandledCount = (content.match(unhandledRegex) || []).length;
  if (unhandledCount > 3) {
    issues.push(
      createIssue("runtime", "medium", "Promise chains without catch",
        `${file} has ${unhandledCount} .then() calls`,
        "Use async/await with try-catch or add .catch()", file),
    );
  }
}

function checkBoundaryValidation(file: string, content: string, issues: AnalysisIssue[]): void {
  const parseIntRegex = /parseInt\s*\([^)]+\)/g;
  const numberRegex = /Number\s*\([^)]+\)/g;
  const nanCheckRegex = /isNaN\s*\(/g;
  const parseIntCount = (content.match(parseIntRegex) || []).length;
  const numberCount = (content.match(numberRegex) || []).length;
  const nanCheckCount = (content.match(nanCheckRegex) || []).length;
  if (parseIntCount + numberCount > 2 && nanCheckCount === 0) {
    issues.push(
      createIssue("runtime", "medium", "Missing NaN check",
        `${file} uses parseInt/Number without NaN validation`,
        "Always check for NaN after parseInt/Number conversion", file),
    );
  }
}

function checkConcurrency(file: string, content: string, issues: AnalysisIssue[]): void {
  const setIntervalRegex = /setInterval\s*\(/g;
  const clearIntervalRegex = /clearInterval\s*\(/g;
  const setIntervalCount = (content.match(setIntervalRegex) || []).length;
  const clearIntervalCount = (content.match(clearIntervalRegex) || []).length;
  if (setIntervalCount > clearIntervalCount) {
    issues.push(
      createIssue("runtime", "high", "Uncleared intervals",
        `${file} has ${setIntervalCount} setInterval but only ${clearIntervalCount} clearInterval`,
        "Always clear intervals to prevent memory leaks", file),
    );
  }
}

function checkResourceManagement(file: string, content: string, issues: AnalysisIssue[]): void {
  const addEventListenerRegex = /addEventListener\s*\(/g;
  const removeEventListenerRegex = /removeEventListener\s*\(/g;
  const addCount = (content.match(addEventListenerRegex) || []).length;
  const removeCount = (content.match(removeEventListenerRegex) || []).length;
  if (addCount > removeCount && addCount > 0) {
    issues.push(
      createIssue("runtime", "high", "Unremoved event listeners",
        `${file} has ${addCount} addEventListener but only ${removeCount} removeEventListener`,
        "Remove event listeners in cleanup/unmount", file),
    );
  }
}

function checkLogging(file: string, content: string, issues: AnalysisIssue[]): void {
  const consoleRegex = /console\.(log|error|warn|info|debug)\s*\(/g;
  const consoleCount = (content.match(consoleRegex) || []).length;
  if (consoleCount > 5) {
    issues.push(
      createIssue("runtime", "low", "Excessive console usage",
        `${file} has ${consoleCount} console statements`,
        "Use structured logger with log levels", file),
    );
  }
}

function checkPerformance(file: string, content: string, issues: AnalysisIssue[]): void {
  const jsonParseRegex = /JSON\.parse\s*\(/g;
  const jsonParseCount = (content.match(jsonParseRegex) || []).length;
  if (jsonParseCount > 3) {
    issues.push(
      createIssue("runtime", "low", "Frequent JSON.parse",
        `${file} has ${jsonParseCount} JSON.parse calls`,
        "Cache parsed results or use streaming parser for large data", file),
    );
  }
}

function checkSecurity(file: string, content: string, issues: AnalysisIssue[]): void {
  const innerHTMLRegex = /innerHTML\s*=/g;
  if (innerHTMLRegex.test(content)) {
    issues.push(
      createIssue("runtime", "critical", "XSS vulnerability",
        `${file} uses innerHTML assignment`,
        "Use textContent or sanitize HTML input", file),
    );
  }

  const evalRegex = /\beval\s*\(/g;
  if (evalRegex.test(content)) {
    issues.push(
      createIssue("runtime", "critical", "eval() usage",
        `${file} uses eval() which is a security risk`,
        "Remove eval() and use safe alternatives", file),
    );
  }

  const secretRegex = /(?:password|secret|api[_-]?key|token)\s*[:=]\s*["'`][^"'`]+["'`]/gi;
  if (secretRegex.test(content)) {
    issues.push(
      createIssue("runtime", "critical", "Hardcoded secret",
        `${file} may contain hardcoded secrets`,
        "Move secrets to environment variables", file),
    );
  }
}
