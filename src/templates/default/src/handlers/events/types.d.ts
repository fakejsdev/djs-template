import type { ClientEvents } from "discord.js";

declare global {
  type EventConfig = {
    name: keyof ClientEvents;
    once?: boolean;
    description?: string;
  };

  type EventRun = (...args: any[]) => Promise<void> | void;

  type EventConfigWithRun = {
    config: EventConfig;
    run: EventRun;
  };
}
