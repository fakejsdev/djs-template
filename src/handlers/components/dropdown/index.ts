import path from "node:path";
import { globSync } from "glob";
import { Console } from "@/lib/utils";

type DropdownsMap = Map<string, DropdownConfigWithRun>;

const dropdowns: DropdownsMap = new Map();

export const setupDropdownFiles = async () => {
	const dropdownFiles = globSync(
		"src/modules/**/components/dropdowns/**/*.{js,ts}",
		{
			cwd: process.cwd(),
			ignore: ["**/*.{test,spec}.{js,ts}", "**/_*"],
		},
	);

	if (!dropdownFiles.length) return dropdowns;

	for (const file of dropdownFiles) {
		const { config, run }: DropdownConfigWithRun = await import(
			path.resolve(file)
		);

		if (!config || !run)
			throw new Error("Dropdown file must export both config and run");

		if (dropdowns.has(config.customId))
			throw new Error(`Duplicate dropdown customId ${config.customId}`);

		dropdowns.set(config.customId, { config, run });
	}

	return dropdowns;
};

export const handleDropdownInteraction = async (i: DropdownInteraction) => {
	const dropdown = dropdowns.get(i.customId);
	if (!dropdown) return;

	try {
		await dropdown.run(i);
	} catch (error) {
		Console.Error(`Error running dropdown ${i.customId}`, error);
	}
};
