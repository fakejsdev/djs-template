import type { ButtonInteraction } from "discord.js";

declare global {
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
