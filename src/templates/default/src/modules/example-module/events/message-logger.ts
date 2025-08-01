export const config: EventConfig<"messageCreate"> = {
  name: "messageCreate",
  description: "Log messages for moderation",
};

export const run: EventRun<"messageCreate"> = async (message) => {
  if (message.author.bot) return;

  console.log(`💬 ${message.author.tag}: ${message.content}`);
};
