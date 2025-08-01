import { Console } from "@/lib/utils";
import { client } from "@lib/client";

client.on("ready", () => {
  Console.Log(`🤖 Logged in as ${client.user?.tag}`);
});

client.login(process.env.BOT_TOKEN);
