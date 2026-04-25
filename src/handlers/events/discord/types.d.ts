import type { ClientEvents } from "discord.js";

declare global {
	type DiscordEventConfig = {
		name: keyof ClientEvents;
		once?: boolean;
		description?: string;
	};

	type DiscordEventRun<T extends keyof ClientEvents> = (
		...args: ClientEvents[T]
	) => Promise<void> | void;

	type DiscordEventConfigWithRun = {
		config: DiscordEventConfig;
		run: DiscordEventRun<unknown>;
	};
}
