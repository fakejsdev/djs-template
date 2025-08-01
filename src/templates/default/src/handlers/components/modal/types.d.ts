import type { ModalSubmitInteraction } from "discord.js";

declare global {
  type ModalInteraction = ModalSubmitInteraction<"cached">;

  type ModalConfig = {
    customId: string;
    name: string;
    description?: string;
  };
  type ModalRun = (i: ModalInteraction<"cached">) => Promise<unknown>;

  type ModalConfigWithRun = {
    config: ModalConfig;
    run: ModalRun;
  };
}
