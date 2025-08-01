export const config: ButtonConfig = {
  customId: "ping-button",
  name: "Ping Button",
  description: "A button that responds with Pong!",
};

export const run: ButtonRun = async (interaction) => {
  return await interaction.reply({
    content: "Pong!",
    flags: ["Ephemeral"],
  });
};
