import { createDatabaseEvent } from "@/lib/helpers/createDatabaseEvent";
import { Console } from "@/lib/utils";

export const { config, run } = createDatabaseEvent(
	{
		name: "Example Post Create Event",
		on: "Post.Create",
		description: "Do smth on post create",
	},
	async (payload) => {
		Console.Log("Post created with payload:", payload);
	},
);
