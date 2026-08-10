import type { Job } from 'bullmq';
import type { GuildTextBasedChannel } from 'discord.js';
import { client } from '@/lib/discord';
import { Console } from '@/lib/utils';

export const config: WorkerConfig = {
  name: 'send-reminder',
};

export const run: WorkerRun = async (job: Job) => {
  const { channelId, userId, content } = job.data;

  try {
    const channel = (await client.channels.fetch(channelId)) as GuildTextBasedChannel;

    if (channel?.isTextBased()) {
      await channel.send(`\`🔔\` <@${userId}>, here is your reminder: **${content}**`);
    }
  } catch (error) {
    Console.Error(`Failed to process job ${job.id}`, error);
  }
};
