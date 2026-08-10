import type { Job } from 'bullmq';

declare global {
  type WorkerConfig = {
    name: string;
  };

  type WorkerRun = (job: Job) => Promise<unknown> | unknown;
}
