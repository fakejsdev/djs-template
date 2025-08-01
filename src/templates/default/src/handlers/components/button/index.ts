import { Console } from "@/lib/utils";
import { globSync } from "glob";

type ButtonsMap = Map<string, ButtonConfigWithRun>;

const buttons: ButtonsMap = new Map();

export const setupButtonFiles = async () => {
  const buttonFiles = globSync("src/modules/**/buttons/**/*.{js,ts}", {
    cwd: process.cwd(),
    ignore: ["**/*.{test,spec}.{js,ts}"],
  });

  if (!buttonFiles.length) return buttons;

  for (const file of buttonFiles) {
    const { config, run }: ButtonConfigWithRun = await import(file);

    if (!config || !run)
      throw new Error("Button file must export both config and run");

    if (buttons.has(config.customId))
      throw new Error(`Duplicate button customId ${config.customId}`);

    Console.Log(`(/) Loaded button ${config.customId}`);
    buttons.set(config.customId, { config, run });
  }

  Console.Log(`(/) Loaded ${buttons.size} buttons successfully`);
  return buttons;
};

export const handleButtonInteraction = async (i: ButtonInteraction) => {
  const button = buttons.get(i.customId);
  if (!button) return;

  try {
    await button.run(i);
  } catch (error) {
    Console.Error(`Error running button ${i.customId}`, error);
  }
};
