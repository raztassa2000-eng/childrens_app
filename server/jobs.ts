import { randomUUID } from "node:crypto";
import { FriendlyError } from "./ai";

export type JobStatus = "queued" | "writing" | "checking" | "done" | "failed";

export interface Job {
  id: string;
  kind: "series" | "episode";
  status: JobStatus;
  progress: number;
  message: string;
  seriesId?: string;
  episode?: number;
  error?: string;
  createdAt: number;
}

export type JobUpdate = (patch: Partial<Pick<Job, "status" | "progress" | "message">>) => void;
export type JobRunner = (update: JobUpdate) => Promise<{ seriesId: string; episode: number }>;

/** In-memory generation jobs. The app polls them while the AI writes. */
export class JobQueue {
  private readonly jobs = new Map<string, Job>();
  private readonly waiting: Array<() => void> = [];
  private running = 0;

  constructor(private readonly maxConcurrent = 2) {}

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  start(kind: Job["kind"], run: JobRunner, seriesId?: string): Job {
    this.prune();
    const job: Job = { id: randomUUID(), kind, status: "queued", progress: 0, message: "Getting ready…", seriesId, createdAt: Date.now() };
    this.jobs.set(job.id, job);
    void this.execute(job, run);
    return job;
  }

  private async execute(job: Job, run: JobRunner) {
    if (this.running >= this.maxConcurrent) await new Promise<void>((resolve) => this.waiting.push(resolve));
    this.running++;
    const update: JobUpdate = (patch) => Object.assign(job, patch);
    try {
      const result = await run(update);
      Object.assign(job, { status: "done", progress: 1, message: "Ready!", ...result });
    } catch (error) {
      const friendly = error instanceof FriendlyError;
      if (!friendly) console.error(`Job ${job.id} failed:`, error);
      Object.assign(job, {
        status: "failed",
        error: friendly ? error.message : "The magic fizzled this time. Please try again in a moment.",
      });
    } finally {
      this.running--;
      this.waiting.shift()?.();
    }
  }

  /** Forget finished jobs after an hour. */
  private prune() {
    const cutoff = Date.now() - 60 * 60 * 1000;
    for (const [id, job] of this.jobs) {
      if (job.createdAt < cutoff && (job.status === "done" || job.status === "failed")) this.jobs.delete(id);
    }
  }
}
