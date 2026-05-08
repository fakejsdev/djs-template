import { createDropdown } from "@/lib/helpers/createDropdown";

export default createDropdown(
	{
		customId: "example-dropdown",
		name: "Example Dropdown",
		description: "Fallback for unhandled dropdown interactions",
	},
	async (interaction) => {
		const selectedValue = interaction.values[0];

		return await interaction.reply({
			content: `I'm fallback, selected: ${selectedValue}`,
			flags: ["Ephemeral"],
		});
	},
);
