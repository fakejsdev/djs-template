import { Console } from "@/lib/utils";
import { globSync } from "glob";

type AutocompletesMap = Map<string, AutocompleteConfigWithRun>;

const autocompletes: AutocompletesMap = new Map();

export const setupAutocompleteFiles = async () => {
  const autocompleteFiles = globSync(
    "src/modules/**/autocompletes/**/*.{js,ts}",
    {
      cwd: process.cwd(),
      ignore: ["**/*.{test,spec}.{js,ts}"],
    }
  );

  if (!autocompleteFiles.length) return autocompletes;

  for (const file of autocompleteFiles) {
    const { config, run }: AutocompleteConfigWithRun = await import(file);

    if (!config || !run)
      throw new Error("Autocomplete file must export both config and run");

    const key = config.optionName
      ? `${config.commandName}:${config.optionName}`
      : config.commandName;

    if (autocompletes.has(key))
      throw new Error(`Duplicate autocomplete for ${key}`);

    Console.Log(`(/) Loaded autocomplete ${key}`);
    autocompletes.set(key, { config, run });
  }

  Console.Log(`(/) Loaded ${autocompletes.size} autocompletes successfully`);
  return autocompletes;
};

export const handleAutocompleteInteraction = async (
  i: AutocompleteInteraction
) => {
  const focusedOption = i.options.getFocused(true);
  const key = `${i.commandName}:${focusedOption.name}`;

  // Try specific option first, then fallback to command-wide
  const autocomplete =
    autocompletes.get(key) || autocompletes.get(i.commandName);
  if (!autocomplete) return;

  try {
    await autocomplete.run(i);
  } catch (error) {
    Console.Error(`Error running autocomplete ${key}`, error);
  }
};
