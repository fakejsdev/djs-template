export function createCommand(
	config: CommandConfig,
	run: CommandRun,
): CommandConfigWithRun {
	return { config, run };
}
