import { createDiscordEvent } from "@/lib/helpers/createDiscordEvent";

export const { config, run } = createDiscordEvent(
	{
		name: "Message Logger",
		on: "messageCreate",
		description: "Logs messages to the console.",
	},
	async (message) => {
		if (message.author.bot) return;
		console.log(`[${message.author.tag}] ${message.content}`);
	},
);
