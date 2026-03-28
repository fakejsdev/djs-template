import { createEvent } from "@/lib/discord/createEvent";

export const { config, run } = createEvent(
  {
    name: "messageCreate",
    description: "Log messages for moderation",
  },
  async (message) => {
    if (message.author.bot) return;

    console.log(`💬 ${message.author.tag}: ${message.content}`);
  },
);
