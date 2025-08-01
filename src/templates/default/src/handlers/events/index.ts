import { Console } from "@/lib/utils";
import { client } from "@/lib/client";
import { globSync } from "glob";

type EventsMap = Map<string, EventConfigWithRun>;

const setupEventFiles = async () => {
  const events: EventsMap = new Map();

  const eventFiles = globSync("src/modules/**/events/**/*.{js,ts}", {
    cwd: process.cwd(),
    ignore: ["**/*.{test,spec}.{js,ts}", "**/_*"],
  });

  if (!eventFiles.length) return events;

  for (const file of eventFiles) {
    const { config, run }: EventConfigWithRun = await import(file);

    if (!config || !run)
      throw new Error("Event file must export both config and run");

    const eventKey = `${config.name}${config.once ? "_once" : ""}`;

    if (events.has(eventKey))
      throw new Error(
        `Duplicate event ${config.name}${config.once ? " (once)" : ""}`
      );

    events.set(eventKey, { config, run });
  }

  if (events.size > 0) {
    Console.Log(
      `📡 Loaded ${events.size} event${events.size === 1 ? "" : "s"}`
    );
  }
  return events;
};

const registerEvents = (events: EventsMap) => {
  for (const [, { config, run }] of events) {
    if (config.once) {
      client.once(config.name, run);
    } else {
      client.on(config.name, run);
    }
  }
};

export const initEventHandler = async () => {
  const events = await setupEventFiles();
  if (!events.size) {
    Console.Warn("No events found, skipping event registration.");
    return;
  }

  registerEvents(events);
};
