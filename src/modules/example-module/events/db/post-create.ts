import { createDatabaseEvent } from "@/lib/helpers/createDatabaseEvent";

const { config, run } = createDatabaseEvent(
	{
		name: "Example Post Create Event",
		on: "Post.Create",
		description: "Do smth on post create",
	},
	async (payload) => {
		console.log(payload.content);
	},
);
