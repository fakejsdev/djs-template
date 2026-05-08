export function createButton(
	config: ButtonConfig,
	run: ButtonRun,
): ButtonConfigWithRun {
	return { config, run };
}
