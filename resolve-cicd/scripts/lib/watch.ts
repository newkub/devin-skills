import { getRunDetails, rerunRun, waitForRun } from "./gh.ts";
import {
	extractRootCause,
	formatDuration,
	isUnrecoverable,
	printReport,
} from "./report.ts";
import { CI_WATCH_TIMEOUT_MS, MAX_SAME_FAILURE } from "./types.ts";

export function parseActionsRunUrl(
	url: string,
): { runId: number; repo?: string } | null {
	// https://github.com/<owner>/<repo>/actions/runs/<id>[/job/<job-id>][?...]
	const web = url.match(
		/github\.com\/([^/\s]+\/[^/\s]+)\/actions\/runs\/(\d+)/,
	);
	if (web) return { runId: Number.parseInt(web[2], 10), repo: web[1] };
	// https://api.github.com/repos/<owner>/<repo>/actions/runs/<id>
	const api = url.match(
		/api\.github\.com\/repos\/([^/\s]+\/[^/\s]+)\/actions\/runs\/(\d+)/,
	);
	if (api) return { runId: Number.parseInt(api[2], 10), repo: api[1] };
	return null;
}

export async function watchCi(
	runId: number,
	maxRetries: number,
	noRetry: boolean,
	repo?: string,
) {
	let currentRunId = runId;
	let attempts = 0;
	const seenFailures: string[] = [];

	while (attempts <= maxRetries) {
		attempts += 1;
		const view = await waitForRun(currentRunId, CI_WATCH_TIMEOUT_MS, repo);
		const conclusion = view.conclusion ?? "unknown";
		const duration = formatDuration(view.createdAt, view.updatedAt);

		if (conclusion === "success") {
			printReport(
				"CI",
				"GitHub Actions",
				view.displayTitle,
				"success",
				duration,
				"-",
				"-",
			);
			process.exit(0);
		}

		const details = getRunDetails(currentRunId, repo);
		const rootCause = extractRootCause(details, conclusion);

		if (isUnrecoverable(details)) {
			printReport(
				"CI",
				"GitHub Actions",
				view.displayTitle,
				"failure",
				duration,
				rootCause,
				"Check GitHub Billing & plans; re-run not possible without resolving billing",
			);
			process.exit(1);
		}

		if (noRetry || attempts > maxRetries) {
			printReport(
				"CI",
				"GitHub Actions",
				view.displayTitle,
				"failure",
				duration,
				rootCause,
				"Review logs and /resolve-errors",
			);
			process.exit(1);
		}

		seenFailures.push(rootCause);
		const sameFailureCount = seenFailures.filter((f) => f === rootCause).length;
		if (sameFailureCount >= MAX_SAME_FAILURE) {
			printReport(
				"CI",
				"GitHub Actions",
				view.displayTitle,
				"failure",
				duration,
				rootCause,
				`Same failure repeated ${MAX_SAME_FAILURE} times; recommend rollback or /resolve-errors`,
			);
			process.exit(1);
		}

		process.stdout.write(
			`Run ${currentRunId} failed (${conclusion}). Retrying... (${attempts}/${maxRetries})\n`,
		);
		currentRunId = await rerunRun(currentRunId, repo);
	}

	process.stderr.write("Max retries reached.\n");
	process.exit(1);
}

export async function watchUrl(
	url: string,
	maxRetries: number,
	noRetry: boolean,
) {
	const parsed = parseActionsRunUrl(url);
	if (!parsed) {
		process.stdout.write(`URL ${url} is not a GitHub Actions run URL.\n`);
		process.stdout.write(
			"Use /watch-deploy or /watch-release for the target platform.\n",
		);
		process.exit(1);
	}
	await watchCi(parsed.runId, maxRetries, noRetry, parsed.repo);
}
