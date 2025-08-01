export const config: DropdownConfig = {
  customId: "example-dropdown",
  name: "Example Dropdown",
  description: "An example dropdown component",
};

export const run: DropdownRun = async (interaction) => {
  const selectedValues = interaction.values;

  await interaction.reply({
    content: `You selected: ${selectedValues.join(", ")}`,
    flags: ["Ephemeral"],
  });
};
