import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import { client } from '@/lib/discord';
import { Console } from '@/lib/utils';

type CommandsMap = Map<string, CommandConfigWithRun>;

const setupCommandFiles = async () => {
  const commands: CommandsMap = new Map();

  const commandFiles = globSync('src/modules/**/*.command.{js,ts}', {
    cwd: process.cwd(),
    ignore: ['**/*.{test,spec}.{js,ts}', '**/_*'],
  });
  if (!commandFiles.length) return commands;

  for (const file of commandFiles) {
    const module = await import(path.resolve(file));
    const commandData: CommandConfigWithRun = module;

    if (!commandData?.config || !commandData?.run)
      throw new Error(`Command file ${file} must export named \`config\` and \`run\``);

    if (commands.has(commandData.config.name))
      throw new Error(`Duplicate command name ${commandData.config.name}`);

    commands.set(commandData.config.name, commandData);
  }

  if (commands.size > 0) {
    Console.Log(`🔧 Loaded ${commands.size} command${commands.size === 1 ? '' : 's'}`);
  }
  return commands;
};

const CACHE_FILE = path.join(process.cwd(), '.commands-hash');

const registerSlashCommand = async (commands: CommandsMap) => {
  const guildId = process.env.GUILD_ID;
  if (!guildId) throw new Error('GUILD_ID is not set in environment variables');

  const guild = client.guilds.cache.get(guildId);
  if (!guild) throw new Error(`Guild with ID ${guildId} not found`);

  const finalCommands = Array.from(commands.values()).map((c) => c.config);

  const commandsJson = JSON.stringify(finalCommands.map((c) => c.toJSON()));
  const currentHash = crypto.createHash('md5').update(commandsJson).digest('hex');

  if (fs.existsSync(CACHE_FILE)) {
    const previousHash = fs.readFileSync(CACHE_FILE, 'utf-8');
    if (previousHash === currentHash) {
      Console.Log(`⏩ Commands unchanged. Skipping API registration (Fast Boot).`);
      return;
    }
  }

  await guild.commands.set(finalCommands).catch((err: unknown) => {
    Console.Error(`Error registering commands:`, err);
  });

  fs.writeFileSync(CACHE_FILE, currentHash);
  Console.Log(`🎯 Registered ${finalCommands.length} base command(s) in ${guild.name}`);
};

const startCommandHandling = async (commands: CommandsMap) => {
  client.on('interactionCreate', async (i) => {
    if (!i.isChatInputCommand() || !i.inCachedGuild()) return;

    const command = commands.get(i.commandName);
    if (!command) return Console.Error(`Command ${i.commandName} not found`);

    try {
      await command.run(i);
    } catch (err: unknown) {
      Console.Error(`Error running command ${i.commandName}`, err);
    } finally {
      Console.Log(`(✓) Command ${i.commandName} executed`);
    }
  });

  await registerSlashCommand(commands);
};

export const initCommandHandler = async () => {
  const commands = await setupCommandFiles();
  if (!commands.size) return Console.Warn('No commands found, skipping command registration.');

  await startCommandHandling(commands);
};
