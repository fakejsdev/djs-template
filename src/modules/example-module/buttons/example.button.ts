import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const config: ButtonConfig = {
  customId: 'example-button',
  name: 'Example Button',
  description: 'A button that shows an example modal.',
};

export const run: ButtonRun = async (interaction) => {
  const exampleModal = new ModalBuilder()
    .setCustomId('example-modal')
    .setTitle('Example Modal')
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId('exampleInput')
          .setLabel('Enter something')
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      ),
    );

  await interaction.showModal(exampleModal);

  const modalSubmitInteraction = await interaction.awaitModalSubmit({
    filter: (modalInteraction) =>
      modalInteraction.customId === 'example-modal' &&
      modalInteraction.user.id === interaction.user.id,
    time: 60_000,
  });

  return await modalSubmitInteraction.reply({
    content: `You entered: ${modalSubmitInteraction.fields.getTextInputValue('exampleInput')}`,
    flags: ['Ephemeral'],
  });
};
