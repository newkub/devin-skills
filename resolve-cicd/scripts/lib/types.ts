export const SLEEP_MS = 10_000;
export const CI_WATCH_TIMEOUT_MS = 900_000;
export const CD_WATCH_TIMEOUT_MS = 600_000;
export const MAX_RETRIES = 5;
export const MAX_SAME_FAILURE = 3;

export interface Run {
	databaseId: number;
	headBranch: string;
	displayTitle: string;
	status: string;
	conclusion: string | null;
	event: string;
	url: string;
	createdAt: string;
	updatedAt: string;
}

export interface RunView {
	headBranch: string;
	displayTitle: string;
	conclusion: string | null;
	status: string;
	createdAt: string;
	updatedAt: string;
	jobs: {
		name: string;
		conclusion: string | null;
		status: string;
	}[];
}

export interface Args {
	runId?: number;
	url?: string;
	maxRetries: number;
	noRetry: boolean;
}
