import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { AgentTask } from "../domain/types";

const DIR = join(homedir(), ".config", "devin", "subagents");
const DB = join(DIR, "tasks.json");
export const LOG_DIR = join(DIR, "logs");

export function logPath(id: string): string {
	return join(LOG_DIR, `${id}.log`);
}

export function loadTasks(): AgentTask[] {
	mkdirSync(LOG_DIR, { recursive: true });
	try {
		const raw = JSON.parse(readFileSync(DB, "utf8")) as AgentTask[];
		// Backfill fields added later — old records stay loadable.
		return raw.map((t) => ({
			source: "shell" as const,
			priority: "med" as const,
			...t,
		}));
	} catch {
		return [];
	}
}

/** Drop finished tasks (done/failed/killed); keep running+queued. */
export function prune(): number {
	const tasks = loadTasks();
	const keep = tasks.filter(
		(t) => t.status === "running" || t.status === "queued",
	);
	saveTasks(keep);
	return tasks.length - keep.length;
}

export function saveTasks(tasks: AgentTask[]): void {
	mkdirSync(LOG_DIR, { recursive: true });
	writeFileSync(DB, JSON.stringify(tasks, null, 2));
}

export function upsertTask(task: AgentTask): void {
	const tasks = loadTasks();
	const i = tasks.findIndex((t) => t.id === task.id);
	if (i >= 0) tasks[i] = task;
	else tasks.push(task);
	saveTasks(tasks);
}

export function getTask(id: string): AgentTask | undefined {
	return loadTasks().find(
		(t) => t.id === id || t.id.startsWith(id) || t.name === id,
	);
}

export function removeTask(id: string): boolean {
	const t = getTask(id);
	if (!t) return false;
	saveTasks(loadTasks().filter((x) => x.id !== t.id));
	return true;
}

export function newId(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function childrenOf(tasks: AgentTask[], id: string): AgentTask[] {
	const t = getTask(id);
	if (!t) return [];
	return tasks.filter((x) => x.parent === t.id);
}

/** Dep ids that are not done yet (prefix match resolved). [] = ready. */
export function pendingDeps(tasks: AgentTask[], t: AgentTask): string[] {
	return (t.deps ?? []).filter((d) => {
		const dep = tasks.find((x) => x.id === d || x.id.startsWith(d));
		return !dep || dep.status !== "done";
	});
}

/** Rollup like "2/3" for parent rows, "" if no children. */
export function rollup(tasks: AgentTask[], t: AgentTask): string {
	const kids = tasks.filter((x) => x.parent === t.id);
	if (kids.length === 0) return "";
	const done = kids.filter(
		(k) => k.status === "done" || k.status === "killed",
	).length;
	return `${done}/${kids.length}`;
}
