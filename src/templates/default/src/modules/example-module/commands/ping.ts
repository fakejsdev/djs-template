import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
} from "discord.js";

export const config: CommandConfig = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Custom message to include with ping")
      .setRequired(false)
      .setAutocomplete(true)
  );

export const run: CommandRun = async (interaction) => {
  const customMessage = interaction.options.getString("message");
  const messageContent = customMessage
    ? `## Custom Ping!\n> ${customMessage}\n> Click the button below to check the custom modal.`
    : "## Ping-Pong!\n> Click the button below to check\n> the custom modal.";

  const containerBuilder = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(messageContent)
    )
    .setAccentColor(0x0099ff)
    .addActionRowComponents(
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("ping-button")
          .setLabel("Click me!")
          .setStyle(ButtonStyle.Primary)
      )
    )
    .addActionRowComponents(
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("example-dropdown")
          .setPlaceholder("Select an option")
          .addOptions([
            {
              label: "Option 1",
              value: "option1",
            },
            {
              label: "Option 2",
              value: "option2",
            },
            {
              label: "Option 3",
              value: "option3",
            },
          ])
      )
    );

  return await interaction.reply({
    components: [containerBuilder],
    flags: ["IsComponentsV2"],
  });
};
