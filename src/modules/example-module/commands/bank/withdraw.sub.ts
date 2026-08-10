import { MessageFlags } from 'discord.js';

export const config: SubcommandConfig = (sub) =>
  sub
    .setDescription('Withdraw cash from your account')
    .addIntegerOption((o) =>
      o.setName('amount').setDescription('Amount to withdraw').setRequired(true),
    );

export const run: CommandRun = async (interaction) => {
  const amount = interaction.options.getInteger('amount', true);
  await interaction.reply({
    content: `💸 Withdrew **${amount}** coins from your bank account!`,
    flags: MessageFlags.Ephemeral,
  });
};
