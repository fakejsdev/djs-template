export const config: DropdownConfig = {
  parentCustomId: "example-dropdown",
  value: "option2",
  name: "Option 2",
  description: "Second option from the example dropdown",
};

export const run: DropdownRun = async (interaction) => {
  return await interaction.reply({
    content:
      "You selected Option 2! This was handled by a dedicated option file.",
    flags: ["Ephemeral"],
  });
};
