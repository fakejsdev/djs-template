import { ActionRowBuilder, ModalBuilder, TextInputStyle } from "discord.js";

import { TextInputBuilder } from "@discordjs/builders";

export const config: ButtonConfig = {
  customId: "ping-button",
  name: "Ping Button",
  description: "A button that responds with Pong!",
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
          .setRequired(true)
      )
    );

  return await interaction.showModal(exampleModal);
};
