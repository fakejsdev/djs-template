import type {
  ChatInputCommandInteraction as CommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

declare global {
  type CommandConfig = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  type CommandRun = (i: CommandInteraction<"cached">) => Promise<unknown>;
  type CommandConfigWithRun = {
    config: CommandConfig;
    run: CommandRun;
  };
}
