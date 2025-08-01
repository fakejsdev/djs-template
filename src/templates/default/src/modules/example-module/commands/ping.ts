import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SlashCommandBuilder,
  TextDisplayBuilder,
} from "discord.js";

export const config: CommandConfig = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export const run: CommandRun = async (interaction) => {
  const containerBuilder = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("### Pong!"))
    .setAccentColor(0x0099ff)
    .addActionRowComponents(
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("ping_button")
          .setLabel("Click me!")
          .setStyle(ButtonStyle.Primary)
      )
    );

  return await interaction.reply({
    components: [containerBuilder],
    flags: ["IsComponentsV2"],
  });
};
