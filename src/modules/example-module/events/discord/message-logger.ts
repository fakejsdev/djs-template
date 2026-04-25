export const config: DiscordEventConfig = {
	name: "messageCreate",
	description: "Logs every message sent in the server",
};

export const run: DiscordEventRun<"messageCreate"> = async (message) => {
	console.log(`[${message.author.tag}] ${message.content}`);
};
