import type { EngineRun } from "./engines.ts";

export function skipped(name: EngineRun["status"]["name"], note: string): EngineRun {
  return { findings: [], status: { name, status: "skipped", note, findings: 0 } };
}

export function missing(name: EngineRun["status"]["name"], note: string): EngineRun {
  return { findings: [], status: { name, status: "missing", note, findings: 0 } };
}
