import type { StringSelectMenuInteraction } from "discord.js";

declare global {
  type DropdownInteraction = StringSelectMenuInteraction<"cached">;

  type DropdownConfig = {
    customId: string;
    name: string;
    description?: string;
  };

  type DropdownRun = (i: DropdownInteraction<"cached">) => Promise<unknown>;

  type DropdownConfigWithRun = {
    config: DropdownConfig;
    run: DropdownRun;
  };
}
