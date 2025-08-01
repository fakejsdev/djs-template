import type { ClientEvents } from "discord.js";

export function createEvent<K extends keyof ClientEvents>(
  config: {
    name: K;
    once?: boolean;
    description?: string;
  },
  run: (...args: ClientEvents[K]) => Promise<void> | void
) {
  return { config, run };
}
