import { appendFileSync, mkdirSync, openSync } from "node:fs";
import {
	loadTasks,
	LOG_DIR,
	logPath,
	pendingDeps,
	saveTasks,
	upsertTask,
} from "../data/store";
import type { AgentTask } from "../domain/types";

const isWin = process.platform === "win32";

function alive(pid: number): boolean {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}

/** Spawn a task's command detached; stdout+stderr stream to its log file. */
export function runTask(task: AgentTask): AgentTask {
	// Refuse to run while deps are unfinished — flip to blocked instead.
	if (pendingDeps(loadTasks(), task).length > 0) {
		task.status = "blocked";
		upsertTask(task);
		return task;
	}
	mkdirSync(LOG_DIR, { recursive: true });
	const fd = openSync(logPath(task.id), "a");
	const child = isWin
		? Bun.spawn(["cmd", "/c", task.cmd], {
				stdout: fd,
				stderr: fd,
				stdin: "ignore",
			})
		: Bun.spawn(["sh", "-c", task.cmd], {
				stdout: fd,
				stderr: fd,
				stdin: "ignore",
			});
	task.pid = child.pid;
	task.status = "running";
	task.startedAt = Date.now();
	upsertTask(task);
	appendFileSync(
		fd,
		`\n--- spawned pid=${child.pid} cmd=${task.cmd} ---\n`,
	);
	void child.exited.then((code) => {
		const t = { ...task, exitCode: code, finishedAt: Date.now() };
		t.status = t.status === "killed" ? "killed" : code === 0 ? "done" : "failed";
		upsertTask(t);
	});
	return task;
}

export function killTask(task: AgentTask): boolean {
	if (!task.pid || !alive(task.pid)) return false;
	try {
		if (isWin) {
			Bun.spawnSync(["taskkill", "/PID", String(task.pid), "/T", "/F"]);
		} else {
			process.kill(task.pid, "SIGTERM");
		}
		task.status = "killed";
		task.finishedAt = Date.now();
		upsertTask(task);
		return true;
	} catch {
		return false;
	}
}

/** Reconcile stored statuses with real process liveness + dep state. */
export function reconcile(): AgentTask[] {
	const tasks = loadTasks();
	let dirty = false;
	for (const t of tasks) {
		if (t.status === "running" && t.pid && !alive(t.pid)) {
			// Process exited without our exit handler (e.g. CLI restarted).
			t.status = t.exitCode === 0 ? "done" : "failed";
			t.finishedAt ??= Date.now();
			dirty = true;
		}
		// queued with unfinished deps → blocked; blocked with deps done → queued
		if (t.status === "queued" || t.status === "blocked") {
			const blockedNow = pendingDeps(tasks, t).length > 0;
			const next =
				blockedNow && t.status !== "blocked"
					? "blocked"
					: !blockedNow && t.status === "blocked"
						? "queued"
						: null;
			if (next) {
				t.status = next;
				dirty = true;
			}
		}
	}
	if (dirty) saveTasks(tasks);
	return tasks;
}

/** Start every queued shell task whose deps are done. Returns spawned tasks. */
export function pump(): AgentTask[] {
	const tasks = reconcile();
	const ready = tasks.filter(
		(t) =>
			t.status === "queued" &&
			t.source === "shell" &&
			pendingDeps(tasks, t).length === 0,
	);
	for (const t of ready) runTask(t);
	return ready;
}
