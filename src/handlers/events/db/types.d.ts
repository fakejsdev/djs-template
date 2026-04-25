import type { Prisma } from "@lib/prisma/generated/client";

declare global {
	type DatabaseAction = "Create" | "Update" | "Delete";

	type DatabaseEventName = `${Prisma.ModelName}.${DatabaseAction}`;

	type PayloadType<T extends string> = T extends Prisma.ModelName
		? Prisma.TypeMap["model"][T]["payload"]["scalars"]
		: never;

	type DatabaseEventConfig<T extends DatabaseEventName = DatabaseEventName> = {
		name: string;
		on: T;
		description?: string;
	};

	type DatabaseEventRun<T extends DatabaseEventName = DatabaseEventName> = (
		data: T extends `${infer Model}.${DatabaseAction}`
			? PayloadType<Model>
			: unknown,
	) => Promise<void> | void;

	type DatabaseEventConfigWithRun<
		T extends DatabaseEventName = DatabaseEventName,
	> = {
		config: DatabaseEventConfig<T>;
		run: DatabaseEventRun<T>;
	};
}
