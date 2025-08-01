import { Console } from "@/lib/utils";
import { client } from "@lib/client";
import { globSync } from "glob";

type CommandsMap = Map<string, CommandConfigWithRun>;

// src/modules/**/commands */
export const setupCommandFiles = async (dir: string) => {
  const commands: CommandsMap = new Map();

  const commandFiles = globSync(dir);
  if (!commandFiles.length) return commands;

  for (const file of commandFiles) {
    const { config, run }: CommandConfigWithRun = await import(file);

    if (!config || !run)
      throw new Error("Command file must export both config and run");

    if (commands.has(config.name))
      throw new Error(`Duplicate command name ${config.name}`);

    Console.Log(`(/) Loaded command ${config.name}`);
    commands.set(config.name, { config, run });
  }

  return commands;
};

export const registerSlashCommand = async (commands: CommandsMap) => {
  const guildId = process.env.GUILD_ID;
  if (!guildId) throw new Error("GUILD_ID is not set in environment variables");

  const guild = client.guilds.cache.get(guildId);
  if (!guild) throw new Error(`Guild with ID ${guildId} not found`);

  for (const [name, { config }] of commands) {
    await guild.commands
      .create(config)
      .then(() => {
        Console.Log(`(+) Registered command ${name}`);
      })
      .catch((err) => {
        Console.Error(`Error registering command ${name} :`, err);
      });
  }

  Console.Log(`(+) Registered ${commands.size} commands in ${guild.name}`);
};

export const handleCommands = (commands: CommandsMap) => {
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
};
