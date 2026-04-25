import type { Prisma } from "@lib/prisma/generated/client";

declare global {
	type DbAction = "Create" | "Update" | "Delete";

	type DbEventName = `${Prisma.ModelName}.${DbAction}`;

	type PayloadType<T extends string> = T extends Prisma.ModelName
		? Prisma.TypeMap["model"][T]["payload"]["scalars"]
		: never;

	type DbEventConfig<T extends DbEventName = DbEventName> = {
		name: string;
		on: T;
		description?: string;
	};

	type DbEventRun<T extends DbEventName = DbEventName> = (
		data: T extends `${infer Model}.${DbAction}` ? PayloadType<Model> : unknown,
	) => Promise<void> | void;

	type DbEventConfigWithRun<T extends DbEventName = DbEventName> = {
		config: DbEventConfig<T>;
		run: DbEventRun<T>;
	};
}
