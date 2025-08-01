import { Console } from "@/lib/utils";
import { client } from "@/lib/client";
import { globSync } from "glob";
import path from "path";

type ComponentHandler = {
  setup: () => Promise<Map<string, unknown>>;
  handle: (interaction: unknown) => Promise<void>;
  isType: (interaction: unknown) => boolean;
  name: string;
};

const componentHandlers: ComponentHandler[] = [];

const discoverComponentHandlers = async () => {
  const handlerFiles = globSync("src/handlers/components/*/index.{js,ts}", {
    cwd: process.cwd(),
    ignore: ["**/components/index.{js,ts}"],
  });

  for (const file of handlerFiles) {
    try {
      const module = await import(path.resolve(file));
      const componentType = path.basename(path.dirname(file));

      const setupFunction = module[`setup${capitalize(componentType)}Files`];
      const handleFunction =
        module[`handle${capitalize(componentType)}Interaction`];

      if (setupFunction && handleFunction) {
        const isType = createInteractionChecker(componentType);

        componentHandlers.push({
          setup: setupFunction,
          handle: handleFunction,
          isType,
          name: componentType,
        });

        Console.Log(`(+) Initialized ${componentType} handler`);
      } else {
        Console.Warn(
          `Skipping ${componentType} - missing setup or handle function`
        );
      }
    } catch (error) {
      Console.Error(`Error loading component handler from ${file}:`, error);
    }
  }
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const createInteractionChecker = (type: string) => {
  const checkers: Record<string, (interaction: any) => boolean> = {
    button: (i) => i.isButton(),
    modal: (i) => i.isModalSubmit(),
    selectmenu: (i) => i.isStringSelectMenu(),
    autocomplete: (i) => i.isAutocomplete(),
  };

  return checkers[type] || (() => false);
};

const setupComponentHandlers = async () => {
  await discoverComponentHandlers();

  for (const handler of componentHandlers) {
    const components = await handler.setup();
    if (!components.size) {
      Console.Warn(`(!) No ${handler.name}s were found`);
    }
  }
};

const startComponentsHandling = async () => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    for (const handler of componentHandlers) {
      if (handler.isType(interaction)) {
        return await handler.handle(interaction);
      }
    }
  });
};

export const initComponentsHandler = async () => {
  await setupComponentHandlers();
  await startComponentsHandling();
};
