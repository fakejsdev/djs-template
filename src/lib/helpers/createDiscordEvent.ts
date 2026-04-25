import type { ClientEvents } from "discord.js";

export function createDiscordEvent<T extends keyof ClientEvents>(
	config: DiscordEventConfig<T>,
	run: DiscordEventRun<T>,
): DiscordEventConfigWithRun<T> {
	return { config, run };
}
