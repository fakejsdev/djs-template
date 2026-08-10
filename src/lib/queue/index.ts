import { Queue } from 'bullmq';

export const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const queue = new Queue('BOT_SCHEDULER', {
  connection: redisConnection,
});
