export function createDatabaseEvent<T extends DatabaseEventName>(
	config: DatabaseEventConfig<T>,
	run: DatabaseEventRun<T>,
): DatabaseEventConfigWithRun<T> {
	return { config, run };
}
