import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

declare global {
  type CommandRun = (i: ChatInputCommandInteraction<'cached'>) => Promise<unknown> | unknown;

  type CommandConfig =
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;

  type SubcommandConfig = (
    subcommand: SlashCommandSubcommandBuilder,
  ) => SlashCommandSubcommandBuilder;
}
