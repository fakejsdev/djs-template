import { createDbEvent } from "@/lib/helpers/createDbEvent";

const { config, run } = createDbEvent(
	{
		name: "Example Post Create Event",
		on: "Post.Create",
		description: "Do smth on post create",
	},
	async (payload) => {
		console.log(payload.content);
	},
);
