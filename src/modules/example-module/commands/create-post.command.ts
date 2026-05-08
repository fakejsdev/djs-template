import { SlashCommandBuilder } from "discord.js";
import { createCommand } from "@/lib/helpers/createCommand";
import prisma from "@/lib/prisma";

export default createCommand(
	new SlashCommandBuilder()
		.setName("create-post")
		.setDescription("Creates a new post!")
		.addStringOption((option) =>
			option
				.setName("title")
				.setDescription("The title of the post")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("content")
				.setDescription("The content of the post")
				.setRequired(true),
		),
	async (interaction) => {
		const title = interaction.options.getString("title", true);
		const content = interaction.options.getString("content", true);

		const post = await prisma.post.create({
			data: {
				title,
				content,
			},
		});

		await interaction.reply(`Post created with ID: ${post.id}`);

		const fetchedPost = await prisma.post.findUnique({
			where: { id: post.id },
		});

		return await interaction.followUp(
			`Fetched Post: ${fetchedPost?.title} - ${fetchedPost?.content}`,
		);
	},
);
