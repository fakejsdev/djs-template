import path from "node:path";
import { globSync } from "glob";
import { client } from "@/lib/discord";
import { Console } from "@/lib/utils";

type DiscordEventsMap = Map<string, DiscordEventConfigWithRun>;

const setupDiscordEventFiles = async () => {
	const events: DiscordEventsMap = new Map();

	const eventFiles = globSync("src/modules/**/events/discord/**/*.{js,ts}", {
		cwd: process.cwd(),
		ignore: ["**/*.{test,spec}.{js,ts}", "**/_*"],
	});

	if (!eventFiles.length) return events;

	for (const file of eventFiles) {
		const { config, run }: DiscordEventConfigWithRun = await import(
			path.resolve(file)
		);

		if (!config || !run)
			throw new Error("Discord event file must export both config and run");

		const eventKey = `${config.name}${config.once ? "_once" : ""}`;

		if (events.has(eventKey))
			throw new Error(
				`Duplicate discord event ${config.name}${config.once ? " (once)" : ""}`,
			);

		events.set(eventKey, { config, run });
	}

	if (events.size > 0) {
		Console.Log(
			`📡 Loaded ${events.size} Discord event${events.size === 1 ? "" : "s"}`,
		);
	}
	return events;
};

const registerEvents = (events: DiscordEventsMap) => {
	for (const [, { config, run }] of events) {
		if (config.once) {
			client.once(config.name, run);
		} else {
			client.on(config.name, run);
		}
	}
};

export const initEventHandler = async () => {
	const events = await setupDiscordEventFiles();
	if (!events.size) {
		Console.Warn("No events found, skipping event registration.");
		return;
	}

	registerEvents(events);
};
