import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	TextDisplayBuilder,
} from "discord.js";
import { createCommand } from "@/lib/helpers/createCommand";

export default createCommand(
	new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async (interaction) => {
		const containerBuilder = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent("## Ping Pong!"),
			)
			.setAccentColor(0x0099ff)
			.addActionRowComponents(
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId("ping-button")
						.setLabel("Click me!")
						.setStyle(ButtonStyle.Primary),
				),
			)
			.addActionRowComponents(
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("example-dropdown")
						.setPlaceholder("Select an option")
						.addOptions([
							{
								label: "Option 1",
								value: "example-option-1",
							},
							{
								label: "Option 2",
								value: "example-option-2",
							},
							{
								label: "Option 3",
								value: "example-option-3",
							},
						]),
				),
			);

		return await interaction.reply({
			components: [containerBuilder],
			flags: ["IsComponentsV2"],
		});
	},
);
