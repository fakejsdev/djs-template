export const config: DropdownConfig = {
  parentCustomId: 'example-dropdown',
  value: 'option1',
  name: 'Option 1',
  description: 'First option from the example dropdown',
};

export const run: DropdownRun = async (interaction) => {
  return await interaction.reply({
    content: 'You selected Option 1! This was handled by a dedicated option file.',
    flags: ['Ephemeral'],
  });
};
