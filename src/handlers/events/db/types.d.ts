declare global {
	type DbEventConfig = {
		name: string;
		description?: string;
	};

	type DbEventRun = () => Promise<void> | void;

	type DbEventConfigWithRun = {
		config: DbEventConfig;
		run: DbEventRun;
	};
}
