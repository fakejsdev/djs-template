import { SlashCommandBuilder } from 'discord.js';

export const config: CommandConfig = new SlashCommandBuilder()
  .setName('bank')
  .setDescription('Central banking system');
