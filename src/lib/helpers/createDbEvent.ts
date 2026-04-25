export function createDbEvent<T extends DbEventName>(
	config: DbEventConfig<T>,
	run: DbEventRun<T>,
): DbEventConfigWithRun<T> {
	return { config, run };
}
