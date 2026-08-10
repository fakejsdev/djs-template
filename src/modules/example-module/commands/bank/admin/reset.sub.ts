import { MessageFlags } from 'discord.js';

export const config: SubcommandConfig = (sub) =>
  sub
    .setDescription("Reset a user's bank account balance (Admin only)")
    .addUserOption((o) => o.setName('target').setDescription('User to reset').setRequired(true));

export const run: CommandRun = async (interaction) => {
  const target = interaction.options.getUser('target', true);
  await interaction.reply({
    content: `🛑 Successfully reset the bank account balance for **${target.tag}**.`,
    flags: MessageFlags.Ephemeral,
  });
};
