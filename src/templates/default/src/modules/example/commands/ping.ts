import { SlashCommandBuilder } from "discord.js";

export const config: CommandConfig = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export const run: CommandRun = async (interaction) => {
  return await interaction.reply("Pong!");
};
