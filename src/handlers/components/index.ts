import path from "node:path";
import type { Interaction } from "discord.js";
import { globSync } from "glob";
import { client } from "@/lib/discord";
import { Console } from "@/lib/utils";

type ComponentHandler = {
	setup: () => Promise<Map<string, unknown>>;
	handle: (interaction: Interaction) => Promise<void>;
	isType: (interaction: Interaction) => boolean;
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
			} else {
				Console.Warn(
					`Skipping ${componentType} - missing setup or handle function`,
				);
			}
		} catch (error) {
			Console.Error(`Error loading component handler from ${file}:`, error);
		}
	}
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const createInteractionChecker = (type: string) => {
	const checkers: Record<string, (interaction: Interaction) => boolean> = {
		button: (i) => i.isButton(),
		modal: (i) => i.isModalSubmit(),
		dropdown: (i) => i.isStringSelectMenu(),
	};

	return checkers[type] || (() => false);
};

const setupComponentHandlers = async () => {
	await discoverComponentHandlers();

	let totalComponents = 0;

	for (const handler of componentHandlers) {
		const components = await handler.setup();
		totalComponents += components.size;
	}

	if (totalComponents > 0) {
		Console.Log(
			`🧩 Loaded ${totalComponents} component${
				totalComponents === 1 ? "" : "s"
			}`,
		);
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
