import path from "node:path";
import { globSync } from "glob";
import { dbEmitter } from "@/lib/helpers/databaseEmitter";
import { Console } from "@/lib/utils";

type DatabaseEventsMap = Map<string, DatabaseEventConfigWithRun>;

const setupDatabaseEventFiles = async () => {
	const events: DatabaseEventsMap = new Map();

	const eventFiles = globSync("src/modules/**/events/db/**/*.{js,ts}", {
		cwd: process.cwd(),
		ignore: ["**/*.{test,spec}.{js,ts}", "**/_*"],
	});

	if (!eventFiles.length) return events;

	for (const file of eventFiles) {
		const importedFile = await import(path.resolve(file));
		const { config, run }: DatabaseEventConfigWithRun =
			importedFile.default || importedFile;

		if (!config || !run)
			throw new Error("Database event file must export both config and run");

		const eventKey = config.name;

		if (events.has(eventKey))
			throw new Error(`Duplicate database event ${config.name}`);

		events.set(eventKey, { config, run });
	}

	if (events.size > 0) {
		Console.Log(
			`💾 Loaded ${events.size} Database event${events.size === 1 ? "" : "s"}`,
		);
	}
	return events;
};

const registerEvents = (events: DatabaseEventsMap) => {
	for (const [, { config, run }] of events) {
		dbEmitter.on(config.on, run);
	}
};

export const initDatabaseEventHandler = async () => {
	const events = await setupDatabaseEventFiles();
	if (!events.size) {
		Console.Warn("No database events found, skipping event registration.");
		return;
	}

	registerEvents(events);
};
