import { client } from "@lib/client";

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.BOT_TOKEN);
