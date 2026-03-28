export const config: EventConfig = {
  name: "messageCreate",
  description: "Logs every message sent in the server",
};

export const run: EventRun<"messageCreate"> = async (message) => {
  console.log(`[${message.author.tag}] ${message.content}`);
};
