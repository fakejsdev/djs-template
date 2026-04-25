import type { CacheType, StringSelectMenuInteraction } from "discord.js";

declare global {
  type DropdownInteraction<T extends CacheType = CacheType> =
    StringSelectMenuInteraction<T>;

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
