import { createDatabaseEvent } from "@/lib/helpers/createDatabaseEvent";
import { Console } from "@/lib/utils";

export const { config, run } = createDatabaseEvent(
	{
		name: "Post Create Logger",
		on: "Post.Create",
		description: "Console Logs once a post is created",
	},
	async (payload) => {
		Console.Log("Post created with payload:", payload);
	},
);
