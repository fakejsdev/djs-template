import path from 'node:path';
import { type Job, Worker } from 'bullmq';
import { globSync } from 'glob';
import { redisConnection } from '@/lib/queue';
import { Console } from '@/lib/utils';

const workerHandlers = new Map<string, WorkerRun>();

const setupWorkerFiles = async () => {
  const files = globSync('src/modules/*/workers/*.worker.{js,ts}', {
    cwd: process.cwd(),
    ignore: ['**/*.{test,spec}.{js,ts}', '**/_*'],
  });

  if (!files.length) return;

  for (const file of files) {
    const imported = await import(path.resolve(file));
    const config: WorkerConfig = imported.config;
    const run: WorkerRun = imported.run;

    if (!config || !run) {
      throw new Error(`Worker file ${file} must export 'config' and 'run'.`);
    }

    if (workerHandlers.has(config.name)) {
      throw new Error(`Duplicate worker job name: ${config.name}`);
    }

    workerHandlers.set(config.name, run);
  }

  Console.Log(`🛠️  Loaded ${workerHandlers.size} worker job(s)`);
};

export const initWorkerHandler = async () => {
  await setupWorkerFiles();

  if (!workerHandlers.size) {
    Console.Warn('No worker jobs found, skipping BullMQ Worker initialization.');
    return;
  }

  const mainWorker = new Worker(
    'BOT_SCHEDULER',
    async (job: Job) => {
      const handler = workerHandlers.get(job.name);

      if (!handler) {
        throw new Error(`Logic code not found for job name: ${job.name}`);
      }

      await handler(job);
    },
    {
      connection: redisConnection,
      concurrency: 5,
    },
  );

  mainWorker.on('completed', (job) => {
    Console.Log(`(✓) Background job completed: [${job.name}] (ID: ${job.id})`);
  });

  mainWorker.on('failed', (job, err) => {
    Console.Error(`(X) Background job failed: [${job?.name}] (ID: ${job?.id})`, err);
  });

  Console.Log(`🏭 Main BullMQ Worker started and routing jobs for 'BOT:SCHEDULER'`);
};
