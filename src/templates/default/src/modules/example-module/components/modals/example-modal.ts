export const config: ModalConfig = {
  customId: "example-modal",
  name: "Example Modal",
  description: "An example modal for demonstration purposes",
};

export const run: ModalRun = async (interaction) => {
  const response = `You submitted ${interaction.fields.getTextInputValue(
    "exampleInput"
  )}`;

  return await interaction.reply({
    content: response,
    flags: ["Ephemeral"],
  });
};
