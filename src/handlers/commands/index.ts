import path from "node:path";
import { globSync } from "glob";
import { client } from "@/lib/discord";
import { Console } from "@/lib/utils";

type CommandsMap = Map<string, CommandConfigWithRun>;

const setupCommandFiles = async () => {
	const commands: CommandsMap = new Map();

	const commandFiles = globSync("src/modules/**/*.command.{js,ts}", {
		cwd: process.cwd(),
		ignore: ["**/*.{test,spec}.{js,ts}", "**/_*"],
	});
	if (!commandFiles.length) return commands;

	for (const file of commandFiles) {
		const module = await import(path.resolve(file));
		const commandData: CommandConfigWithRun = module.default || module;

		if (!commandData?.config || !commandData?.run)
			throw new Error(
				`Command file ${file} must export config and run (preferably as default using createCommand)`,
			);

		if (commands.has(commandData.config.name))
			throw new Error(`Duplicate command name ${commandData.config.name}`);

		commands.set(commandData.config.name, commandData);
	}

	if (commands.size > 0) {
		Console.Log(
			`🔧 Loaded ${commands.size} command${commands.size === 1 ? "" : "s"}`,
		);
	}
	return commands;
};

const registerSlashCommand = async (commands: CommandsMap) => {
	const guildId = process.env.GUILD_ID;
	if (!guildId) throw new Error("GUILD_ID is not set in environment variables");

	const guild = client.guilds.cache.get(guildId);
	if (!guild) throw new Error(`Guild with ID ${guildId} not found`);

	for (const [name, { config }] of commands) {
		await guild.commands.create(config).catch((err) => {
			Console.Error(`Error registering command ${name} :`, err);
		});
	}

	Console.Log(
		`🎯 Registered ${commands.size} command${
			commands.size === 1 ? "" : "s"
		} in ${guild.name}`,
	);
};

const startCommandHandling = async (commands: CommandsMap) => {
	client.on("interactionCreate", async (i) => {
		if (!i.isChatInputCommand() || !i.inCachedGuild()) return;

		const command = commands.get(i.commandName);
		if (!command) return Console.Error(`Command ${i.commandName} not found`);

		await command
			.run(i)
			.catch((err) => {
				Console.Error(`Error running command ${i.commandName}`, err);
			})
			.finally(() => {
				Console.Log(`(✓) Command ${i.commandName} executed`);
			});
	});

	await registerSlashCommand(commands);
};

export const initCommandHandler = async () => {
	const commands = await setupCommandFiles();
	if (!commands.size)
		return Console.Warn("No commands found, skipping command registration.");

	await startCommandHandling(commands);
};
