import path from "node:path";
import { globSync } from "glob";
import { Console } from "@/lib/utils";

type DropdownsMap = Map<string, DropdownConfigWithRun>;
type DropdownOptionsMap = Map<string, Map<string, DropdownConfigWithRun>>;

const dropdowns: DropdownsMap = new Map();
const dropdownOptions: DropdownOptionsMap = new Map();

export const setupDropdownFiles = async () => {
	const dropdownFiles = globSync("src/modules/**/*.{dropdown,option}.{js,ts}", {
		cwd: process.cwd(),
		ignore: ["**/*.{test,spec}.{js,ts}", "**/_*"],
	});

	const allComponentsCount = new Map<string, DropdownConfigWithRun>();
	if (!dropdownFiles.length) return allComponentsCount;

	for (const file of dropdownFiles) {
		const module = await import(path.resolve(file));
		const dropdownData: DropdownConfigWithRun = module.default || module;
		const config = dropdownData?.config;
		const run = dropdownData?.run;

		if (!config || !run)
			throw new Error(
				`Dropdown file must export both config and run (Error in: ${file}, preferably as default using createDropdown)`,
			);

		if (config.customId) {
			if (dropdowns.has(config.customId))
				throw new Error(`Duplicate dropdown customId: ${config.customId}`);
			dropdowns.set(config.customId, { config, run });
			allComponentsCount.set(config.customId, { config, run });
		} else if (config.parentCustomId && config.value) {
			let parentOptions = dropdownOptions.get(config.parentCustomId);
			if (!parentOptions) {
				parentOptions = new Map();
				dropdownOptions.set(config.parentCustomId, parentOptions);
			}

			if (parentOptions.has(config.value)) {
				throw new Error(
					`Duplicate option value '${config.value}' for '${config.parentCustomId}'`,
				);
			}
			parentOptions.set(config.value, { config, run });
			allComponentsCount.set(`${config.parentCustomId}:${config.value}`, {
				config,
				run,
			});
		} else {
			throw new Error(
				`Missing 'customId' OR 'parentCustomId' and 'value' in config (Error in: ${file})`,
			);
		}
	}

	return allComponentsCount;
};

export const handleDropdownInteraction = async (
	i: DropdownInteraction<"cached">,
) => {
	try {
		const selectedValue = i.values[0];
		const parentOptionsMap = dropdownOptions.get(i.customId);

		if (selectedValue && parentOptionsMap?.has(selectedValue)) {
			const optionHandler = parentOptionsMap.get(selectedValue);
			await optionHandler!.run(i);
			return;
		}

		const baseDropdown = dropdowns.get(i.customId);
		if (baseDropdown) {
			await baseDropdown.run(i);
			return;
		}

		Console.Warn(
			`No handler found for dropdown ${i.customId} and its option: ${selectedValue}`,
		);
	} catch (error) {
		Console.Error(`Error running dropdown ${i.customId}`, error);
	}
};
