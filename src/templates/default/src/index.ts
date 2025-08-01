import { Console } from "@/lib/utils";
import { HandlersManager } from "./handlers";
import { client } from "@lib/client";

const manager = new HandlersManager().setupCommandHandler({
  dir: "src/modules/**/commands/**/*.{js,ts}", // Glob pattern for command files
});

client.on("ready", async () => {
  await manager.build();
  Console.Log(`Logged in as ${client.user?.tag}`);
});

client.login(process.env.BOT_TOKEN);
