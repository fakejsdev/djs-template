import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { queue } from '@/lib/queue';

export const config: CommandConfig = new SlashCommandBuilder()
  .setName('remind')
  .setDescription('Schedule a reminder message')
  .addIntegerOption((o) =>
    o.setName('seconds').setDescription('Delay in seconds').setRequired(true),
  )
  .addStringOption((o) =>
    o.setName('message').setDescription('Message to remind you about').setRequired(true),
  );

export const run: CommandRun = async (interaction) => {
  const seconds = interaction.options.getInteger('seconds', true);
  const message = interaction.options.getString('message', true);

  await queue.add(
    'send-reminder',
    {
      channelId: interaction.channelId,
      userId: interaction.user.id,
      content: message,
    },
    {
      delay: seconds * 1000,
    },
  );

  return await interaction.reply({
    content: `\`👌\` Reminder scheduled! I will ping you in ${seconds} seconds.`,
    flags: MessageFlags.Ephemeral,
  });
};
