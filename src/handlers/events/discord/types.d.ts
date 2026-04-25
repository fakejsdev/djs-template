import type { ClientEvents } from "discord.js";

declare global {
	type DiscordEventConfig<T extends keyof ClientEvents = keyof ClientEvents> = {
		name: string;
		on: T;
		once?: boolean;
		description?: string;
	};

	type DiscordEventRun<T extends keyof ClientEvents = keyof ClientEvents> = (
		...args: ClientEvents[T]
	) => Promise<void> | void;

	type DiscordEventConfigWithRun<
		T extends keyof ClientEvents = keyof ClientEvents,
	> = {
		config: DiscordEventConfig<T>;
		run: DiscordEventRun<T>;
	};
}
