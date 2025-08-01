import { Console } from "@/lib/utils";
import { globSync } from "glob";

type DropdownsMap = Map<string, DropdownConfigWithRun>;

const dropdowns: DropdownsMap = new Map();

export const setupDropdownFiles = async () => {
  const dropdownFiles = globSync("src/modules/**/dropdowns/**/*.{js,ts}", {
    cwd: process.cwd(),
    ignore: ["**/*.{test,spec}.{js,ts}"],
  });

  if (!dropdownFiles.length) return dropdowns;

  for (const file of dropdownFiles) {
    const { config, run }: DropdownConfigWithRun = await import(file);

    if (!config || !run)
      throw new Error("Dropdown file must export both config and run");

    if (dropdowns.has(config.customId))
      throw new Error(`Duplicate dropdown customId ${config.customId}`);

    Console.Log(`(/) Loaded dropdown ${config.customId}`);
    dropdowns.set(config.customId, { config, run });
  }

  Console.Log(`(/) Loaded ${dropdowns.size} dropdowns successfully`);
  return dropdowns;
};

export const handleDropdownInteraction = async (i: DropdownInteraction) => {
  const dropdown = dropdowns.get(i.customId);
  if (!dropdown) return;

  try {
    await dropdown.run(i);
  } catch (error) {
    Console.Error(`Error running dropdown ${i.customId}`, error);
  }
};
