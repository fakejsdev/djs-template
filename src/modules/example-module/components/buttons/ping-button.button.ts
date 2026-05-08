import { createButton } from "@/lib/helpers/createButton";

export default createButton(
	{
		customId: "ping-button",
		name: "Ping Button",
		description: "A button that responds with Pong!",
	},
	async (interaction) => {
		await interaction.reply({ content: "Pong from button!", ephemeral: true });
	},
);
