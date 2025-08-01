import type { ClientEvents } from "discord.js";

declare global {
  type EventConfig<K extends keyof ClientEvents = keyof ClientEvents> = {
    name: K;
    once?: boolean;
    description?: string;
  };

  type EventRun<K extends keyof ClientEvents = keyof ClientEvents> = (
    ...args: ClientEvents[K]
  ) => Promise<void> | void;

  type EventConfigWithRun<K extends keyof ClientEvents = keyof ClientEvents> = {
    config: EventConfig<K>;
    run: EventRun<K>;
  };
}
