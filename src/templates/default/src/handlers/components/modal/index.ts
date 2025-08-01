import { Console } from "@/lib/utils";
import { globSync } from "glob";

type ModalsMap = Map<string, ModalConfigWithRun>;

const modals: ModalsMap = new Map();

export const setupModalFiles = async () => {
  const modalFiles = globSync("src/modules/**/modals/**/*.{js,ts}", {
    cwd: process.cwd(),
    ignore: ["**/*.{test,spec}.{js,ts}", "**/_*"],
  });

  if (!modalFiles.length) return modals;

  for (const file of modalFiles) {
    const { config, run }: ModalConfigWithRun = await import(file);

    if (!config || !run)
      throw new Error("Modal file must export both config and run");

    if (modals.has(config.customId))
      throw new Error(`Duplicate modal customId ${config.customId}`);

    Console.Log(`(/) Loaded modal ${config.customId}`);
    modals.set(config.customId, { config, run });
  }

  Console.Log(`(/) Loaded ${modals.size} modals successfully`);
  return modals;
};

export const handleModalInteraction = async (i: ModalInteraction) => {
  const modal = modals.get(i.customId);
  if (!modal) return;

  try {
    await modal.run(i);
  } catch (error) {
    Console.Error(`Error running modal ${i.customId}`, error);
  }
};
