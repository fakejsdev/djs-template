import type { ButtonInteraction as DiscordButtonInteraction } from "discord.js";

declare global {
  type ButtonInteraction = DiscordButtonInteraction<"cached">;

  type ButtonConfig = {
    customId: string;
    name: string;
    description?: string;
  };
  type ButtonRun = (i: ButtonInteraction<"cached">) => Promise<unknown>;

  type ButtonConfigWithRun = {
    config: ButtonConfig;
    run: ButtonRun;
  };
}
