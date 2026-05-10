import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export const config: ButtonConfig = {
  customId: "example-button",
  name: "Example Button",
  description: "A button that shows an example modal.",
};

export const run: ButtonRun = async (interaction) => {
  const exampleModal = new ModalBuilder()
    .setCustomId("example-modal")
    .setTitle("Example Modal")
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("exampleInput")
          .setLabel("Enter something")
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      ),
    );

  return await interaction.showModal(exampleModal);
};
