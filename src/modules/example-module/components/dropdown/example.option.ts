import { createDropdown } from "@/lib/helpers/createDropdown";

export default createDropdown(
	{
		parentCustomId: "example-dropdown",
		value: "example-option-1",
		description: "Example option 1 handler",
	},
	(interaction) => {
		return interaction.reply({ content: "You selected handled option 1!" });
	},
);
