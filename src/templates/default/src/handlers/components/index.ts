import { handleButtonInteraction, setupButtonFiles } from "./button";

import { Console } from "@/lib/utils";
import { client } from "@/lib/client";

const setupComponentHandlers = async () => {
  const buttons = await setupButtonFiles();
  if (!buttons) Console.Warn("No buttons were found");
};

const startComponentsHandling = async () => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    if (interaction.isButton()) {
      return await handleButtonInteraction(interaction);
    }
  });
};

export const initComponentsHandler = async () => {
  await setupComponentHandlers();
  await startComponentsHandling();
};
