import type { ClientEvents } from "discord.js";

declare global {
  type EventConfig = {
    name: keyof ClientEvents;
    once?: boolean;
    description?: string;
  };

  type EventRun<T extends keyof ClientEvents> = (
    ...args: ClientEvents[T]
  ) => Promise<void> | void;

  type EventConfigWithRun = {
    config: EventConfig;
    run: EventRun<any>;
  };
}
