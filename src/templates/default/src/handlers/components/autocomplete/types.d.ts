import type { AutocompleteInteraction } from "discord.js";

declare global {
  type AutocompleteInteraction = AutocompleteInteraction;

  type AutocompleteConfig = {
    commandName: string;
    optionName?: string;
    name: string;
    description?: string;
  };

  type AutocompleteRun = (
    interaction: AutocompleteInteraction
  ) => Promise<void>;

  type AutocompleteConfigWithRun = {
    config: AutocompleteConfig;
    run: AutocompleteRun;
  };
}
