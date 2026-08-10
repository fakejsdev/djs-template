import { MessageFlags } from 'discord.js';

export const config: SubcommandConfig = (sub) =>
  sub
    .setDescription('Deposit cash into your account')
    .addIntegerOption((o) =>
      o.setName('amount').setDescription('Amount to deposit').setRequired(true),
    );

export const run: CommandRun = async (interaction) => {
  const amount = interaction.options.getInteger('amount', true);
  await interaction.reply({
    content: `🏦 Deposited **${amount}** coins into your bank account!`,
    flags: MessageFlags.Ephemeral,
  });
};
