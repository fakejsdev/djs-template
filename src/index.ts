import { client } from "@/lib/discord";
import { Console } from "@/lib/utils";
import { HandlersManager } from "./handlers";

const manager = new HandlersManager()
	.setupEventHandler()
	.setupCommandHandler()
	.setupComponentHandler();

client.on("ready", async () => {
	await manager.build();
	Console.Log(`Logged in as ${client.user?.tag}`);
});

client.login(process.env.BOT_TOKEN);
